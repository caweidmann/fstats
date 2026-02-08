import { formatISO } from 'date-fns'

import type { StatsFile, StatsFileAtRest } from '@/types'
import { db } from '@/lib/localforage'

import { parseStatsFile, syncStatsFile } from './helper'

export const getFile = async (id: string): Promise<StatsFile | null> => {
  if (!id) {
    throw new Error('No ID provided!')
  }
  const file = await db.filesStore.getItem<StatsFileAtRest>(id)
  return file ? parseStatsFile(file) : null
}

export const getFiles = async (): Promise<StatsFile[]> => {
  const files: StatsFile[] = []
  await db.filesStore.iterate<StatsFileAtRest, void>((value) => {
    files.push(parseStatsFile(value))
  })
  return files
}

export const addFile = async (file: StatsFile): Promise<StatsFile> => {
  if (!file) {
    throw new Error('No file provided!')
  }
  if (!file.file) {
    throw new Error('StatsFile requires the `file` to be present!')
  }

  const modified = formatISO(new Date())
  const updatedFile: StatsFile = {
    ...file,
    id: crypto.randomUUID(),
    created: modified,
    modified,
  }

  await db.filesStore.setItem<StatsFileAtRest>(updatedFile.id, syncStatsFile(updatedFile))

  return updatedFile
}

export const addFiles = async (files: StatsFile[]): Promise<StatsFile[]> => {
  const promises = files.map((file) => addFile(file))
  const addedFiles = await Promise.all(promises)
  return addedFiles
}

export const updateFile = async (id: string, updates: Partial<StatsFile>): Promise<StatsFile> => {
  const file = await db.filesStore.getItem<StatsFileAtRest>(id)

  if (!file) {
    throw new Error(`File with id ${id} not found`)
  }

  const modified = formatISO(new Date())
  const updatedFile: StatsFile = {
    ...parseStatsFile(file),
    ...updates,
    modified,
  }

  await db.filesStore.setItem<StatsFileAtRest>(id, syncStatsFile(updatedFile))

  return updatedFile
}

export const updateFiles = async (
  filesToUpdate: { id: string; updates: Partial<StatsFile> }[],
): Promise<StatsFile[]> => {
  const promises = filesToUpdate.map(({ id, updates }) => updateFile(id, updates))
  return await Promise.all(promises)
}

export const removeFile = async (id: string): Promise<void> => {
  await db.filesStore.removeItem(id)
}

export const removeFiles = async (ids: string[]): Promise<void> => {
  const promises = ids.map((id) => removeFile(id))
  await Promise.all(promises)
}

export const removeAllFiles = async (): Promise<void> => {
  await db.filesStore.clear()
}

'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { initStorage } from '@/lib/localforage'

type StorageProps = {
  children: ReactNode
}

const Component = ({ children }: StorageProps) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await initStorage()
      setIsLoading(false)
    }
    init()
  }, [])

  if (isLoading) {
    return null
  }

  return children
}

export default Component

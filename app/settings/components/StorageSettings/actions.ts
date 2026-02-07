import { formatFileSize } from '@/utils/File'

/**
 * Calculates the actual size of data stored in IndexedDB
 * by iterating through the object store with a cursor
 */
export const calculateStorageSize = async (): Promise<number> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fstats')

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'))
    }

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      let totalSize = 0

      try {
        const transaction = db.transaction(['fstats__files'], 'readonly')
        const objectStore = transaction.objectStore('fstats__files')
        const cursorRequest = objectStore.openCursor()

        cursorRequest.onsuccess = (cursorEvent) => {
          const cursor = (cursorEvent.target as IDBRequest<IDBCursorWithValue>).result

          if (cursor) {
            // Get the stored object and calculate its size
            const storedObject = cursor.value
            const json = JSON.stringify(storedObject)
            // Count bytes in UTF-8 encoding
            totalSize += new Blob([json]).size
            cursor.continue()
          } else {
            // No more items, resolve with total size
            db.close()
            resolve(totalSize)
          }
        }

        cursorRequest.onerror = () => {
          db.close()
          reject(new Error('Failed to iterate through IndexedDB'))
        }
      } catch (error) {
        db.close()
        reject(error)
      }
    }
  })
}

export const getStorageInfo = async (fileCount: number): Promise<string> => {
  if (fileCount === 0) {
    return 'No files stored'
  }

  const size = await calculateStorageSize()
  const formattedSize = formatFileSize(size)

  if (fileCount === 1) {
    return `1 file (${formattedSize})`
  }

  return `${fileCount} files (${formattedSize})`
}

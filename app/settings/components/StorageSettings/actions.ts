/**
 * Calculates the actual size of data stored in IndexedDB
 * by iterating through the object store with a cursor
 */
export const calculateStorageSize = async (): Promise<number> => {
  return new Promise((resolve, reject) => {
    // Open the IndexedDB database directly
    const request = indexedDB.open('fstats')

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'))
    }

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      let totalSize = 0

      try {
        // Open a transaction on the files store
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

/**
 * Formats bytes into human-readable format (B, KB, MB, GB)
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const value = bytes / Math.pow(k, i)
  const formatted = i === 0 ? value.toString() : value.toFixed(1)

  return `${formatted} ${sizes[i]}`
}

/**
 * Returns formatted storage info string
 */
export const getStorageInfo = async (fileCount: number): Promise<string> => {
  if (fileCount === 0) return 'No files stored'

  const size = await calculateStorageSize()
  const formattedSize = formatBytes(size)

  if (fileCount === 1) return `1 file (${formattedSize})`

  return `${fileCount} files (${formattedSize})`
}

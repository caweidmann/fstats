import { useEffect, useState } from 'react'

type StorageInfo = {
  usage: number | null
  quota: number | null
}

function formatBytes(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let value = bytes

  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i += 1
  }

  return `${value.toFixed(2)} ${units[i]}`
}

const Component = () => {
  const [storage, setStorage] = useState<StorageInfo>({
    usage: null,
    quota: null,
  })
  const [clearing, setClearing] = useState(false)

  async function refreshStorageInfo() {
    if (!('storage' in navigator) || !navigator.storage.estimate) {
      return
    }

    const estimate = await navigator.storage.estimate()
    setStorage({
      usage: estimate.usage ?? null,
      quota: estimate.quota ?? null,
    })
  }

  useEffect(() => {
    refreshStorageInfo()
  }, [])

  async function deleteAllData() {
    const confirmed = window.confirm('This will delete all locally stored app data. Continue?')
    if (!confirmed) return

    setClearing(true)

    try {
      // 1. Clear localStorage
      localStorage.clear()

      // 2. Clear all IndexedDB databases (Chromium + Firefox)
      if (indexedDB.databases) {
        const databases = await indexedDB.databases()
        await Promise.all(
          databases.map((db) => {
            if (db.name) {
              const dbName = db.name // Capture name in closure for TypeScript
              return new Promise<void>((resolve, reject) => {
                const request = indexedDB.deleteDatabase(dbName)
                request.onsuccess = () => resolve()
                request.onerror = () => reject()
                request.onblocked = () => resolve() // still consider cleared
              })
            }
          }),
        )
      }

      // Optional: clear Cache API if you use it
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((name) => caches.delete(name)))
      }
    } finally {
      setClearing(false)
      refreshStorageInfo()
    }
  }

  if (storage.usage == null || storage.quota == null) {
    return <p>Storage usage unavailable</p>
  }

  const percentUsed = (storage.usage / storage.quota) * 100

  return (
    <div>
      <h3>App storage usage</h3>

      <p>
        Used: <strong>{formatBytes(storage.usage)}</strong>
      </p>
      <p>
        Available: <strong>{formatBytes(storage.quota)}</strong>
      </p>
      <p>{percentUsed.toFixed(1)}% of available storage used</p>

      <button onClick={deleteAllData} disabled={clearing}>
        {clearing ? 'Deleting…' : 'Delete all local data'}
      </button>
    </div>
  )
}

export default Component

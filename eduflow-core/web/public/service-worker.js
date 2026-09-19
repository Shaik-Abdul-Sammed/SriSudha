const CACHE_NAME = 'sri-venkateswara-v1'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
]

// Install event

// Helpers for offline IndexedDB operations
function getOfflineSearches(db) {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction('offlineSearches', 'readonly')
      const store = tx.objectStore('offlineSearches')
      const req = store.getAll()
      req.onsuccess = () => resolve(req.result || [])
      req.onerror = () => reject(req.error)
    } catch (err) {
      reject(err)
    }
  })
}

function removeOfflineSearch(db, id) {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction('offlineSearches', 'readwrite')
      const store = tx.objectStore('offlineSearches')
      const req = store.delete(id)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    } catch (err) {
      reject(err)
    }
  })
}
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE)
    })
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip API requests
  if (url.pathname.startsWith('/api')) {
    return
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response
        }

        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache)
        })

        return response
      })
      .catch(() => {
        return caches.match(request).then((response) => {
          return (
            response ||
            new Response('Offline - Resource not available', {
              status: 503,
              statusText: 'Service Unavailable',
            })
          )
        })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-searches') {
    event.waitUntil(syncOfflineSearches())
  }
})

async function syncOfflineSearches() {
  try {
    const db = await openIndexedDB()
    const offlineSearches = await getOfflineSearches(db)

    for (const search of offlineSearches) {
      try {
        await fetch('/api/search/recent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(search),
        })

        await removeOfflineSearch(db, search.id)
      } catch (error) {
        console.error('Failed to sync search:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// IndexedDB helpers
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SriVenkateswaraDB', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('offlineSearches')) {
        db.createObjectStore('offlineSearches', { keyPath: 'id' })
      }
    }
  })
}

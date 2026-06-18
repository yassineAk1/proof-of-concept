const VERSION = 'v1'
const PRECACHE = `funda-precache-${VERSION}`
const RUNTIME = `funda-runtime-${VERSION}`
const OFFLINE_URL = '/offline'

const PRECACHE_URLS = [
  OFFLINE_URL,
  '/manifest.json',
  '/styles/style.css',
  '/script.js',
  '/fonts/ProximaNova-Regular.otf',
  '/fonts/ProximaNova-Semibold.otf',
  '/fonts/ProximaNova-Bold.otf',
  '/icons-header/Logo.svg',
  '/icons/funda-icon.png',
  '/icons/funda-512.png',
  '/icons/no-internet@2x.svg',
  '/icons/heart@2x.svg',
  '/icons/heart-filled-red@2x.svg',
  '/icons/check-bold@2x.svg',
  '/images/placeholder-huis.jpg',
]

// Zet bij installatie de hele app-shell vast in de cache.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

// Ruim bij activatie de caches van oudere versies op.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== PRECACHE && key !== RUNTIME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  )
})

// Pagina's halen  van het netwerk, val anders terug op cache of offline-pagina.
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME)
  try {
    const response = await fetch(request)
    cache.put(request, response.clone())
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    if (request.mode === 'navigate') return caches.match(OFFLINE_URL)
    return Response.error()
  }
}

// Afbeeldingen, fonts, css en js direct uit de cache, haal anders op en bewaar.
async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    const cache = await caches.open(RUNTIME)
    cache.put(request, response.clone())
    return response
  } catch {
    return Response.error()
  }
}

// Kiest per type bestand de juiste strategie.
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  if (['image', 'font', 'style', 'script'].includes(request.destination)) {
    event.respondWith(cacheFirst(request))
    return
  }

  event.respondWith(networkFirst(request))
})

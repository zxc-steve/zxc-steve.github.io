self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('fox-store').then((cache) => cache.addAll([
      '/a2hs/a2hs/',
      '/a2hs/a2hs/index.html',
      '/a2hs/a2hs/index.js',
      '/a2hs/a2hs/style.css',
      '/a2hs/a2hs/images/fox1.jpg',
      '/a2hs/a2hs/images/fox2.jpg',
      '/a2hs/a2hs/images/fox3.jpg',
      '/a2hs/a2hs/images/fox4.jpg',
    ])),
  );
});

self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});

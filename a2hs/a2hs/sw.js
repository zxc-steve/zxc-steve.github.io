self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('fox-store').then((cache) => cache.addAll([
      '/zxc-steve.github.io/a2hs/a2hs/',
      '/zxc-steve.github.io/a2hs/a2hs/index.html',
      '/zxc-steve.github.io/a2hs/a2hs/index.js',
      '/zxc-steve.github.io/a2hs/a2hs/style.css',
      '/zxc-steve.github.io/a2hs/a2hs/images/fox1.jpg',
      '/zxc-steve.github.io/a2hs/a2hs/images/fox2.jpg',
      '/zxc-steve.github.io/a2hs/a2hs/images/fox3.jpg',
      '/zxc-steve.github.io/a2hs/a2hs/images/fox4.jpg',
    ])),
  );
});

self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});

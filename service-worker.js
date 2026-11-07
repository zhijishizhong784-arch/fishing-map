const CACHE='nihonkai-shell-v9';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(u.origin!==self.location.origin||e.request.method!=='GET')return;
 if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{caches.open(CACHE).then(c=>c.put('./index.html',r.clone()));return r;}).catch(()=>caches.match('./index.html')));return;}
 e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok)caches.open(CACHE).then(cache=>cache.put(e.request,r.clone()));return r;})));
});

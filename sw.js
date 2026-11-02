'use strict';
const CACHE='spese-shell-v1';
const FILES=['./','./index.html','./style.css','./app.js','./pwa.js','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('spese-shell-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 if(event.request.mode==='navigate'){
  event.respondWith((async()=>{try{const response=await fetch(event.request);if(response.ok&&!response.redirected&&response.headers.get('content-type')?.includes('text/html'))return response;return(await caches.match('./index.html'))||response;}catch(error){return(await caches.match('./index.html'))||Response.error();}})());return;
 }
 const known=FILES.map(p=>new URL(p,self.registration.scope).href);
 if(known.includes(url.href))event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});

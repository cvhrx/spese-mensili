'use strict';
let installPrompt=null,waitingWorker=null;
function connection(){document.getElementById('connection').textContent=navigator.onLine?'Sul dispositivo':'Offline';}
connection();window.addEventListener('online',connection);window.addEventListener('offline',connection);
if(matchMedia('(display-mode: standalone)').matches||navigator.standalone)document.getElementById('installHelp').textContent='App installata. Le tue spese restano su questo dispositivo.';
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;document.getElementById('install').hidden=false;});
document.getElementById('install').onclick=async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;document.getElementById('install').hidden=true;};
window.addEventListener('appinstalled',()=>{document.getElementById('install').hidden=true;document.getElementById('installHelp').textContent='App installata sulla schermata Home.';});
document.getElementById('update').onclick=()=>{if(confirm('Aggiornare l’app? Salva prima eventuali modifiche ancora nel modulo.'))waitingWorker?.postMessage({type:'SKIP_WAITING'});};
if('serviceWorker'in navigator){
 let refreshing=false;const hadController=!!navigator.serviceWorker.controller;
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(hadController&&!refreshing){refreshing=true;location.reload();}});
 navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(reg=>{
  function offer(){waitingWorker=reg.waiting;if(waitingWorker&&navigator.serviceWorker.controller)document.getElementById('update').hidden=false;}
  offer();reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed')offer();});});
  navigator.serviceWorker.ready.then(()=>{document.getElementById('offline').textContent='Pronta anche offline dopo questa prima apertura.';});
 }).catch(()=>{document.getElementById('offline').textContent='Offline non disponibile in questo browser. Apri il link in Safari o Chrome.';});
}else document.getElementById('offline').textContent='Questo browser non supporta la modalità offline.';

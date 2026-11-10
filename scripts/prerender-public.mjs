import {spawn, execFileSync} from 'node:child_process';
import {mkdir, writeFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';

for(const entry of await readdir('src/app',{recursive:true,withFileTypes:true})){
 if(entry.isDirectory() && (entry.name.startsWith('@') || /^\(\.{1,3}\)/.test(entry.name)))throw Error('Public prerender must be reviewed before adding parallel/intercepting routes: '+entry.name);
}
const server=net.createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;await new Promise(resolve=>server.close(resolve));
const origin=`http://127.0.0.1:${port}`;
const child=spawn(process.execPath,['node_modules/vinext/dist/cli.js','start','--port',String(port)],{stdio:['ignore','pipe','pipe'],windowsHide:true});
let errors='';child.stderr.on('data',data=>{errors=(errors+data.toString()).slice(-6000)});
child.stdout.on('data',()=>{});
const output=path.resolve('dist/client/_public-pages');
const build=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
function assetKey(route,rsc){return Buffer.from(route,'utf8').toString('hex')+(rsc?'.rsc':'.html');}
try {
 let ready=false;
 for(let i=0;i<120;i++){
  if(child.exitCode!==null)throw Error('Preview exited: '+errors);
  try{const r=await fetch(origin+'/sitemap.xml',{signal:AbortSignal.timeout(5000)});if(r.ok){await r.text();ready=true;break;}}catch{}
  await new Promise(resolve=>setTimeout(resolve,250));
 }
 if(!ready)throw Error('Preview did not start: '+errors);
 const sitemap=await (await fetch(origin+'/sitemap.xml')).text();
 const routes=new Set();
 for(const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)){
  const pathname=decodeURIComponent(new URL(match[1]).pathname);
  routes.add(pathname);
  if(!pathname.startsWith('/zh/'))routes.add(pathname==='/'?'/zh':'/zh'+pathname);
 }
 // The index and generated pages only contain reviewed public content.
 for(const route of routes)if(route.includes('?')||route.startsWith('/api/')||route.includes('/worksheet/preview')||route.endsWith('/practice'))throw Error('Unsafe prerender route '+route);
 await mkdir(output,{recursive:true});
 let compatibilityId='';let complete=0;const queue=[...routes];const params={};
 async function render(route){
  for(const rsc of [false,true]){
   const response=await fetch(origin+encodeURI(route)+(rsc?'.rsc':''),{headers:rsc?{'RSC':'1','Accept':'text/x-component'}:{},redirect:'manual',signal:AbortSignal.timeout(30000)});
   const body=await response.text();
   if(response.status!==200)throw Error(`${route} ${rsc?'RSC':'HTML'}: ${response.status}`);
   if(!rsc){
    if(!/<h1[ >]/.test(body)||!body.includes('rel="canonical"'))throw Error('Incomplete HTML '+route);
    if(/127\.0\.0\.1:[0-9]+/.test(body))throw Error('Local URL leaked into '+route);
   }else if(!response.headers.get('content-type')?.includes('text/x-component'))throw Error('Invalid RSC '+route);
   compatibilityId ||= response.headers.get('x-vinext-rsc-compatibility-id')||'';
   if(rsc && response.headers.has('x-vinext-params'))params[route]=response.headers.get('x-vinext-params');
   await writeFile(path.join(output,assetKey(route,rsc)),body);
  }
  complete++;if(complete%50===0)console.log(`Prerendered ${complete}/${routes.size}`);
 }
 await Promise.all(Array.from({length:3},async()=>{while(queue.length){const route=queue.shift();if(route)await render(route);}}));
 await writeFile(path.join(output,'manifest.json'),JSON.stringify({build,compatibilityId,routes:[...routes],params}));
 console.log(`Prerendered ${routes.size} public HTML/RSC pairs for ${build.slice(0,8)}.`);
}finally{child.kill('SIGTERM');}

import {rm,readFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const target=path.resolve(root,'dist');
if(JSON.parse(await readFile(path.join(root,'package.json'),'utf8')).name!=='gridhanzi' || path.dirname(target)!==path.resolve(root))throw Error('Unexpected build workspace');
// Remove only this project's reproducible build output before generating a
// matched Worker / HTML / RSC asset set. Never touch source or user artifacts.
await rm(target,{recursive:true,force:true});

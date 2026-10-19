import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const repo='C:/Users/rudek/Desktop/htdocs';
const stage='C:/xampp/htdocs/blender-course-development/revision';
const files=['public/courses/blender/.image_cache.json','public/poligon-db.json'];
const hash=p=>fs.existsSync(p)?crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'):null;
const before=files.map(p=>hash(repo+'/'+p));
const p=spawnSync(process.execPath,['--require',stage+'/deny_network.cjs','cli/build-course.mjs','blender','--offline'],{cwd:repo,encoding:'utf8',timeout:60000});
if(p.status!==0){console.error(p.stderr);console.error(p.stdout);process.exit(1);}
const after=files.map(p=>hash(repo+'/'+p));
if(JSON.stringify(before)!==JSON.stringify(after))throw new Error('Offline build changed shared metadata');
const result={build_passed:true,fetch_blocked:true,image_cache_unchanged:true,poligon_db_unchanged:true};
fs.writeFileSync(stage+'/Documentation/offline-build-proof.json',JSON.stringify(result,null,2));
console.log(result);

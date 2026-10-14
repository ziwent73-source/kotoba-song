import {readFile} from 'node:fs/promises';
import {once} from 'node:events';
import assert from 'node:assert/strict';
import {server} from '../server.mjs';
try {
  const html=await readFile('dist/index.html','utf8'),js=await readFile('dist/app.js','utf8');
  const ids=new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]));
  const refs=[...js.matchAll(/\$\('([^']+)'\)/g)].map(m=>m[1]);
  assert.deepEqual(refs.filter(x=>!ids.has(x)),[]);
  console.log('All application controls resolve to HTML elements.');
  if(!server.listening)await once(server,'listening');
  for(const pathname of ['/','/app.js','/core.js','/style.css','/icon.svg','/example-song.json']){
    const res=await fetch('http://127.0.0.1:4173'+pathname,{signal:AbortSignal.timeout(4000)});
    assert.equal(res.status,200);assert.ok((await res.text()).length>20);console.log(pathname,res.status,res.headers.get('content-type'));
  }
} finally {server.close();}

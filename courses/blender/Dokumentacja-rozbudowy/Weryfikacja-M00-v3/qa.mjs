import {chromium} from 'file:///C:/Users/rudek/Desktop/htdocs/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const root='C:/xampp/htdocs/blender-course-development/revision/v3';
const base='http://127.0.0.1:5175/public/courses/blender/modul-0/';
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const reports=[];
for(const [slug,title,count,downloads] of [
 ['pierwszy-model-stol-warsztatowy','Pierwszy model - stół warsztatowy',7,2],
 ['rama-i-polka-inset-i-extrude','Rama i półka - Inset i Extrude',6,3]]){
 await page.goto(base+slug+'?freemode=1',{waitUntil:'networkidle'});
 await page.waitForSelector('#course-lesson-content h1');
 const cookie=page.getByRole('button',{name:'Rozumiem',exact:true});
 if(await cookie.count())await cookie.click();
 await page.locator('#course-lesson-content img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
 await page.waitForTimeout(200);
 const r=await page.evaluate(()=>({
  title:document.querySelector('#course-lesson-content h1').textContent,
  images:[...document.querySelectorAll('#course-lesson-content img')].map(i=>({src:i.src,ok:i.complete&&i.naturalWidth>0})),
  downloads:[...document.querySelectorAll('#course-lesson-content a[href*="Resources"]')].map(a=>a.href),
 }));
 if(r.title.trim()!==title)errors.push('Wrong title '+title);
 if(r.images.length!==count||r.images.some(i=>!i.ok))errors.push('Image failed '+title);
 if(r.downloads.length!==downloads)errors.push('Download count '+title);
 for(const link of r.downloads)if(!(await page.request.get(link)).ok())errors.push('Download failed '+link);
 const img=page.locator(slug.startsWith('pierwszy')?'img[src*="m00-ui"]':'img[src*="polka-extrude"]');
 await img.scrollIntoViewIfNeeded();
 await page.screenshot({path:root+'/Documentation/'+slug+'-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 await img.scrollIntoViewIfNeeded();
 r.mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
 if(r.mobileOverflow)errors.push('Mobile overflow '+title);
 await page.screenshot({path:root+'/Documentation/'+slug+'-mobile.png'});
 await page.setViewportSize({width:1440,height:1000});
 reports.push(r);
}
await browser.close();
await fs.writeFile(root+'/Documentation/browser-qa.json',JSON.stringify({reports,errors},null,2));
console.log({pages:reports.length,errors});if(errors.length)process.exitCode=1;

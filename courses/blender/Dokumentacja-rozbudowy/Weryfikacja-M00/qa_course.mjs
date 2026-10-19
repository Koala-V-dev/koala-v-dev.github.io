import { chromium } from 'file:///C:/Users/rudek/Desktop/htdocs/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
const root='C:/xampp/htdocs/blender-course-development/revision';
const base='http://127.0.0.1:5175';
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const issues=[];
page.on('pageerror',e=>issues.push(e.message));
const moduleDir=path.join(root,'Pages','Moduł 0');
const titles=(await fs.readdir(moduleDir)).filter(f=>f.endsWith('.md')).map(f=>f.slice(0,-3));
const reports=[];
for(const title of ['Wprowadzenie',...titles]){
 const relative=title==='Wprowadzenie'?title:'Moduł 0/'+title;
 const url=base+'/public/courses/blender/'+relative.split('/').map(encodeURIComponent).join('/')+'?freemode=1';
 await page.goto(url,{waitUntil:'networkidle'});
 await page.waitForSelector('#course-lesson-content h1',{timeout:30000});
 await page.locator('#course-lesson-content img').evaluateAll(imgs=>imgs.forEach(im=>{im.loading='eager';}));
 await page.waitForTimeout(300);
 const report=await page.evaluate(()=>({
  title:document.querySelector('#course-lesson-content h1')?.textContent,
  images:[...document.querySelectorAll('#course-lesson-content img')].map(im=>({src:im.getAttribute('src'),ok:im.complete&&im.naturalWidth>0,alt:im.alt})),
  overflow:document.documentElement.scrollWidth>innerWidth+1,
  links:[...document.querySelectorAll('#course-lesson-content a[href*="/Resources/"]')].map(a=>a.href),
 }));
 report.expected=title;
 for(const link of report.links){const res=await page.request.get(link);if(!res.ok())issues.push('Download '+link+': '+res.status());}
 if(report.title?.trim()!==title)issues.push('Wrong title '+title+': '+report.title);
 for(const im of report.images)if(!im.ok||!im.alt)issues.push('Image '+title+': '+im.src);
 reports.push(report);
 if(title==='Start i mapa interfejsu')await page.screenshot({path:path.join(root,'Documentation','desktop-ui.png')});
 if(title==='Zapis projektu i obrazy bez znikania'){
  await page.locator('#course-lesson-content details summary').click();
  if(!await page.locator('#course-lesson-content details').evaluate(el=>el.open))issues.push('Details not open');
  await page.locator('img[src*="m00-pack-menu"]').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(root,'Documentation','desktop-packing.png')});
 }
 await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(100);
 const mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
 report.mobileOverflow=mobileOverflow;
 if(mobileOverflow)issues.push('Mobile overflow: '+title);
 if(title==='Wymiary i pierwsza półka warsztatowa'){
  await page.locator('img[src*="m00-units"]').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(root,'Documentation','mobile-units.png')});
 }
 await page.setViewportSize({width:1440,height:1000});
}
await fs.writeFile(path.join(root,'Documentation','browser-qa.json'),JSON.stringify({reports,issues},null,2));
await browser.close();
console.log(JSON.stringify({pages:reports.length,issues},null,2));
if(issues.length)process.exitCode=1;

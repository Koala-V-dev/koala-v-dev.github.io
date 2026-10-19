import {chromium} from 'file:///C:/Users/rudek/Desktop/htdocs/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const root='C:/xampp/htdocs/blender-course-development/revision/v2';
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const url='http://127.0.0.1:5175/public/courses/blender/modul-0/pierwszy-model-stol-warsztatowy?freemode=1';
await page.goto(url,{waitUntil:'networkidle'});
await page.waitForSelector('#course-lesson-content h1');
if(await page.getByRole('button',{name:'Rozumiem',exact:true}).count())await page.getByRole('button',{name:'Rozumiem',exact:true}).click();
await page.locator('#course-lesson-content img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
await page.waitForTimeout(250);
const report=await page.evaluate(()=>({
 title:document.querySelector('#course-lesson-content h1').textContent,
 images:[...document.querySelectorAll('#course-lesson-content img')].map(i=>({src:i.src,ok:i.complete&&i.naturalWidth>0})),
 downloads:[...document.querySelectorAll('#course-lesson-content a[href*="Resources"]')].map(a=>a.href),
 text:document.querySelector('#course-lesson-content').textContent,
}));
if(report.title.trim()!=='Pierwszy model - stół warsztatowy')errors.push('Wrong title');
if(report.images.length!==6||report.images.some(i=>!i.ok))errors.push('Missing image');
if(report.downloads.length!==2)errors.push('Wrong checkpoints');
for(const link of report.downloads){const res=await page.request.get(link);if(!res.ok())errors.push('Download failed '+link);}
if(/samodzielna próba|zielony|etykieta|pack resources/i.test(report.text))errors.push('Old unrelated content');
await page.screenshot({path:root+'/Documentation/desktop.png'});
await page.locator('img[src*="stol-pierwsza-noga"]').scrollIntoViewIfNeeded();
await page.screenshot({path:root+'/Documentation/desktop-leg.png'});
await page.setViewportSize({width:390,height:844});
await page.locator('img[src*="stol-blat-skala"]').scrollIntoViewIfNeeded();
report.mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
if(report.mobileOverflow)errors.push('Mobile overflow');
await page.screenshot({path:root+'/Documentation/mobile.png'});
delete report.text;
await fs.writeFile(root+'/Documentation/browser-qa.json',JSON.stringify({report,errors},null,2));
await browser.close();console.log({pages:1,images:report.images.length,downloads:report.downloads.length,errors});
if(errors.length)process.exitCode=1;

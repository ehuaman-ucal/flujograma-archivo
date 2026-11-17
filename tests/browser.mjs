import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const servers = [];
async function serve(dir) {
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const relative = pathname.replace(/^\/flujograma-archivo\//, '') || 'index.html';
      const file = path.resolve(dir, relative);
      if (!file.startsWith(dir + path.sep)) throw new Error('path');
      const data = await readFile(file);
      res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[path.extname(file)] || 'application/octet-stream');
      res.end(data);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  servers.push(server);
  return `http://127.0.0.1:${server.address().port}/flujograma-archivo/`;
}
const browser = await chromium.launch({headless:true, ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {})});
const errors = [], failures = [], externalFailures = new Set();
const context = await browser.newContext({reducedMotion:'reduce'});
context.on('page', page => {
  page.on('pageerror', e => errors.push(e.message));
  page.on('requestfailed', req => { if(req.url().startsWith('http://127.0.0.1')) failures.push(req.url()); else externalFailures.add(req.url()); });
  page.on('response', res => {if(res.url().startsWith('http://127.0.0.1') && res.status() >= 400) failures.push(res.url());});
});
await mkdir(path.join(root, 'test-results'), {recursive:true});
const url = await serve(root);
const originalUrl = process.env.ORIGINAL_DIR ? await serve(path.resolve(process.env.ORIGINAL_DIR)) : null;
async function load(url, width) {
  const page = await context.newPage(); await page.setViewportSize({width,height:900});
  await page.goto(url); await page.waitForSelector('#flowsList .flow-card');
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({content:'*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }'});
  return page;
}
async function compare(pages, name) {
  // Only scroll button state changes asynchronously; settle through a rendering frame.
  await Promise.all(pages.map(p => p.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))));
  if(name.endsWith('-detalle')) await Promise.all(pages.map(p=>p.waitForTimeout(250)));
  // A first readback flushes Chromium's delayed backdrop-filter raster cache.
  await Promise.all(pages.map(p => p.screenshot({fullPage:false})));
  const shots = await Promise.all(pages.map(p => p.screenshot({fullPage:false})));
  const dialogBounds = name.endsWith('-detalle') ? await Promise.all(pages.map(p=>p.locator('#stepDialog').boundingBox())) : null;
  if(dialogBounds?.length===2) assert.deepEqual(dialogBounds[0], dialogBounds[1]);
  if (shots.length === 2 && !shots[0].equals(shots[1])) {
    const [a,b] = shots.map(s=>PNG.sync.read(s));
    assert.equal(a.width,b.width); assert.equal(a.height,b.height);
    let delta = 0;
    for(let i=0;i<a.data.length;i++) {
      if(dialogBounds) {
        const {x,y,width,height} = dialogBounds[0], px=Math.floor(i/4)%a.width, py=Math.floor(i/4/a.width);
        // Compare the rounded modal foreground. The backdrop is a separately composited blur,
        // whose raster cache depends on which headless tab is active.
        const cx=Math.max(x+24,Math.min(px,x+width-24)), cy=Math.max(y+24,Math.min(py,y+height-24));
        if(px<x || px>x+width || py<y || py>y+height || (px-cx)**2+(py-cy)**2>24**2) continue;
      }
      delta=Math.max(delta,Math.abs(a.data[i]-b.data[i]));
    }
    if(delta>1) { await Promise.all(shots.map((shot,i)=>writeFile(path.join(root,'test-results',name+'-'+i+'.png'),shot))); console.log({dialogBounds}); }
    // Chromium can round backdrop-filter blur by one RGB unit across surfaces.
    assert.ok(delta<=1, `capturas diferentes: ${name}; diferencia máxima ${delta}`);
    console.log(`${name}: diferencia máxima ${delta}/255 (redondeo de rasterización)`);
  }
  await pages[0].screenshot({path:path.join(root, 'test-results', name+'.png')});
}
try {
  for (const width of (process.env.WIDTHS || '1440,768,390').split(',').map(Number)) {
    const pages = [await load(url,width)]; if(originalUrl) pages.push(await load(originalUrl,width));
    const page = pages[0];
    assert.equal(await page.locator('.flow-card').count(),7);
    if(pages.length===2) {
      for(const selector of ['#flowsList','#teamGrid','#menu-process','#menu-people','#menu-systems'])
        assert.equal(await pages[0].locator(selector).innerHTML(),await pages[1].locator(selector).innerHTML());
    }
    await compare(pages, `${width}-inicio`);
    await Promise.all(pages.map(async p => {await p.locator('#flujo-1 [data-step-id]').first().click();}));
    assert.equal(await page.locator('#stepDialog').evaluate(d=>d.open),true);
    await compare(pages,`${width}-detalle`);
    await Promise.all(pages.map(p => p.locator('#dialogClose').click()));
    // Every card including decisions and renumbered FAENF steps opens its original detail.
    for (const button of await (width === 1440 ? page.locator('[data-step-id]') : page.locator('[data-step-id]').first()).all()) {
      await button.evaluate(b=>b.click());
      assert.equal(await page.locator('#stepDialog').evaluate(d=>d.open),true);
      assert.ok((await page.locator('#dialogTitle').innerText()).length);
      await page.locator('#dialogClose').click();
    }
    for(const p of pages) {
      await p.locator('#collapseAll').click(); assert.equal(await p.locator('.flow-card[open]').count(),0);
      await p.locator('#expandAll').click(); assert.equal(await p.locator('.flow-card[open]').count(),7);
      await p.locator('#trigger-people').click(); await p.locator('[data-filter="people"][data-value="adriana"]').click(); await p.keyboard.press('Escape');
      await p.locator('#trigger-systems').click(); await p.locator('[data-filter="systems"][data-value="imaging"]').click();
    }
    await compare(pages, `${width}-filtros`);
    if(pages.length===2) assert.equal(await pages[0].locator('#resultsNote').innerText(),await pages[1].locator('#resultsNote').innerText());
    for(const p of pages) {
      await p.keyboard.press('Escape');
      await p.locator('#resetFilters').click(); assert.equal(await p.locator('.flow-card:not([hidden])').count(),7);
      await p.locator('[data-person-filter="sebastian"]').click(); assert.equal(await p.locator('.flow-card:not([hidden])').count(),2);
      await p.locator('#resetFilters').click();
      if(width >= 768) {
      const shell = p.locator('[data-track-shell]').filter({has:p.locator('[data-track-next]:not([disabled])')}).first();
      const track = shell.locator('.flow-track'); const before = await track.evaluate(t=>t.scrollLeft);
      await shell.locator('[data-track-next]').click();
      assert.ok(await track.evaluate(t=>t.scrollLeft) > before);
      } else {
        assert.equal(await p.locator('.flow-track').first().evaluate(t=>getComputedStyle(t).flexDirection),'column');
        assert.equal(await p.locator('.track-nav').first().isVisible(),false);
      }
      await p.locator('#systemsDialogTrigger').click(); assert.equal(await p.locator('#stepDialog').evaluate(d=>d.open),true);
      await p.locator('#dialogClose').click();
      await p.locator('#collapseAll').click();
      await p.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
      assert.equal(await p.locator('.flow-card[open]').count(),7);
      await p.emulateMedia({media:'print'});
    }
    await compare(pages,`${width}-impresion`);
    for(const p of pages) {
      await p.emulateMedia({media:'screen'}); await p.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
      assert.equal(await p.locator('.flow-card[open]').count(),0);
    }
    if(width===1440) {
      await page.pdf({path:path.join(root,'test-results','mapa.pdf'),format:'A4',printBackground:true});
    }
    for(const p of pages) await p.close();
    console.log(`OK ${width}px: renderizado, detalles, filtros, navegación, expandir/contraer e impresión${originalUrl?', comparación visual (tolerancia máxima 1/255)':''}`);
  }
  assert.deepEqual(errors,[]); assert.deepEqual(failures,[]);
  console.log('Sin excepciones JavaScript ni recursos locales rotos.');
  if(externalFailures.size) console.log('Recursos externos no cargados:', [...externalFailures]);
} finally {await browser.close(); await Promise.all(servers.map(s=>new Promise(r=>s.close(r))));}

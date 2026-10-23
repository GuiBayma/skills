#!/usr/bin/env node
// Renderiza cada artboard de um snapshot de design em png/<ID>.png, ou serve o
// canvas para ver os artboards vivos (animações incluídas).
//
//   node render.mjs <design-dir>          gera os PNGs
//   node render.mjs --serve <design-dir>  serve e imprime a URL de cada artboard
//
// O Playwright vem do projeto em que o comando roda, porque a skill não instala
// dependências.
import { createServer } from 'node:http';
import { mkdir, readdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { extname, join, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const serveOnly = args[0] === '--serve';
const designDir = resolve(serveOnly ? args[1] : args[0] ?? '');
const canvasDir = join(designDir, 'canvas');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
};

// Os artboards apontam assets por /_blob/<id>; o snapshot os guarda em assets/<id>.<ext>.
async function resolvePath(pathname) {
  if (pathname.startsWith('/_blob/')) {
    const id = pathname.slice('/_blob/'.length);
    const name = (await readdir(join(canvasDir, 'assets'))).find((file) => file.startsWith(`${id}.`));
    return name && join(canvasDir, 'assets', name);
  }
  const file = join(canvasDir, pathname);
  return file.startsWith(canvasDir + sep) ? file : undefined;
}

const server = createServer(async (request, response) => {
  try {
    const file = await resolvePath(decodeURIComponent(new URL(request.url, 'http://local').pathname));
    const body = await readFile(file);
    response.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end();
  }
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;

const canvas = JSON.parse(await readFile(join(canvasDir, 'canvas.json'), 'utf8'));
const boards = canvas.order.map((file) => ({ file, ...canvas.boards[file], id: canvas.boards[file].title ?? file.replace(/\.dc\.html$/, '') }));

if (serveOnly) {
  for (const board of boards) console.log(`${board.id}\t${origin}/${board.file}`);
  console.log('Ctrl+C para parar.');
} else {
  const require = createRequire(join(process.cwd(), 'package.json'));
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch {
    try {
      ({ chromium } = require('@playwright/test'));
    } catch {
      chromium = undefined;
    }
  }
  if (!chromium) {
    console.error('Playwright não encontrado no projeto: instale-o (npm i -D playwright) ou rode de um diretório que o tenha.');
    process.exit(2);
  }
  const browser = await chromium.launch();
  await mkdir(join(designDir, 'png'), { recursive: true });
  const failures = [];
  for (const board of boards) {
    const page = await browser.newPage({ viewport: { width: board.w, height: board.h } });
    page.on('pageerror', (error) => failures.push(`${board.id}: ${error.message}`));
    await page.goto(`${origin}/${board.file}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const path = join(designDir, 'png', `${board.id}.png`);
    await page.screenshot({ path, fullPage: board.expand === 'fill' });
    console.log(path);
    await page.close();
  }
  await browser.close();
  server.close();
  if (failures.length > 0) {
    console.error(failures.join('\n'));
    process.exit(1);
  }
}

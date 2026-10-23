#!/usr/bin/env node
// Renderiza cada artboard de um snapshot de design em png/<ID>.png, ou serve o
// canvas para ver os artboards vivos (animações incluídas).
//
//   node render.mjs <design-dir> [ID…]      gera os PNGs de todos os IDs, ou só dos dados
//   node render.mjs --serve <design-dir>    serve e imprime a URL de cada artboard
//   node render.mjs --missing <design-dir>  lista os assets ainda por baixar
//
// Um artboard com erro de script ou recurso que não carregou fica sem PNG (o
// anterior é apagado), e o comando sai com erro, porque um gabarito incompleto ou
// antigo passaria por aprovado.
//
// O Playwright vem do projeto em que o comando roda, porque a skill não instala
// dependências.
import { createServer } from 'node:http';
import { mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { extname, join, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const mode = ['--serve', '--missing'].includes(args[0]) ? args[0] : 'render';
const [designArg, ...onlyIds] = mode === 'render' ? args : args.slice(1);
const designDir = resolve(designArg ?? '');
const canvasDir = join(designDir, 'canvas');

// Os assets que os artboards e as folhas de estilo já baixadas referenciam e que
// ainda faltam em assets/, mais as referências que não são /_blob/<id>, que nem o
// canvas nem o snapshot conseguem resolver. Rodado até sair vazio, cobre as
// dependências transitivas (uma folha que aponta uma fonte).
if (mode === '--missing') {
  const assetsDir = join(canvasDir, 'assets');
  const present = await readdir(assetsDir).catch(() => []);
  const referenced = new Set();
  const unresolvable = [];
  for (const file of (await readdir(canvasDir)).filter((name) => name.endsWith('.dc.html'))) {
    for (const [, id] of (await readFile(join(canvasDir, file), 'utf8')).matchAll(/\/_blob\/([0-9a-f]{32})/g)) referenced.add(id);
  }
  for (const file of present.filter((name) => name.endsWith('.css'))) {
    const sheet = await readFile(join(assetsDir, file), 'utf8');
    const urls = [...sheet.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)|@import\s+['"]([^'"]+)['"]/g)].map((match) => match[1] ?? match[2]);
    for (const url of urls) {
      const blob = url.match(/^\/_blob\/([0-9a-f]{32})$/);
      if (blob) referenced.add(blob[1]);
      else if (!/^(data:|https?:|#)/.test(url)) unresolvable.push(`${file}: ${url}`);
    }
  }
  const missing = [...referenced].filter((id) => !present.some((name) => name.startsWith(`${id}.`)));
  const lines = [...missing, ...unresolvable];
  if (lines.length > 0) console.log(lines.join('\n'));
  process.exit(lines.length > 0 ? 1 : 0);
}
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
const allBoards = canvas.order.map((file) => ({ file, ...canvas.boards[file], id: canvas.boards[file].title ?? file.replace(/\.dc\.html$/, '') }));
const unknownIds = onlyIds.filter((id) => !allBoards.some((board) => board.id === id));
if (unknownIds.length > 0) {
  console.error(`IDs ausentes do canvas: ${unknownIds.join(', ')}`);
  process.exit(2);
}
const boards = onlyIds.length > 0 ? allBoards.filter((board) => onlyIds.includes(board.id)) : allBoards;

if (mode === '--serve') {
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
    // O PNG anterior sai antes de renderizar: só um render completo o recria.
    const path = join(designDir, 'png', `${board.id}.png`);
    await rm(path, { force: true });
    const page = await browser.newPage({ viewport: { width: board.w, height: board.h } });
    const problems = [];
    page.on('pageerror', (error) => problems.push(error.message));
    page.on('requestfailed', (request) => problems.push(`${request.url()}: ${request.failure()?.errorText}`));
    const imageUrls = new Set();
    page.on('response', (response) => {
      if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) {
        problems.push(`${response.url()}: HTTP ${response.status()}`);
      } else if ((response.headers()['content-type'] ?? '').startsWith('image/')) {
        imageUrls.add(response.url());
      }
    });
    try {
      await page.goto(`${origin}/${board.file}`, { waitUntil: 'networkidle' });
      // Uma fonte servida com HTTP 200 que não decodifica só aparece no status da face.
      const brokenFonts = await page.evaluate(async () => {
        await document.fonts.ready;
        return [...document.fonts].filter((face) => face.status === 'error').map((face) => `fonte ${face.family} não carregou`);
      });
      problems.push(...brokenFonts);
      // Uma imagem servida com HTTP 200 que não decodifica também passa sem erro de
      // rede: decodifica de novo cada imagem que a página recebeu, de <img> ou de CSS.
      // Sem crossOrigin, a decodificação não exige CORS, como a própria exibição.
      const brokenImages = await page.evaluate(async (urls) => {
        const broken = await Promise.all(
          urls.map(async (url) => {
            const image = new Image();
            image.src = url;
            return image.decode().then(
              () => undefined,
              () => `imagem ${url} não decodificou`,
            );
          }),
        );
        return broken.filter(Boolean);
      }, [...imageUrls]);
      problems.push(...brokenImages);
      await page.waitForTimeout(300);
      if (problems.length === 0) {
        await page.screenshot({ path, fullPage: board.expand === 'fill' });
        console.log(path);
      }
    } catch (error) {
      problems.push(error.message.split('\n')[0]);
    }
    failures.push(...problems.map((problem) => `${board.id}: ${problem}`));
    await page.close();
  }
  await browser.close();
  server.close();
  if (failures.length > 0) {
    console.error(failures.join('\n'));
    process.exit(1);
  }
}

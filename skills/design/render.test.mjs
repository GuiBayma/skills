// Testes do render.mjs. Rode de um projeto que tenha o Playwright instalado:
//   node --test <skill-dir>/render.test.mjs
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const renderer = fileURLToPath(new URL('./render.mjs', import.meta.url));

function board(head = '') {
  return `<!doctype html><html><head><meta charset="utf-8">${head}</head><body><p>board</p></body></html>`;
}

async function snapshot(boards) {
  const designDir = await mkdtemp(join(tmpdir(), 'design-render-'));
  const canvasDir = join(designDir, 'canvas');
  await mkdir(join(canvasDir, 'assets'), { recursive: true });
  await mkdir(join(designDir, 'png'));
  const index = { v: 3, boards: {}, order: [] };
  for (const [file, { id, head }] of Object.entries(boards)) {
    index.boards[file] = { x: 0, y: 0, w: 320, h: 200, title: id };
    index.order.push(file);
    await writeFile(join(canvasDir, file), board(head));
  }
  await writeFile(join(canvasDir, 'canvas.json'), JSON.stringify(index));
  return designDir;
}

function render(...args) {
  return new Promise((resolve) => {
    execFile('node', [renderer, ...args], (error, stdout, stderr) =>
      resolve({ code: error ? error.code : 0, stdout, stderr }),
    );
  });
}

test('renders only the IDs it is given, keeping the other PNGs', async () => {
  const designDir = await snapshot({
    'a.dc.html': { id: 'tela--a@mobile' },
    'b.dc.html': { id: 'tela--b@mobile' },
  });
  const kept = join(designDir, 'png', 'tela--a@mobile.png');
  await writeFile(kept, 'divergência aceita');

  const result = await render(designDir, 'tela--b@mobile');

  assert.equal(result.code, 0, result.stderr);
  assert.ok((await readFile(kept, 'utf8')) === 'divergência aceita', 'o PNG da divergência aceita foi sobrescrito');
  assert.notEqual((await readFile(join(designDir, 'png', 'tela--b@mobile.png'))).length, 0);
});

test('refuses an ID the canvas does not have', async () => {
  const designDir = await snapshot({ 'a.dc.html': { id: 'tela--a@mobile' } });

  const result = await render(designDir, 'tela--x@mobile');

  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /tela--x@mobile/);
});

test('removes the stale PNG of an artboard that fails', async () => {
  const designDir = await snapshot({
    'a.dc.html': { id: 'tela--a@mobile', head: '<link rel="stylesheet" href="/_blob/0123456789abcdef0123456789abcdef">' },
  });
  await writeFile(join(designDir, 'png', 'tela--a@mobile.png'), 'gabarito anterior');

  const result = await render(designDir, 'tela--a@mobile');

  assert.notEqual(result.code, 0);
  await assert.rejects(readFile(join(designDir, 'png', 'tela--a@mobile.png')));
});

test('removes the stale PNG of an artboard that never settles', async () => {
  const designDir = await snapshot({
    'a.dc.html': { id: 'tela--a@mobile', head: '<script>setInterval(() => fetch("/canvas.json"), 100)</script>' },
  });
  await writeFile(join(designDir, 'png', 'tela--a@mobile.png'), 'gabarito anterior');

  const result = await render(designDir);

  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /tela--a@mobile/);
  await assert.rejects(readFile(join(designDir, 'png', 'tela--a@mobile.png')));
});

test('fails without saving the PNG when a font does not decode', async () => {
  const font = 'fedcba9876543210fedcba9876543210';
  const designDir = await snapshot({
    'a.dc.html': {
      id: 'tela--a@mobile',
      head: `<style>@font-face { font-family: Quebrada; src: url("/_blob/${font}") format("woff2"); } p { font-family: Quebrada, serif; }</style>`,
    },
  });
  await writeFile(join(designDir, 'canvas', 'assets', `${font}.woff2`), 'isto não é uma fonte');

  const result = await render(designDir);

  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /Quebrada/);
  await assert.rejects(readFile(join(designDir, 'png', 'tela--a@mobile.png')));
});

for (const [usage, head] of [
  ['an img', (url) => `</head><body><img src="${url}" alt="peça"><head>`],
  ['a CSS background', (url) => `<style>p { background-image: url("${url}"); }</style>`],
]) {
  test(`fails without saving the PNG when ${usage} does not decode`, async () => {
    const image = 'abcdefabcdefabcdefabcdefabcdefab';
    const designDir = await snapshot({ 'a.dc.html': { id: 'tela--a@mobile', head: head(`/_blob/${image}`) } });
    await writeFile(join(designDir, 'canvas', 'assets', `${image}.png`), 'isto não é uma imagem');

    const result = await render(designDir);

    assert.notEqual(result.code, 0);
    assert.match(result.stderr, new RegExp(image));
    await assert.rejects(readFile(join(designDir, 'png', 'tela--a@mobile.png')));
  });
}

test('fails without saving the PNG when an image the server does not know the type of does not decode', async () => {
  const image = 'abcdefabcdefabcdefabcdefabcdefab';
  const designDir = await snapshot({ 'a.dc.html': { id: 'tela--a@mobile', head: `<img src="/_blob/${image}" alt="peça">` } });
  await writeFile(join(designDir, 'canvas', 'assets', `${image}.heic`), 'isto não é uma imagem');

  const result = await render(designDir);

  assert.notEqual(result.code, 0);
  assert.match(result.stderr, new RegExp(image));
  await assert.rejects(readFile(join(designDir, 'png', 'tela--a@mobile.png')));
});

test('saves the PNG when every image decodes', async () => {
  const image = 'abcdefabcdefabcdefabcdefabcdefab';
  const designDir = await snapshot({
    'a.dc.html': { id: 'tela--a@mobile', head: `<style>p { background-image: url("/_blob/${image}"); }</style>` },
  });
  const onePixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  await writeFile(join(designDir, 'canvas', 'assets', `${image}.png`), Buffer.from(onePixel, 'base64'));

  const result = await render(designDir);

  assert.equal(result.code, 0, result.stderr);
  assert.notEqual((await readFile(join(designDir, 'png', 'tela--a@mobile.png'))).length, 0);
});

test('saves the PNG when an image from another origin decodes', async () => {
  const onePixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const other = createServer((request, response) => {
    response.writeHead(200, { 'content-type': 'image/png' });
    response.end(Buffer.from(onePixel, 'base64'));
  });
  await new Promise((done) => other.listen(0, '127.0.0.1', done));
  const url = `http://127.0.0.1:${other.address().port}/peca.png`;
  const designDir = await snapshot({ 'a.dc.html': { id: 'tela--a@mobile', head: `<style>p { background-image: url("${url}"); }</style>` } });

  const result = await render(designDir);
  other.close();

  assert.equal(result.code, 0, result.stderr);
  assert.notEqual((await readFile(join(designDir, 'png', 'tela--a@mobile.png'))).length, 0);
});

test('lists the assets still missing, following the ones already exported', async () => {
  const font = 'fedcba9876543210fedcba9876543210';
  const sheet = '0123456789abcdef0123456789abcdef';
  const designDir = await snapshot({
    'a.dc.html': { id: 'tela--a@mobile', head: `<link rel="stylesheet" href="/_blob/${sheet}">` },
  });
  await writeFile(
    join(designDir, 'canvas', 'assets', `${sheet}.css`),
    `@font-face { font-family: F; src: url("/_blob/${font}") format("woff2"); }\n@import "outra.css";`,
  );

  const result = await render('--missing', designDir);

  assert.equal(result.code, 1);
  assert.deepEqual(result.stdout.trim().split('\n').sort(), [font, `${sheet}.css: outra.css`].sort());
});

test('fails without saving the PNG when an asset is missing', async () => {
  const designDir = await snapshot({
    'a.dc.html': { id: 'tela--a@mobile', head: '<link rel="stylesheet" href="/_blob/0123456789abcdef0123456789abcdef">' },
  });

  const result = await render(designDir);

  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /0123456789abcdef0123456789abcdef/);
  await assert.rejects(readFile(join(designDir, 'png', 'tela--a@mobile.png')));
});

test('saves the PNG when the page cancels a request of its own', async () => {
  const designDir = await snapshot({
    'a.dc.html': {
      id: 'tela--a@mobile',
      head: '<script>const control = new AbortController(); fetch("/canvas.json", { signal: control.signal }).catch(() => {}); setTimeout(() => control.abort(), 0);</script>',
    },
  });

  const result = await render(designDir);

  assert.equal(result.code, 0, result.stderr);
  assert.notEqual((await readFile(join(designDir, 'png', 'tela--a@mobile.png'))).length, 0);
});

test('lists the resources the artboards and SVG assets reference that nothing can resolve, not their links', async () => {
  const icon = 'abcdefabcdefabcdefabcdefabcdefab';
  const designDir = await snapshot({
    'a.dc.html': {
      id: 'tela--a@mobile',
      head: `<script src="./support.js"></script><link rel="stylesheet" href="css/x.css"><img src="img/hero.png" alt=""><style>@font-face { font-family: F; src: url(fonts/x.woff2); }</style><a href="#topo">topo</a><a href="/settings">Configurações</a><form action="/busca"></form>`,
    },
  });
  await writeFile(join(designDir, 'canvas', 'support.js'), '');
  await writeFile(
    join(designDir, 'canvas', 'assets', `${icon}.svg`),
    '<svg xmlns="http://www.w3.org/2000/svg"><a href="/settings"><image href="icons/x.png"/></a><use href="#icone"/></svg>',
  );

  const result = await render('--missing', designDir);

  assert.equal(result.code, 1);
  assert.deepEqual(
    result.stdout.trim().split('\n').sort(),
    ['a.dc.html: css/x.css', 'a.dc.html: img/hero.png', 'a.dc.html: fonts/x.woff2', `${icon}.svg: icons/x.png`].sort(),
  );
});

test('accepts a /_blob/ reference that carries a query or a fragment', async () => {
  const font = 'fedcba9876543210fedcba9876543210';
  const sheet = '0123456789abcdef0123456789abcdef';
  const designDir = await snapshot({
    'a.dc.html': { id: 'tela--a@mobile', head: `<link rel="stylesheet" href="/_blob/${sheet}">` },
  });
  await writeFile(
    join(designDir, 'canvas', 'assets', `${sheet}.css`),
    `@font-face { font-family: F; src: url("/_blob/${font}?#iefix") format("embedded-opentype"), url("/_blob/${font}#svgFont") format("svg"); }`,
  );
  await writeFile(join(designDir, 'canvas', 'assets', `${font}.woff2`), '');

  const result = await render('--missing', designDir);

  assert.equal(result.code, 0, result.stdout);
  assert.equal(result.stdout, '');
});

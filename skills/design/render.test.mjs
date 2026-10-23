// Testes do render.mjs. Rode de um projeto que tenha o Playwright instalado:
//   node --test <skill-dir>/render.test.mjs
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
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

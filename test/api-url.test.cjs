const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/lib/api.ts'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;

for (const scenario of [
  { name: 'relative server API', api: '/api', site: 'https://glownari.com', expected: 'https://glownari.com/api/glownari/promo' },
  { name: 'absolute local API', api: 'http://localhost:4000/api', expected: 'http://localhost:4000/api/glownari/promo' },
  { name: 'relative browser API', api: '/api', browser: true, expected: '/api/glownari/promo' },
]) {
  test(`festival settings load from ${scenario.name} without caching`, async () => {
    let request;
    const context = { exports: {}, URL, process: { env: { NEXT_PUBLIC_API_URL: scenario.api, NEXT_PUBLIC_SITE_URL: scenario.site } }, fetch: async (url, options) => {
      request = { url, options };
      return { ok: true, json: async () => ({ festivalEnabled: true }) };
    } };
    if (scenario.browser) context.window = {};
    vm.runInNewContext(code, context);
    assert.equal((await context.exports.getPromo()).festivalEnabled, true);
    assert.equal(request.url, scenario.expected);
    assert.equal(request.options.cache, 'no-store');
  });
}

test('successful empty catalogue and API failures never substitute demo stock', async () => {
  const context = { exports: {}, URL, URLSearchParams, process: { env: { NEXT_PUBLIC_API_URL: 'http://localhost:4000/api' } }, fetch: async () => ({ ok: true, json: async () => ({ items: [], total: 0, take: 24, skip: 0 }) }) };
  vm.runInNewContext(code, context);
  const empty = await context.exports.getProducts();
  assert.equal(empty.items.length, 0); assert.equal(empty.error, undefined);
  context.fetch = async () => { throw new Error('network'); };
  const failed = await context.exports.getProducts();
  assert.equal(failed.items.length, 0); assert.match(failed.error, /could not load/);
});

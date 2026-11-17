import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { PEOPLE } from '../js/data/people.js';
import { SYSTEMS } from '../js/data/systems.js';
import { PROCESS_OPTIONS, FLOWS, FAENF_SILABOS_LANE } from '../js/data/flows.js';
import { STEP_MAP } from '../js/data/catalog.js';
import { renderFlow } from '../js/components/flow-card.js';
import { renderStepCard } from '../js/components/step-card.js';
import { state, filteredFlows } from '../js/services/filters.js';
const baseline = JSON.parse(await readFile(new URL('./baseline.json', import.meta.url)));
const hash = x => createHash('sha256').update(JSON.stringify(x)).digest('hex');
test('catálogos, siete flujos y pasos idénticos a la versión original', () => {
  assert.equal(FLOWS.length, 7);
  assert.equal(hash({ PEOPLE, SYSTEMS, PROCESS_OPTIONS, FLOWS, STEP_MAP }), baseline.data);
  assert.ok(FAENF_SILABOS_LANE);
  for (const f of FLOWS) {
    f.people.forEach(id => assert.ok(PEOPLE[id], id));
    f.systems.forEach(id => assert.ok(SYSTEMS[id], id));
    for (const s of f.steps || []) {
      assert.equal(STEP_MAP[s.id].flowId, f.n);
      if (s.linkFlow) assert.ok(FLOWS.some(f => f.n === s.linkFlow));
    }
  }
});
test('HTML de todos los flujos, bifurcaciones y proyectos conservado', () => {
  assert.equal(hash(FLOWS.map(renderFlow)), baseline.flows);
});
test('HTML de todos los pasos, variantes compactas y responsables alternativos conservado', () => {
  assert.equal(hash(Object.values(STEP_MAP).flatMap(s => [renderStepCard(s), renderStepCard(s, {compact:true,owner:'yesely',n:2})])), baseline.steps);
});
test('combinaciones proceso × persona × sistema iguales a la versión original', () => {
  const results = PROCESS_OPTIONS.flatMap(p => Object.keys(PEOPLE).concat(null).flatMap(person => Object.keys(SYSTEMS).concat(null).map(system => {
    state.process = p.value;
    state.people = new Set(person ? [person] : []);
    state.systems = new Set(system ? [system] : []);
    return filteredFlows().map(f => f.n);
  })));
  assert.equal(hash(results), baseline.filters);
  state.process = 'all'; state.people.clear(); state.systems.clear();
});
test('cascada CSS original: mismas reglas, declaraciones y orden efectivo', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const files = [...html.matchAll(/href="(\.\/css\/[^"\s]+)"/g)].map(m => m[1]);
  const css = (await Promise.all(files.map(f => readFile(new URL('../' + f, import.meta.url), 'utf8')))).join('');
  const normalized = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s/g, '');
  assert.equal(createHash('sha256').update(normalized).digest('hex'), baseline.css);
});
test('HTML estático conservado excepto las referencias locales de CSS y JS', async () => {
  const html = (await readFile(new URL('../index.html', import.meta.url), 'utf8')).replace(/\r\n/g,'\n')
    .replace(/  <link rel="stylesheet" href="\.\/css\/[^"\s]+">(?:\n  <link rel="stylesheet" href="\.\/css\/[^"\s]+">)*/g, 'CSS')
    .replace('<script type="module" src="./js/app.js"></script>', 'JS');
  assert.equal(createHash('sha256').update(html).digest('hex'), baseline.html);
});
test('todas las selecciones múltiples de personas y sistemas conservan sus resultados', () => {
  const results = PROCESS_OPTIONS.flatMap(p => {
    const people = Object.keys(PEOPLE), systems = Object.keys(SYSTEMS);
    return Array.from({length: 1 << people.length}, (_, a) => Array.from({length: 1 << systems.length}, (_, b) => {
      state.process = p.value;
      state.people = new Set(people.filter((_, i) => a & (1 << i)));
      state.systems = new Set(systems.filter((_, i) => b & (1 << i)));
      return filteredFlows().map(f => f.n);
    })).flat();
  });
  assert.equal(hash(results), baseline.multiFilters);
  state.process = 'all'; state.people.clear(); state.systems.clear();
});

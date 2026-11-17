import { $ } from '../utils/dom.js';
import { FLOWS } from '../data/flows.js';
import { pad2, esc } from '../utils/helpers.js';
import { PEOPLE } from '../data/people.js';

export function renderIndex() {
  $('#flowIndexList').innerHTML = FLOWS.map(flow => `
    <a href="#flujo-${Number(flow.n)}" class="index-link" data-flow-link="${Number(flow.n)}">
      <span class="index-num">${pad2(flow.n)}</span>
      <span class="index-copy">
        <span class="index-name">${esc(flow.shortName)}</span>
        <span class="index-people">
          ${flow.people.map(id => {
            const p = PEOPLE[id];
            if (!p) return '';
            return `<span class="index-dot" style="--c:${p.color}" title="${esc(p.name)}"></span>`;
          }).join('')}
          <span>${flow.people.length} resp.</span>
        </span>
      </span>
      <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
    </a>`).join('');
}

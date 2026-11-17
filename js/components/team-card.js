import { FLOWS } from '../data/flows.js';
import { $ } from '../utils/dom.js';
import { PEOPLE } from '../data/people.js';
import { esc } from '../utils/helpers.js';
import { sysIcon } from './visuals.js';

export function flowsForPerson(id) {
  return FLOWS.filter(flow => flow.people.includes(id));
}

export function renderTeam() {
  const grid = $('#teamGrid');
  grid.innerHTML = Object.keys(PEOPLE).map(id => {
    const p = PEOPLE[id];
    const flows = flowsForPerson(id);
    const systems = Array.from(new Set(flows.flatMap(flow => flow.systems)));
    return `<button type="button" class="person-card ${p.lead ? 'person-card--lead' : ''}" data-person-filter="${esc(id)}" style="--pc:${p.color};--pc-bg:${p.bg}">
      <span class="person-cta"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span>
      <span class="person-avatar">${esc(p.initials)}</span>
      <span class="person-name">${esc(p.name)}</span>
      <span class="person-role">${esc(p.role)}</span>
      ${p.lead ? '<span class="supervisor-badge"><i class="fa-solid fa-star" aria-hidden="true"></i>Supervisión</span>' : ''}
      <span class="person-desc">${esc(p.desc)}</span>
      <span class="person-flows">${flows.map(flow => `<span class="flow-mini">${esc(flow.shortName)}</span>`).join('')}</span>
      <span class="person-foot">
        <span class="person-systems">${systems.map(sysId => sysIcon(sysId, true)).join('')}</span>
        <span>${flows.length} ${flows.length === 1 ? 'flujo' : 'flujos'} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
      </span>
    </button>`;
  }).join('');
}

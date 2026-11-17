import { $ } from '../utils/dom.js';
import { COLLABORATORS, TOTAL_FLOWS, TOTAL_SYSTEMS, DIGITADORES } from '../data/catalog.js';
import { avatar } from './visuals.js';
import { SYSTEMS } from '../data/systems.js';
import { esc, pad2 } from '../utils/helpers.js';
import { PEOPLE } from '../data/people.js';
import { FLOWS } from '../data/flows.js';

export function renderKpiAvatars() {
  $('#kpiAvatars').innerHTML = COLLABORATORS.map(id => avatar(id)).join('');
}

export function renderFooterSystems() {
  const list = $('#footerSystems');
  if (!list) return;
  list.innerHTML = Object.keys(SYSTEMS).map(id => {
    const s = SYSTEMS[id];
    return `<div class="footer-row"><i class="fa-solid ${esc(s.icon)}" aria-hidden="true"></i><span><b>${esc(s.name)}</b><br>${esc(s.desc)}</span></div>`;
  }).join('');
}

export function renderHeadCounts() {
  const supervisors = Object.keys(PEOPLE).length - COLLABORATORS.length;
  const projects = FLOWS.filter(flow => flow.kind === 'projects')
    .reduce((total, flow) => total + (flow.projects || []).length, 0);
  const setText = (selector, value) => {
    const node = $(selector);
    if (node) node.textContent = value;
  };
  setText('#metaFlowCount', TOTAL_FLOWS);
  setText('#metaTeamCount', COLLABORATORS.length);
  setText('#orbitFlowCount', pad2(TOTAL_FLOWS));
  setText('#orbitSubline', `${TOTAL_SYSTEMS} sistemas · ${projects} proyectos`);
  setText('#kpiTeamCount', COLLABORATORS.length);
  setText('#flowsEyebrowCount', TOTAL_FLOWS);
  setText('#statCollaborators', COLLABORATORS.length);
  setText('#statSupervisors', supervisors);
  setText('#statDigitadores', DIGITADORES.length);
}

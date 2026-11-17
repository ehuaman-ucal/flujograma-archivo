import { renderUnitCard, renderDigitacion } from './digitacion.js';
import { renderTrack } from './step-card.js';
import { renderBranches, renderCoverage } from './branches.js';
import { esc, pad2, statusClass } from '../utils/helpers.js';
import { renderProjects } from './project-card.js';
import { sysIcon, avatar, personMini } from './visuals.js';

export function renderBodySection(flow, section) {
  if (section.card) {
    return `<div class="flow-body-inner">
      ${renderUnitCard(section.card)}
    </div>`;
  }
  let inner;
  if (section.steps) {
    inner = renderTrack(section.steps, { owner: section.owner, renumber: section.renumber });
  } else {
    inner = renderTrack(flow.mainSteps || (flow.steps || []).map(step => step.id));
    if (flow.branches) inner += renderBranches(flow);
    if (flow.coverage) inner += renderCoverage(flow);
  }
  const total = section.steps ? section.steps.length : (flow.mainSteps || flow.steps || []).length;
  const head = section.title ? `<div class="flow-section-head">
      <span class="flow-section-title">${esc(section.title)}</span>
      ${section.period ? `<span class="flow-section-title">${esc(section.period)}</span>` : ''}
      <span class="flow-section-count">${total} pasos</span>
    </div>` : '';
  return `<div class="flow-body-inner">
    ${head}
    ${inner}
  </div>`;
}

export function renderFlowBody(flow) {
  if (flow.kind === 'digitacion') return renderDigitacion(flow);
  if (flow.kind === 'projects') return renderProjects(flow);
  if (flow.bodySections) return flow.bodySections.map(section => renderBodySection(flow, section)).join('');
  let html = renderTrack(flow.mainSteps || (flow.steps || []).map(step => step.id));
  if (flow.branches) html += renderBranches(flow);
  if (flow.coverage) html += renderCoverage(flow);
  return html;
}

export function renderFlow(flow) {
  const countLabel = flow.kind === 'digitacion'
    ? `${flow.lanes.length} líneas`
    : flow.kind === 'projects'
      ? `${flow.projects.length} proyectos`
      : `${flow.steps.length} pasos`;
  const systems = flow.systems.map(id => sysIcon(id, true)).join('');
  const footer = flow.footer
    ? `<div class="flow-footer">
        <span><i class="fa-solid fa-circle-info" aria-hidden="true"></i>${esc(flow.footer.text)}</span>
        ${flow.footer.flow ? `<button type="button" class="inline-link" data-goto-flow="${esc(flow.footer.flow)}">${esc(flow.footer.linkLabel)} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>` : ''}
      </div>`
    : '';
  return `<details class="flow-card" id="flujo-${Number(flow.n)}" data-flow="${Number(flow.n)}" style="--tone:${flow.tone};--tone-bg:${flow.toneBg}" open>
    <summary class="flow-summary">
      <span class="flow-id">${pad2(flow.n)}</span>
      <span class="flow-head-copy">
        <span class="flow-kicker">Flujo ${pad2(flow.n)} · ${esc(flow.groupLabel)}</span>
        <span class="flow-title" role="heading" aria-level="3">${esc(flow.fullName)}</span>
        <span class="flow-desc">${esc(flow.tagline)}</span>
        <span class="flow-tags">
          <span class="status-pill ${statusClass(flow.statusTone)}"><span class="dot"></span>${esc(flow.status)}</span>
          ${flow.privacy ? '<span class="status-pill status-pill--red"><i class="fa-solid fa-lock" aria-hidden="true"></i>Acceso restringido</span>' : ''}
          <span class="meta-chip"><i class="fa-regular fa-clock" aria-hidden="true"></i>${esc(flow.duration)}</span>
          <span class="meta-chip"><i class="fa-solid fa-rotate" aria-hidden="true"></i>${esc(flow.frequency)}</span>
          ${flow.frequencyAlt ? `<span class="meta-chip"><i class="fa-solid fa-rotate" aria-hidden="true"></i>${esc(flow.frequencyAlt)}</span>` : ''}
        </span>
      </span>
      <span class="flow-side">
        <span class="flow-side-row">
          <span class="avatar-stack avatar-stack--sm" aria-label="Responsables del flujo">${flow.people.map(id => avatar(id)).join('')}</span>
          <span class="flow-count">${countLabel}</span>
        </span>
        <span class="flow-side-row flow-side-systems">${systems}</span>
        <span class="flow-toggle"><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></span>
      </span>
    </summary>
    <div class="flow-body">
      ${flow.inventory ? `<div class="flow-body-inner">
        <article class="step-card inventory-card" data-matchable data-people="${esc(flow.inventory.owner)}" data-systems="sheets">
          <div class="step-top"><span class="step-icon"><i class="fa-solid fa-boxes-stacked" aria-hidden="true"></i></span></div>
          <h4 class="step-title">Inventarios</h4>
          <div class="inventory-owner"><span>Encargada:</span>${personMini(flow.inventory.owner)}</div>
          <div class="inventory-links">
            ${flow.inventory.links.map(link => `<a class="project-link" href="${esc(link.url)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-google-drive" aria-hidden="true"></i>${esc(link.label)}</a>`).join('')}
          </div>
        </article>
      </div>` : ''}
      ${flow.bodySections ? renderFlowBody(flow) : `<div class="flow-body-inner">${renderFlowBody(flow)}</div>`}
      ${footer}
    </div>
  </details>`;
}

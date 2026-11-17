import { STEP_MAP } from '../data/catalog.js';
import { renderStepCard } from './step-card.js';
import { esc } from '../utils/helpers.js';

export function renderBranchSteps(ids) {
  return `<div class="branch-steps">${ids.map((id, index) => {
    const step = STEP_MAP[id];
    if (!step) return '';
    return `<div class="step-wrap">${renderStepCard(step, { compact: true })}${index < ids.length - 1 ? '<span class="step-arrow" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>' : ''}</div>`;
  }).join('')}</div>`;
}

export function renderBranches(flow) {
  return `<div class="branch-map">
    <div class="branch-head">
      <div>
        <span class="branch-kicker">Rutas de decisión</span>
        <h4>¿Qué ocurre después de la búsqueda?</h4>
      </div>
      <span class="branch-note"><i class="fa-solid fa-clock" aria-hidden="true"></i> Secretaría General: ~4 h de respuesta</span>
    </div>
    ${flow.branches.map(branch => {
      const yes = branch.tone === 'success';
      return `<div class="branch-row">
        <div class="branch-side">
          <span class="branch-tag ${yes ? 'branch-tag--yes' : 'branch-tag--no'}">${esc(branch.label)}</span>
          <span class="branch-side-label">${esc(branch.short)}</span>
        </div>
        <div class="branch-content">
          <div class="branch-condition">${esc(branch.condition)}</div>
          ${branch.stepIds && branch.stepIds.length ? renderBranchSteps(branch.stepIds) : ''}
          ${branch.outcome ? `<div class="branch-outcome"><i class="fa-solid fa-circle-check" aria-hidden="true"></i>${esc(branch.outcome)}</div>` : ''}
          ${branch.subbranches ? `<div class="branch-sub">
            ${branch.subbranches.map(sub => {
              const subYes = sub.tone === 'success';
              if (sub.linkStep) {
                return `<div class="branch-subrow">
                  <span class="branch-sub-label"><span class="sub-tag ${subYes ? 'sub-tag--yes' : 'sub-tag--no'}">${esc(sub.label)}</span>${esc(sub.condition)}</span>
                  <button type="button" class="branch-link" data-step-id="${esc(sub.linkStep)}"><i class="fa-solid fa-arrow-turn-up" aria-hidden="true"></i>${esc(sub.linkLabel)}</button>
                </div>`;
              }
              return `<div class="branch-subrow">
                <span class="branch-sub-label"><span class="sub-tag ${subYes ? 'sub-tag--yes' : 'sub-tag--no'}">${esc(sub.label)}</span>${esc(sub.condition)}</span>
                ${sub.stepIds && sub.stepIds.length ? renderBranchSteps(sub.stepIds) : ''}
              </div>`;
            }).join('')}
          </div>` : ''}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

export function renderCoverage(flow) {
  return `<div class="coverage">
    <div class="coverage-label"><span>Cobertura documental</span><strong>${flow.coverage.length} tipos de resoluciones</strong></div>
    <div class="coverage-chips">
      ${flow.coverage.map(item => `<span class="type-chip"><i class="fa-solid ${esc(item.icon)}" aria-hidden="true"></i>${esc(item.label)}</span>`).join('')}
    </div>
    <span class="coverage-frequency"><i class="fa-solid fa-rotate" aria-hidden="true"></i>Frecuencia ${esc((flow.frequency || '').toLowerCase())}</span>
  </div>`;
}

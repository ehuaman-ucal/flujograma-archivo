import { PEOPLE } from '../data/people.js';
import { sysIcon, personMini } from './visuals.js';
import { esc, pad2 } from '../utils/helpers.js';
import { STEP_MAP } from '../data/catalog.js';

export function renderStepCard(step, options) {
  const opts = options || {};
  const ownerId = opts.owner || step.owner;
  const p = PEOPLE[ownerId];
  const support = (step.support || []).filter(id => id !== ownerId && PEOPLE[id]);
  const peopleIds = [ownerId, ...support].filter(id => PEOPLE[id]);
  const index = opts.n || step.n;
  const mods = [
    step.decision ? 'step-card--decision' : '',
    step.linkFlow && step.appearance !== 'standard' ? 'step-card--link' : '',
    opts.compact ? 'step-card--compact' : ''
  ].filter(Boolean).join(' ');
  const flag = step.decision
    ? '<span class="step-flag step-flag--gold">Decisión</span>'
    : step.linkFlow
      ? `<span class="step-flag ${step.appearance === 'standard' ? 'step-flag--gold' : 'step-flag--link'}">Enlace</span>`
      : '';
  const systemMarkup = step.systems && step.systems.length
    ? `<span class="step-systems">${step.systems.map(id => sysIcon(id, true)).join('')}</span>`
    : (step.channel ? `<span class="step-channel"><i class="fa-regular fa-circle-dot" aria-hidden="true"></i>${esc(step.channel)}</span>` : '');
  const accent = step.decision ? '#C58A00' : step.linkFlow && step.appearance !== 'standard' ? '#F8B800' : (p ? p.color : '#E71230');
  return `<button type="button" class="step-card ${mods}" data-step-id="${esc(step.id)}" data-owner="${esc(ownerId)}" data-n="${index}" data-matchable data-people="${esc(peopleIds.join(','))}" data-systems="${esc((step.systems || []).join(','))}" style="--step-accent:${accent}">
    <span class="step-top"><span class="step-index">${pad2(index)}</span><span class="step-icon"><i class="fa-solid ${esc(step.icon)}" aria-hidden="true"></i></span></span>
    ${flag}
    <span class="step-title">${esc(step.title)}</span>
    <span class="step-sub">${esc(step.summary || step.detail)}</span>
    <span class="step-foot">
      ${support.length
        ? `<span class="step-people">${p ? personMini(ownerId) : ''}${support.map(id => personMini(id)).join('')}</span>`
        : (p ? personMini(ownerId) : '')}
      ${systemMarkup}
      <span class="step-time"><i class="fa-regular fa-clock" aria-hidden="true"></i>${esc(step.time)}</span>
    </span>
  </button>`;
}

export function renderTrack(stepIds, options) {
  const opts = options || {};
  const ids = stepIds || [];
  const shortClass = ids.length <= 3 ? 'flow-track--short' : '';
  return `<div class="track-shell track-shell--scroll is-start is-end" data-track-shell>
    <button type="button" class="track-nav track-nav--prev" data-track-prev aria-label="Ver pasos anteriores" disabled><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
    <div class="flow-track ${shortClass}" role="list" aria-label="Secuencia de pasos del flujo" tabindex="0">
      ${ids.map((id, index) => {
        const step = STEP_MAP[id];
        if (!step) return '';
        return `<div class="step-wrap" role="listitem">
          ${renderStepCard(step, { compact: opts.compact, owner: opts.owner, n: opts.renumber ? index + 1 : null })}
          ${index < ids.length - 1 ? '<span class="step-arrow" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>' : ''}
        </div>`;
      }).join('')}
    </div>
    <button type="button" class="track-nav track-nav--next" data-track-next aria-label="Ver pasos siguientes" disabled><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
  </div>`;
}

import { esc } from '../utils/helpers.js';
import { SYSTEMS } from '../data/systems.js';
import { PEOPLE } from '../data/people.js';
import { avatar } from './visuals.js';
import { DIGITADORES } from '../data/catalog.js';

export function rowStateMeta(row, fallback) {
  const state = row.state || fallback;
  return state === 'soon'
    ? { label: 'Pendiente', cls: 'soon' }
    : { label: 'En proceso', cls: 'now' };
}

export function renderUnitCard(lane) {
  const headRows = (lane.headRows || []).map(row => {
    const meta = rowStateMeta(row, 'soon');
    return `
      <div class="status-row">
        <span class="label">${esc(row.label)}</span>
        ${row.range ? `<span class="range">${esc(row.range)}</span>` : ''}
        <span class="${meta.cls}">${meta.label}</span>
      </div>`;
  }).join('');
  const currentRows = (lane.current || []).map(row => {
    const meta = rowStateMeta(row, 'now');
    return `
      <div class="status-row">
        <span class="label">${esc(row.label)}</span>
        <span class="range">${esc(row.range)}</span>
        <span class="${meta.cls}">${meta.label}</span>
      </div>`;
  }).join('');
  const pendingRows = (lane.pending || []).map(row => {
    const meta = rowStateMeta(row, 'soon');
    const sys = row.system ? SYSTEMS[row.system] : null;
    return `
      <div class="status-row">
        <span class="label">${esc(row.label)}</span>
        ${sys ? `<span class="sys-inline"><i class="fa-solid ${esc(sys.icon)}" aria-hidden="true"></i>${esc(sys.name)}</span>` : ''}
        ${row.range ? `<span class="range">${esc(row.range)}</span>` : ''}
        <span class="${meta.cls}">${meta.label}</span>
      </div>`;
  }).join('');
  const statusTone = lane.statusTone === 'soon' ? ' unit-status--soon' : '';
  return `<article class="unit-card" data-matchable data-people="${esc(lane.team.join(','))}" data-systems="${esc(lane.systems.join(','))}" style="--unit:${lane.color};--unit-bg:${lane.bg}">
      <div class="unit-head">
        <div class="unit-title-wrap">
          <span class="unit-icon" aria-hidden="true"><i class="fa-solid ${esc(lane.icon)}"></i></span>
          <span>
            <span class="unit-tag">${esc(lane.subtitle)}</span>
            <span class="unit-title">${esc(lane.title)}</span>
          </span>
        </div>
        <span class="unit-status${statusTone}"><span class="dot"></span>${esc(lane.status || 'En proceso')}</span>
      </div>
      <div class="unit-team">
        ${lane.team.map(id => {
          const p = PEOPLE[id];
          if (!p) return '';
          return `<span class="team-chip">${avatar(id, 'avatar--xs')}${esc(p.name)}</span>`;
        }).join('')}
      </div>
      ${headRows ? `<div class="unit-block">
        ${headRows}
      </div>` : ''}
      ${currentRows ? `<div class="unit-block">
        <div class="unit-block-title"><i class="fa-solid fa-play" aria-hidden="true"></i>En proceso</div>
        ${currentRows}
      </div>` : ''}
      ${pendingRows ? `<div class="unit-block">
        <div class="unit-block-title"><i class="fa-solid fa-hourglass-half" aria-hidden="true"></i>Pendiente por iniciar</div>
        ${pendingRows}
      </div>` : ''}
      ${lane.note ? `<div class="unit-note"><i class="fa-solid fa-arrow-down-wide-short" aria-hidden="true"></i><span>${esc(lane.note)}</span></div>` : ''}
    </article>`;
}

export function renderDigitacion(flow) {
  const lanes = flow.lanes.map(lane => renderUnitCard(lane)).join('');
  return `<div class="digit-band">
    <div class="digit-target"><span class="mono">Meta diaria</span><strong>25–30</strong><small>hojas/día</small></div>
    <span class="digit-band-divider" aria-hidden="true"></span>
    <div class="digit-band-note"><i class="fa-solid fa-users" aria-hidden="true"></i><span><b>${DIGITADORES.length} digitadores</b> · FAMED y FAENF</span></div>
    <div class="digit-sequence">
      <span class="digit-seq-step"><b>01</b> Preparación</span>
      <span class="digit-seq-arrow"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></span>
      <span class="digit-seq-step"><b>02</b> Digitación</span>
      <span class="digit-seq-arrow"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></span>
      <span class="digit-seq-step"><b>03</b> Calidad · Flujo 5</span>
    </div>
  </div>
  <div class="digit-grid">${lanes}</div>
  <div class="digit-footer">
    <span><i class="fa-solid fa-arrow-right-long" aria-hidden="true"></i> FAMED avanza de años recientes a antiguos; FAENF continúa con escaneo e indexación.</span>
    <button type="button" class="inline-link" data-goto-flow="5">Ver Flujo 5 · Control de calidad <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
  </div>`;
}

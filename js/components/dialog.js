import { STEP_MAP } from '../data/catalog.js';
import { FLOWS } from '../data/flows.js';
import { PEOPLE } from '../data/people.js';
import { systemChips, avatar, sysIcon } from './visuals.js';
import { esc, pad2 } from '../utils/helpers.js';
import { $ } from '../utils/dom.js';

export let lastDialogTrigger = null;

export function openStep(id, ownerOverride, nOverride) {
  const step = STEP_MAP[id];
  if (!step) return;
  const flow = FLOWS.find(item => item.n === step.flowId);
  if (!flow) return;
  const ownerId = ownerOverride && PEOPLE[ownerOverride] ? ownerOverride : step.owner;
  const stepNumber = Number(nOverride) > 0 ? Number(nOverride) : step.n;
  const p = PEOPLE[ownerId];
  const ownerName = p ? p.name : 'Sin responsable';
  const ownerRole = p ? p.role : 'No asignado';
  const support = (step.support || []).filter(id => id !== ownerId && PEOPLE[id]);
  const supportNames = support.map(id => PEOPLE[id].name).join(' · ');
  const tone = step.decision ? '#C58A00' : step.linkFlow && step.appearance !== 'standard' ? '#F8B800' : (p ? p.color : '#E71230');
  const typeLabel = step.decision ? 'Punto de decisión' : step.linkFlow ? 'Enlace operativo' : 'Paso operativo';
  const systems = step.systems && step.systems.length
    ? `<span class="dialog-fact-value">${systemChips(step.systems)}</span>`
    : step.channel
      ? `<span class="dialog-fact-value"><i class="fa-regular fa-circle-dot" style="color:#9A6500;font-size:8px" aria-hidden="true"></i>${esc(step.channel)}</span>`
      : `<span class="dialog-fact-value"><span class="dialog-none">Sin sistema asociado</span></span>`;
  const systemsLabel = step.systems && step.systems.length ? 'Sistemas' : step.channel ? 'Canal' : 'Sistemas';
  const io = (step.inputs && step.inputs.length) || (step.outputs && step.outputs.length)
    ? `<div class="dialog-io">
        <div>
          <div class="dialog-io-title"><i class="fa-solid fa-arrow-right-to-bracket" aria-hidden="true"></i>Entradas</div>
          <ul>${(step.inputs || ['No especificadas']).map(item => `<li>${esc(item)}</li>`).join('')}</ul>
        </div>
        <div>
          <div class="dialog-io-title"><i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>Salidas</div>
          <ul>${(step.outputs || ['No especificadas']).map(item => `<li>${esc(item)}</li>`).join('')}</ul>
        </div>
      </div>`
    : '';
  const decisionCallout = step.decision
    ? `<div class="dialog-callout dialog-callout--gold"><i class="fa-solid fa-code-branch" aria-hidden="true"></i><div><strong>Punto de decisión</strong><span>La ruta siguiente depende del resultado de este control. Revisa las ramas del flujo para continuar.</span></div></div>`
    : '';
  const linkCallout = step.linkFlow
    ? `<div class="dialog-callout dialog-callout--link"><i class="fa-solid fa-link" aria-hidden="true"></i><div><strong>Enlace con el Flujo ${pad2(step.linkFlow)}</strong><span>Este paso conecta la gestión digital con la operación física del archivo.</span></div></div>`
    : '';
  const noticeCallout = step.notice
    ? `<div class="dialog-callout dialog-callout--${esc(step.notice.tone || 'gold')}"><i class="fa-solid ${esc(step.notice.icon || 'fa-circle-info')}" aria-hidden="true"></i><div><strong>${esc(step.notice.title)}</strong><span>${esc(step.notice.text)}</span></div></div>`
    : '';
  const cta = step.linkFlow
    ? `<button type="button" class="dialog-cta" data-goto-flow="${esc(step.linkFlow)}"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i>Ir al Flujo ${pad2(step.linkFlow)}</button>`
    : `<button type="button" class="dialog-cta" data-close-dialog>Cerrar detalle</button>`;

  lastDialogTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  $('#dialogContent').innerHTML = `
    <div class="dialog-top" style="--tone:${tone}">
      <span class="dialog-kicker">Flujo ${pad2(flow.n)} · Paso ${pad2(stepNumber)} · ${typeLabel}</span>
      <h3 class="dialog-title" id="dialogTitle">${esc(step.title)}</h3>
      <p class="dialog-flow">${esc(flow.fullName)} · ${esc(flow.groupLabel)}</p>
    </div>
    <div class="dialog-body">
      <p class="dialog-desc">${esc(step.detail)}</p>
      <div class="dialog-grid">
        <div class="dialog-fact">
          <span class="dialog-fact-label">Responsable</span>
          <span class="dialog-fact-value">${avatar(ownerId, 'avatar--md')}<span>${esc(ownerName)}<small>${esc(ownerRole)}</small></span>${support.length ? `<span class="dialog-support"><i class="fa-solid fa-user-plus" aria-hidden="true"></i>Con apoyo de ${esc(supportNames)}</span>` : ''}</span>
        </div>
        <div class="dialog-fact">
          <span class="dialog-fact-label">${systemsLabel}</span>
          ${systems}
        </div>
        <div class="dialog-fact">
          <span class="dialog-fact-label">Tiempo estimado</span>
          <span class="dialog-fact-value"><i class="fa-regular fa-clock" style="color:#9A6500;font-size:8px" aria-hidden="true"></i>${esc(step.time)}</span>
        </div>
        <div class="dialog-fact">
          <span class="dialog-fact-label">Tipo de paso</span>
          <span class="dialog-fact-value">${typeLabel}</span>
        </div>
      </div>
      ${io}
      ${decisionCallout}
      ${linkCallout}
      ${noticeCallout}
      <div class="dialog-actions">
        <span class="dialog-hint">Flujo ${pad2(flow.n)} · ${esc(flow.fullName)}</span>
        ${cta}
      </div>
    </div>`;

  const dialog = $('#stepDialog');
  if (!dialog.open) dialog.showModal();
  requestAnimationFrame(() => {
    const card = $('.dialog-card', dialog);
    if (card) card.scrollTop = 0;
  });
  document.body.classList.add('is-locked');
}

export function closeDialog() {
  const dialog = $('#stepDialog');
  document.body.classList.remove('is-locked');
  if (dialog.open) dialog.close();
}

export function setupDialog() {
  const dialog = $('#stepDialog');
  const closeButton = $('#dialogClose');
  $('#systemsDialogTrigger').addEventListener('click', event => {
    event.preventDefault();
    lastDialogTrigger = event.currentTarget;
    const content = $('#systemsDialogContent').content.cloneNode(true);
    content.querySelectorAll('[data-access-avatar]').forEach(slot => {
      slot.outerHTML = avatar(slot.dataset.accessAvatar, 'avatar--md');
    });
    content.querySelectorAll('[data-dialog-system]').forEach(slot => {
      slot.outerHTML = sysIcon(slot.dataset.dialogSystem, false);
    });
    $('#dialogContent').replaceChildren(content);
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => {
      const card = $('.dialog-card', dialog);
      if (card) card.scrollTop = 0;
    });
    document.body.classList.add('is-locked');
  });
  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('cancel', () => {
    document.body.classList.remove('is-locked');
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('is-locked');
    if (lastDialogTrigger && document.contains(lastDialogTrigger)) {
      lastDialogTrigger.focus({ preventScroll: true });
    }
    lastDialogTrigger = null;
  });
}

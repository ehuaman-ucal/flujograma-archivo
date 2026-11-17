import { FLOWS, PROCESS_OPTIONS } from '../data/flows.js';
import { esc } from '../utils/helpers.js';
import { $, $$ } from '../utils/dom.js';
import { TOTAL_FLOWS } from '../data/catalog.js';
import { PEOPLE } from '../data/people.js';
import { avatar } from '../components/visuals.js';
import { SYSTEMS } from '../data/systems.js';

export const state = {
  process: 'all',
  people: new Set(),
  systems: new Set()
};

export function hasActiveFilters() {
  return state.process !== 'all' || state.people.size > 0 || state.systems.size > 0;
}

export function hasEntityFilters() {
  return state.people.size > 0 || state.systems.size > 0;
}

export function filteredFlows() {
  return FLOWS.filter(flow => {
    if (state.process !== 'all' && !flow.groups.includes(state.process)) return false;
    if (state.people.size && !flow.people.some(id => state.people.has(id))) return false;
    if (state.systems.size && !flow.systems.some(id => state.systems.has(id))) return false;
    return true;
  });
}

export function renderAllOption(group, title, hint) {
  const selected = group === 'process'
    ? state.process === 'all'
    : group === 'people'
      ? state.people.size === 0
      : state.systems.size === 0;
  return `<button type="button" class="filter-option" role="option" data-filter="${esc(group)}" data-value="all" aria-selected="${selected}">
    <span class="option-check"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
    <span class="option-label"><strong>${esc(title)}</strong><small>${esc(hint)}</small></span>
  </button>`;
}

export function renderProcessMenu() {
  const menu = $('#menu-process');
  menu.innerHTML = `${PROCESS_OPTIONS.map(option => {
    const hint = option.value === 'all' ? `Mapa completo · ${TOTAL_FLOWS} flujos` : option.hint;
    return `
    <button type="button" class="filter-option" role="option" data-filter="process" data-value="${esc(option.value)}" aria-selected="${option.value === state.process}">
      <span class="option-check"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
      <span class="option-label"><strong>${esc(option.label)}</strong><small>${esc(hint)}</small></span>
      ${option.color ? `<span class="option-dot" style="background:${option.color}"></span>` : ''}
    </button>`;
  }).join('')}
    <div class="filter-menu-foot"><span class="filter-menu-note">Selección única</span><button type="button" class="menu-clear" data-clear-group="process">Mostrar todos</button></div>`;
}

export function renderPeopleMenu() {
  const menu = $('#menu-people');
  menu.innerHTML = `
    ${renderAllOption('people', 'Todo el equipo', `${Object.keys(PEOPLE).length} personas · incluye supervisión`)}
    ${Object.keys(PEOPLE).map(id => {
      const p = PEOPLE[id];
      return `<button type="button" class="filter-option" role="option" data-filter="people" data-value="${esc(id)}" aria-selected="${state.people.has(id)}">
        <span class="option-check"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
        ${avatar(id, 'avatar--md')}
        <span class="option-label"><strong>${esc(p.name)}</strong><small>${esc(p.role)}</small></span>
      </button>`;
    }).join('')}
    <div class="filter-menu-foot"><span class="filter-menu-note">Selección múltiple</span><button type="button" class="menu-clear" data-clear-group="people">Limpiar</button></div>`;
}

export function renderSystemsMenu() {
  const menu = $('#menu-systems');
  menu.innerHTML = `
    ${renderAllOption('systems', 'Todos los sistemas', Object.keys(SYSTEMS).map(id => SYSTEMS[id].name).join(' · '))}
    ${Object.keys(SYSTEMS).map(id => {
      const s = SYSTEMS[id];
      return `<button type="button" class="filter-option" role="option" data-filter="systems" data-value="${esc(id)}" aria-selected="${state.systems.has(id)}">
        <span class="option-check"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
        <span class="sys-icon" style="--sc:${s.color};--sb:${s.bg}"><i class="fa-solid ${esc(s.icon)}" aria-hidden="true"></i></span>
        <span class="option-label"><strong>${esc(s.name)}</strong><small>${esc(s.desc)}</small></span>
      </button>`;
    }).join('')}
    <div class="filter-menu-foot"><span class="filter-menu-note">Selección múltiple</span><button type="button" class="menu-clear" data-clear-group="systems">Limpiar</button></div>`;
}

export function selectedProcess() {
  return PROCESS_OPTIONS.find(option => option.value === state.process) || PROCESS_OPTIONS[0];
}

export function syncFilterUI() {
  const process = selectedProcess();
  $('#value-process').textContent = process.label;

  const peopleCount = state.people.size;
  const peopleNames = Array.from(state.people).map(id => (PEOPLE[id] ? PEOPLE[id].name : '')).filter(Boolean);
  $('#value-people').textContent = peopleCount === 0
    ? 'Todo el equipo'
    : peopleCount === 1 ? (peopleNames[0] || '1 responsable') : `${peopleCount} responsables`;
  $('#count-people').textContent = peopleCount;
  $('#count-people').hidden = peopleCount === 0;

  const systemCount = state.systems.size;
  const systemNames = Array.from(state.systems).map(id => (SYSTEMS[id] ? SYSTEMS[id].name : '')).filter(Boolean);
  $('#value-systems').textContent = systemCount === 0
    ? 'Todos los sistemas'
    : systemCount === 1 ? (systemNames[0] || '1 sistema') : `${systemCount} sistemas`;
  $('#count-systems').textContent = systemCount;
  $('#count-systems').hidden = systemCount === 0;

  $('#trigger-process').classList.toggle('is-active', state.process !== 'all');
  $('#trigger-people').classList.toggle('is-active', peopleCount > 0);
  $('#trigger-systems').classList.toggle('is-active', systemCount > 0);

  $$('.filter-option').forEach(option => {
    const group = option.dataset.filter;
    const value = option.dataset.value;
    const selected = group === 'process'
      ? state.process === value
      : group === 'people'
        ? (value === 'all' ? state.people.size === 0 : state.people.has(value))
        : (value === 'all' ? state.systems.size === 0 : state.systems.has(value));
    option.setAttribute('aria-selected', String(selected));
  });
}

export function renderChips() {
  const holder = $('#activeChips');
  if (!hasActiveFilters()) {
    holder.innerHTML = '<span class="filter-idle"><i class="fa-solid fa-circle-check" aria-hidden="true"></i>Sin filtros activos · mapa completo</span>';
    return;
  }
  const chips = [];
  if (state.process !== 'all') {
    const process = selectedProcess();
    chips.push(`<button type="button" class="filter-chip" data-chip-type="process" data-chip-value="${esc(state.process)}" aria-label="Quitar filtro de proceso ${esc(process.label)}"><span class="chip-dot" style="background:${process.color || '#171914'}"></span>${esc(process.label)}<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`);
  }
  state.people.forEach(id => {
    const p = PEOPLE[id];
    if (!p) return;
    chips.push(`<button type="button" class="filter-chip" data-chip-type="people" data-chip-value="${esc(id)}" aria-label="Quitar filtro de ${esc(p.name)}"><span class="chip-dot" style="background:${p.color}"></span>${esc(p.name)}<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`);
  });
  state.systems.forEach(id => {
    const s = SYSTEMS[id];
    if (!s) return;
    chips.push(`<button type="button" class="filter-chip" data-chip-type="systems" data-chip-value="${esc(id)}" aria-label="Quitar filtro de sistema ${esc(s.name)}"><i class="fa-solid ${esc(s.icon)}" style="color:${s.color}" aria-hidden="true"></i>${esc(s.name)}<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`);
  });
  holder.innerHTML = chips.join('');
}

export function dimMatchables() {
  const active = hasEntityFilters();
  $$('[data-matchable]').forEach(el => {
    if (!active) {
      el.classList.remove('is-muted');
      return;
    }
    const people = (el.dataset.people || '').split(',').filter(Boolean);
    const systems = (el.dataset.systems || '').split(',').filter(Boolean);
    const peopleMatch = state.people.size === 0 || people.some(id => state.people.has(id));
    const systemMatch = state.systems.size === 0 || systems.some(id => state.systems.has(id));
    el.classList.toggle('is-muted', !(peopleMatch && systemMatch));
  });
}

export function printFilterSummary(visibleCount) {
  if (!hasActiveFilters()) {
    return `Mapa completo · ${TOTAL_FLOWS} flujos · sin filtros aplicados`;
  }
  const parts = [];
  if (state.process !== 'all') parts.push(`Proceso: ${selectedProcess().label}`);
  if (state.people.size) {
    const names = Array.from(state.people).map(id => (PEOPLE[id] ? PEOPLE[id].name : '')).filter(Boolean);
    if (names.length) parts.push(`Personas: ${names.join(', ')}`);
  }
  if (state.systems.size) {
    const names = Array.from(state.systems).map(id => (SYSTEMS[id] ? SYSTEMS[id].name : '')).filter(Boolean);
    if (names.length) parts.push(`Sistemas: ${names.join(', ')}`);
  }
  return `Filtros aplicados: ${parts.join(' · ')} · ${visibleCount} de ${TOTAL_FLOWS} flujos visibles`;
}

export function applyFilters() {
  const visible = filteredFlows();
  const visibleIds = new Set(visible.map(flow => flow.n));
  const active = hasActiveFilters();

  $$('#flowsList .flow-card').forEach(card => {
    const show = visibleIds.has(Number(card.dataset.flow));
    card.hidden = !show;
    if (show && active) card.open = true;
  });

  $$('#flowIndexList .index-link').forEach(link => {
    link.hidden = !visibleIds.has(Number(link.dataset.flowLink));
  });

  $('#emptyState').hidden = visible.length !== 0;

  $('#indexCount').textContent = `${visible.length}/${TOTAL_FLOWS}`;
  $('#resultsNote').innerHTML = `<strong>${visible.length}</strong> de ${TOTAL_FLOWS} procesos visibles`;
  $('#printFilterNote').textContent = printFilterSummary(visible.length);
  $('#filterResult').classList.toggle('is-filtered', hasEntityFilters());

  dimMatchables();
  renderChips();
  syncFilterUI();
}

export function clearFilters() {
  state.process = 'all';
  state.people.clear();
  state.systems.clear();
  applyFilters();
  closeAllDropdowns();
}

export function closeDropdown(dd, restoreFocus) {
  if (!dd) return;
  const trigger = $('.filter-trigger', dd);
  const menu = $('.filter-menu', dd);
  if (!trigger || !menu) return;
  dd.classList.remove('is-open');
  trigger.setAttribute('aria-expanded', 'false');
  menu.hidden = true;
  if (restoreFocus) trigger.focus();
}

export function closeAllDropdowns() {
  $$('.filter-dropdown.is-open').forEach(dd => closeDropdown(dd, false));
}

export function openDropdown(dd) {
  closeAllDropdowns();
  const trigger = $('.filter-trigger', dd);
  const menu = $('.filter-menu', dd);
  dd.classList.add('is-open');
  trigger.setAttribute('aria-expanded', 'true');
  menu.hidden = false;
}

export function toggleSet(set, value) {
  if (set.has(value)) set.delete(value);
  else set.add(value);
}

export function setupFilterEvents() {
  $$('.filter-trigger').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.stopPropagation();
      const dd = trigger.closest('.filter-dropdown');
      if (dd.classList.contains('is-open')) {
        closeDropdown(dd, false);
        return;
      }
      openDropdown(dd);
      if (event.detail === 0) {
        const selected = $('.filter-option[aria-selected="true"]', dd);
        if (selected) setTimeout(() => selected.focus(), 0);
      }
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = $('.filter-dropdown.is-open');
    if (open) {
      event.preventDefault();
      closeDropdown(open, true);
    }
  });

  $$('.filter-menu').forEach(menu => {
    menu.addEventListener('keydown', event => {
      const options = $$('.filter-option', menu);
      if (!options.length) return;
      const current = options.indexOf(document.activeElement);
      let next = -1;
      if (event.key === 'ArrowDown') next = current < 0 ? 0 : (current + 1) % options.length;
      else if (event.key === 'ArrowUp') next = current <= 0 ? options.length - 1 : current - 1;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = options.length - 1;
      if (next >= 0 && next < options.length) {
        event.preventDefault();
        options[next].focus();
      }
    });
  });

  // Un único listener delegado para filtros, menús y chips.
  document.addEventListener('click', event => {
    if (!event.target.closest('.filter-dropdown')) closeAllDropdowns();

    const option = event.target.closest('.filter-option');
    if (option) {
      const group = option.dataset.filter;
      const value = option.dataset.value;
      if (group === 'process') {
        state.process = value;
        applyFilters();
        closeAllDropdowns();
        $('#trigger-process').focus();
        return;
      }
      if (group === 'people') {
        if (value === 'all') state.people.clear();
        else toggleSet(state.people, value);
      }
      if (group === 'systems') {
        if (value === 'all') state.systems.clear();
        else toggleSet(state.systems, value);
      }
      applyFilters();
      return;
    }

    const clearGroup = event.target.closest('[data-clear-group]');
    if (clearGroup) {
      const group = clearGroup.dataset.clearGroup;
      if (group === 'process') state.process = 'all';
      if (group === 'people') state.people.clear();
      if (group === 'systems') state.systems.clear();
      applyFilters();
      const dd = clearGroup.closest('.filter-dropdown');
      if (dd) closeDropdown(dd, true);
      return;
    }

    const chip = event.target.closest('[data-chip-type]');
    if (chip) {
      const type = chip.dataset.chipType;
      const value = chip.dataset.chipValue;
      if (type === 'process') state.process = 'all';
      if (type === 'people') state.people.delete(value);
      if (type === 'systems') state.systems.delete(value);
      applyFilters();
    }
  });

  $('#resetFilters').addEventListener('click', () => {
    clearFilters();
    $('#resultsNote').focus({ preventScroll: true });
  });
  $('#emptyReset').addEventListener('click', () => {
    clearFilters();
    $('#resultsNote').focus({ preventScroll: true });
  });
}

export function filterByPerson(id) {
  state.process = 'all';
  state.people = new Set([id]);
  state.systems.clear();
  applyFilters();
  closeAllDropdowns();
}

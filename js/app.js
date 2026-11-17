import { renderProcessMenu, renderPeopleMenu, renderSystemsMenu, setupFilterEvents, applyFilters } from './services/filters.js';
import { renderKpiAvatars, renderHeadCounts, renderFooterSystems } from './components/page-chrome.js';
import { renderIndex } from './components/flow-index.js';
import { $ } from './utils/dom.js';
import { FLOWS } from './data/flows.js';
import { renderFlow } from './components/flow-card.js';
import { renderTeam } from './components/team-card.js';
import { setupFlowEvents, setupTrackNav, setupChrome, setActiveFlow, setupObserver } from './services/navigation.js';
import { setupDialog } from './components/dialog.js';
import { setupPrint } from './services/print.js';

function init() {
  renderProcessMenu();
  renderPeopleMenu();
  renderSystemsMenu();
  renderKpiAvatars();
  renderIndex();
  renderHeadCounts();
  renderFooterSystems();
  $('#flowsList').innerHTML = FLOWS.map(renderFlow).join('');
  renderTeam();

  setupFilterEvents();
  setupFlowEvents();
  setupDialog();
  setupTrackNav();
  setupChrome();
  setupPrint();

  applyFilters();
  setActiveFlow(1);
  setupObserver();
}

init();

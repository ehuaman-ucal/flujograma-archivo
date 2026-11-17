import { $$ } from '../utils/dom.js';

export function setupPrint() {
  const printButtons = ['printBtn', 'printBtn2', 'printBtn3'];
  printButtons.forEach(id => {
    const button = document.getElementById(id);
    if (button) button.addEventListener('click', () => window.print());
  });

  let openState = [];
  window.addEventListener('beforeprint', () => {
    openState = $$('#flowsList .flow-card').map(card => card.open);
    $$('#flowsList .flow-card').forEach(card => { card.open = true; });
  });
  window.addEventListener('afterprint', () => {
    $$('#flowsList .flow-card').forEach((card, index) => {
      card.open = Boolean(openState[index]);
    });
  });

}

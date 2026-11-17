export const pad2 = n => String(n).padStart(2, '0');

export function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function statusClass(tone) {
  if (tone === 'gold') return 'status-pill--gold';
  if (tone === 'red') return 'status-pill--red';
  return 'status-pill--live';
}

export const $ = (selector, root) => (root || document).querySelector(selector);

export const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));

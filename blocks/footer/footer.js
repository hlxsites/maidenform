import { decorateMain } from '../../scripts/scripts.js';
import { loadBlocks, readBlockConfig } from '../../scripts/lib-franklin.js';

async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();
      decorateMain(main);
      await loadBlocks(main);
      return main;
    }
  }
  return null;
}

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  const fragment = await loadFragment(cfg.footer || '/footer');

  if (fragment) {
    const fragmentSections = fragment.querySelectorAll(':scope .section');
    if (fragmentSections) {
      block.closest('.footer-wrapper').replaceChildren(...fragmentSections);
    }
  }

  // TODO: Add back to top button
}

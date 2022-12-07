import { decorateMain } from '../../scripts/scripts.js';
import { loadBlocks } from '../../scripts/lib-franklin.js';

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
  const fragment = await loadFragment('/footer');
  const footer = block.closest('.footer-wrapper');

  if (fragment) {
    const fragmentSections = fragment.querySelectorAll(':scope .section');
    if (fragmentSections) {
      footer.replaceChildren(...fragmentSections);
    }
  }

  // Add back to top button
  const backToTop = document.createRange().createContextualFragment(`
  <div class="back-to-top">
    <button aria-label="Back To Top"></button>
  </div>
  `);

  // Scroll back to top
  backToTop.querySelector('button').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  footer.prepend(backToTop);
}

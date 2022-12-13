import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Handling of teaser style
  if (block.classList.contains('teaser')) {
    if (cols.length > 1) {
      // Take second column div and move into first column
      cols[0].appendChild(cols[1]);
    }
  }

  // Handling of hover-cards style
  if (block.classList.contains('hover-cards')) {
    cols.forEach((col) => {
      // Move picture and content into separate divs
      const imgContainer = document.createElement('div');
      const contentContainer = document.createElement('div');
      imgContainer.appendChild(col.querySelector('picture'));
      imgContainer.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '500' }])));
      const h3 = col.querySelector('h3');
      contentContainer.append(...col.children);
      contentContainer.querySelectorAll('p').forEach((p) => {
        if (p.innerHTML.trim() === '') {
          p.remove();
        }
      });
      col.append(imgContainer, contentContainer, h3);
    });
  }
}

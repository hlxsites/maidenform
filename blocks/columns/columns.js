function transformButtonstoLinks(block) {
  const buttoncontainers = block.querySelectorAll(':scope .button-container');
  // Removing 'button-container and 'button' class from 'p' and 'a' elements in this block
  if (buttoncontainers) {
    buttoncontainers.forEach((el) => {
      el.removeAttribute('class');
      const links = el.querySelectorAll(':scope a.button');
      if (links) {
        links.forEach((link) => {
          link.removeAttribute('class');
        });
      }
    });
  }
}

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
  // Handle button to link transformation
  if (block.matches('.icons-and-links')) {
    transformButtonstoLinks(block);
  }
}

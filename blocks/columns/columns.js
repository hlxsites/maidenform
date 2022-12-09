function transformButtonstoLinks(block) {
  const buttoncontainers = block.querySelectorAll(':scope .button-container');
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
  if (block.matches('.icons-and-links')) {
    transformButtonstoLinks(block);
  }
}

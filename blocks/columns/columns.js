export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Handling of variant 4
  if (block.classList.contains('variant4')) {
    if (cols.length > 1) {
      // Take second column div and move into first column
      cols[0].appendChild(cols[1]);
    }
  }
}

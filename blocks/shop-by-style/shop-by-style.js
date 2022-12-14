export default async function decorate(block) {
  // Move all images in the list into the link tag
  const list = block.querySelector('ul');
  list.querySelectorAll('li').forEach((li) => {
    const image = li.querySelector('picture');
    li.querySelector('br').remove();
    const a = li.querySelector('a');
    if (image && a) {
      a.prepend(image, document.createElement('br'));
    }
  });
}

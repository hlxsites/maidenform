import { Carousel, Modal } from '../footer-banner/footer-banner.js';

export default async function decorate(block) {
  const carousel = new Carousel(Array.from(block.children));

  // Add buttons to entries with modal
  Array.from(block.children).forEach((promotion) => {
    if (
      promotion.children.length < 2
      || !promotion.children[1].hasChildNodes()
    ) {
      return;
    }

    // Add details button
    const button = document.createElement('button');
    button.innerHTML = 'Details';
    promotion.children[0].appendChild(button);

    // Add class for modal
    promotion.children[1].classList.add('modal');
    const modal = new Modal(promotion.children[1], carousel);
    button.addEventListener('click', () => modal.show());
  });

  carousel.start();
}

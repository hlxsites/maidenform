class Carousel {
  constructor(items) {
    this.items = items;
    this.currentItemIndex = 1;
    this.totalItems = items.length;
  }

  // eslint-disable-next-line class-methods-use-this
  playAnimation(previousItem, currentItem) {
    previousItem.classList.add('animated');
    currentItem.classList.add('animated');
    previousItem.style.transform = 'translateX(-100%)';
    currentItem.style.transform = 'translateX(0%)';
  }

  showNext() {
    this.items.forEach((elem) => elem.classList.remove('animated'));

    const previousItem = this.items[
      (this.currentItemIndex + this.totalItems - 1) % this.totalItems];
    const currentItem = this.items[this.currentItemIndex];

    previousItem.style.transform = 'translateX(0%)';
    currentItem.style.transform = 'translateX(100%)';

    // Add delay to allow for CSS style to be applied
    setTimeout(() => this.playAnimation(previousItem, currentItem), 200);

    this.currentItemIndex = (this.currentItemIndex + this.totalItems + 1) % this.totalItems;
  }

  start() {
    this.interval = setInterval(() => this.showNext(), 3000);
  }

  stop() {
    clearInterval(this.interval);
  }
}

export default async function decorate(block) {
  // Add buttons to entries with modal
  Array.from(block.children).forEach((promotion) => {
    if (promotion.children.length < 2) {
      return;
    }

    // Add details button
    const button = document.createElement('button');
    button.innerHTML = 'Details';
    promotion.children[0].appendChild(button);

    // Add class for modal
    promotion.children[1].classList.add('modal');
  });

  // Start carousel
  const carousel = new Carousel(Array.from(block.children));
  carousel.start();

  // TODO: Modal logic
}

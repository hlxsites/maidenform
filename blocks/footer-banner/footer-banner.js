/* eslint-disable max-classes-per-file */
export class Carousel {
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

export class Modal {
  constructor(content, carousel) {
    this.content = content;
    this.id = `modal-${Math.random().toString(36).substr(2, 9)}`;
    this.carousel = carousel;
    this.onClose = null;

    // ESC event handler
    this.handleEscKey = (event) => {
      if (event.key === 'Escape') {
        this.hide();
      }
    };

    // Focus trap
    this.focusTrap = (event) => {
      if (event.key !== 'Tab' && event.keyCode !== 9) {
        return;
      }
      if (event.shiftKey) {
        if (document.activeElement === this.firstFocusableEl) {
          event.preventDefault();
          this.lastFocusableEl.focus();
        }
      } else if (document.activeElement === this.lastFocusableEl) {
        event.preventDefault();
        this.firstFocusableEl.focus();
      }
    };
  }

  static setHidden(bool) {
    document.body.querySelector('header').ariaHidden = bool;
    document.body.querySelector('main').ariaHidden = bool;
    document.body.querySelector('footer').ariaHidden = bool;
  }

  setOnClose(onClose) {
    this.onClose = onClose;
  }

  getId() {
    return this.id;
  }

  show() {
    this.modal = document.createRange().createContextualFragment(`
      <div class="modal-background">
        <div class="modal-content" role="dialog" aria-modal="true">
          <button aria-label="Close (ESC)" tabindex="0">X</button>
        </div>
      </div>
    `);
    this.modal.querySelector('.modal-content').appendChild(this.content);

    // Event listeners for closing modal
    this.modal.querySelector('.modal-background').addEventListener('click', () => this.hide());
    this.modal.querySelector('.modal-content button').addEventListener('click', () => this.hide());
    document.addEventListener('keyup', this.handleEscKey);
    this.modal.querySelector('.modal-content').addEventListener('click', (e) => e.stopPropagation());

    this.modal = document.body.appendChild(this.modal.children[0]);
    Modal.setHidden(true);

    // Focus trap
    const focusableEls = this.modal.querySelector('.modal-content').querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
    [this.firstFocusableEl] = focusableEls;
    this.lastFocusableEl = focusableEls[focusableEls.length - 1];
    this.modal.addEventListener('keydown', this.focusTrap);

    // Focus first element
    this.firstFocusableEl.focus();
    this.carousel.stop();
  }

  hide() {
    document.removeEventListener('keyup', this.handleEscKey);
    Modal.setHidden(false);
    this.modal.remove();
    this.carousel.start();

    if (this.onClose) {
      this.onClose();
    }
  }
}

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
    button.ariaExpanded = false;
    promotion.children[0].appendChild(button);

    // Add class for modal
    promotion.children[1].classList.add('modal');
    const modal = new Modal(promotion.children[1], carousel);
    button.setAttribute('aria-controls', modal.getId());
    button.addEventListener('click', (event) => {
      event.target.ariaExpanded = true;
      modal.show();
    });
    modal.setOnClose(() => {
      button.ariaExpanded = false;
    });
  });

  carousel.start();
}

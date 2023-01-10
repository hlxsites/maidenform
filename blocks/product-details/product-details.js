import { decorateIcons } from '../../scripts/lib-franklin.js';

class Carousel {
  constructor($root) {
    this.$root = $root;
    this.numChildren = [...$root.querySelectorAll('ul.carousel-stage > li')].length;
    this.thumbnailScroll = 0;
  }

  updateSlide(nextIndex) {
    const $slidesContainer = this.$root.querySelector('ul.carousel-stage');

    const currentIndex = this.getCurrentSlideIndex();

    $slidesContainer.children[currentIndex].removeAttribute('active');
    $slidesContainer.children[nextIndex].setAttribute('active', true);
    $slidesContainer.style.transform = `translateX(-${nextIndex * 100}%)`;
    this.updateThumbnailScroll(nextIndex);
  }

  updateThumbnailScroll(nextIndex) {
    const $thumbnailsContainer = this.$root.querySelector('ul.carousel-thumbnails');
    this.thumbnailScroll = Math.min(Math.max(nextIndex, 0), this.numChildren - 1);

    $thumbnailsContainer.style.transform = `translateY(-${(this.thumbnailScroll === 0 ? 0 : 1) * -252.7 + (this.thumbnailScroll) * 322.6}px)`;
  }

  getCurrentSlideIndex() {
    return [...this.$root.querySelectorAll('ul.carousel-stage > li')]
      .findIndex(($child) => $child.getAttribute('active') === 'true');
  }

  static negativeModulo(i, mod) {
    return ((i % mod) + mod) % mod;
  }

  init() {
    const nextButton = this.$root.querySelector('button[name="stage-next"]');
    const prevButton = this.$root.querySelector('button[name="stage-prev"]');
    const thumbnailDownButton = this.$root.querySelector('button[name="thumbnail-next"]');
    const thumbnailUpButton = this.$root.querySelector('button[name="thumbnail-prev"]');
    const thumbnails = this.$root.querySelectorAll('.carousel-thumbnails > li');

    nextButton.addEventListener('click', () => {
      const currentIndex = this.getCurrentSlideIndex();
      this.updateSlide((currentIndex + 1) % this.numChildren);
    });

    prevButton.addEventListener('click', () => {
      const currentIndex = this.getCurrentSlideIndex();
      this.updateSlide(Carousel.negativeModulo(currentIndex - 1, this.numChildren));
    });

    thumbnailUpButton.addEventListener('click', () => {
      this.updateThumbnailScroll(this.thumbnailScroll - 1);
    });

    thumbnailDownButton.addEventListener('click', () => {
      this.updateThumbnailScroll(this.thumbnailScroll + 1);
    });

    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
        this.updateSlide(index);
      });
    });
  }
}

function updateSelectedItemInList(list, newIndex) {
  const listItems = [...list.querySelectorAll(':scope > li')];
  const currentlySelectedItem = list.querySelector(':scope > li[aria-selected="true"]');

  const newlySelectedItem = listItems[newIndex];

  currentlySelectedItem?.removeAttribute('aria-selected');
  newlySelectedItem.setAttribute('aria-selected', 'true');

  return newlySelectedItem;
}

function updateSelectedSwatch(block, index) {
  const swatches = block.querySelector('.sidebar-section .swatches');
  const newlySelectedSwatch = updateSelectedItemInList(swatches, index);
  newlySelectedSwatch.setAttribute('aria-selected', 'true');

  block.querySelectorAll('.selected-swatch-name').innerText = newlySelectedSwatch.getAttribute('data-swatch-name');
}

function updateSelection(block) {
  const variantSelection = block.querySelector('.variant-selection > span:nth-child(2)');

  const color = block.querySelector('.swatch[aria-selected="true"]').getAttribute('data-swatch-name');
  const sizes = [...block.querySelectorAll('.sizes-selector > ul > li[aria-selected="true"]')]
    .reduce((total, item) => `${total}${item.innerHTML}`, '');

  variantSelection.innerText = `${color} ${sizes}`;
}

export default function decorate($block) {
  $block.innerHTML = `
    <div class="product-detail-carousel">
        <div class="carousel-thumbnails-wrapper">
            <div class="thumbnail-controls">
                <button name="thumbnail-prev"><span class="icon icon-caret-up-fill"></span></button>
                <button name="thumbnail-next"><span class="icon icon-caret-down-fill"></span></button>
            </div>
            <ul class="carousel-thumbnails">
                <li>
                    <picture>
                        <img height="888" src="https://cdn.maidenform.com/catalog/product/M/F/MFB_09436/MFB_09436_Black_Front.jpg?width=247&quality=100&bg-color=255,255,255" />
                    </picture>    
                </li>
                <li>
                    <picture>
                        <img height="888" src="https://cdn.maidenform.com/catalog/product/M/F/MFB_09436/MFB_09436_Black_Side.jpg?width=247&quality=100&bg-color=255,255,255" />
                    </picture>    
                </li>
                <li>
                    <picture>
                        <img height="888" src="https://cdn.maidenform.com/catalog/product/M/F/MFB_09436/MFB_09436_Black_Back.jpg?width=247&quality=100&bg-color=255,255,255" />
                    </picture>    
                </li>
                <li>
                    <picture>
                        <img height="888" src="https://cdn.maidenform.com/catalog/product/M/F/MFB_09436/MFB_09436_Black_Detail01.jpg?width=247&quality=100&bg-color=255,255,255" />
                    </picture>    
                </li>
            </ul>
        </div>
        <div class="carousel-stage-wrapper">
            <div class="main-controls">
                <button name="stage-prev"><span class="icon icon-caret-left-fill"></span></button>
                <button name="stage-next"><span class="icon icon-caret-right-fill"></span></button>
            </div>
            <ul class="carousel-stage">
                <li active="true">
                    <picture>
                        <img src="https://cdn.maidenform.com/catalog/product/M/F/MFB_09436/MFB_09436_Black_Front.jpg?width=700&quality=100&bg-color=255,255,255&dpr=1 1x" />
                    </picture>    
                </li>
                <li>
                    <picture>
                        <img src="https://cdn.maidenform.com/catalog/product/M/F/MFB_09436/MFB_09436_Black_Side.jpg?width=700&quality=100&bg-color=255,255,255&dpr=1 1x" />
                    </picture>    
                </li>
                <li>
                    <picture>
                        <img src="https://cdn.maidenform.com/catalog/product/M/F/MFB_09436/MFB_09436_Black_Back.jpg?width=700&quality=100&bg-color=255,255,255&dpr=1 1x" />
                    </picture>    
                </li>
                <li>
                    <picture>
                        <img src="https://cdn.maidenform.com/catalog/product/M/F/MFB_09436/MFB_09436_Black_Detail01.jpg?width=700&quality=100&bg-color=255,255,255&dpr=1 1x" />
                    </picture>    
                </li>
            </ul>
        </div>
    </div>
    <div class="product-title desktop-hidden">
        <h1>Everyday Full Coverage Cushioned Underwire Bra</h1>
        <div class="price">
            <span class="price-reduced">$48.00</span>
            <span class="price-actual">$28.80</span>
        </div>
        <div class="style-id">Style #09436</div>
    </div>
    <div class="sidebar">
        <div class="product-title sidebar-section mobile-hidden">
            <div class="product-rating">
                <span class="icon icon-star-fill"></span>
                <span class="icon icon-star-fill"></span>
                <span class="icon icon-star-fill"></span>
                <span class="icon icon-star-fill"></span>
                <span class="icon icon-star-half"></span>
            </div>
            <h1>Everyday Full Coverage Cushioned Underwire Bra</h1>
            <div class="price">
                <span class="price-reduced">$48.00</span>
                <span class="price-actual">$28.80</span>
            </div>
            <div class="style-id">Style #09436</div>
        </div>
        <div class="sidebar-section color-selector">
            <h4>AVAILABLE COLOR</h4>
            <ul class="swatches">
                <li aria-selected="true" data-swatch-name="Black" class="swatch" style="background: url(https://swatches.maidenform.com/HNS_09436/HNS_09436_Black_sw.jpg?quality=85&height=50&width=50&fit=bounds) no-repeat center;"></li>
                <li data-swatch-name="White" class="swatch" style="background: url(https://swatches.maidenform.com/HNS_09436/HNS_09436_White_sw.jpg?quality=85&height=50&width=50&fit=bounds) no-repeat center;"></li>
                <li data-swatch-name="Black and Navy Blossoms Print" class="swatch" style="background: url(https://swatches.maidenform.com/HNS_09436/HNS_09436_BlackandNavyBlossomsPrint_sw.jpg?quality=85&height=50&width=50&fit=bounds) no-repeat center;"></li>
                <li data-swatch-name="Sandshell" class="swatch" style="background: url(https://swatches.maidenform.com/HNS_09436/HNS_09436_Sandshell_sw.jpg?quality=85&height=50&width=50&fit=bounds) no-repeat center;"></li>
                <li data-swatch-name="Body Beige" class="swatch" style="background: url(https://swatches.maidenform.com/HNS_09436/HNS_09436_BodyBeige_sw.jpg?quality=85&height=50&width=50&fit=bounds) no-repeat center;"></li>
                <li data-swatch-name="Ivory" class="swatch" style="background: url(https://swatches.maidenform.com/HNS_09436/HNS_09436_Ivory_sw.jpg?quality=85&height=50&width=50&fit=bounds) no-repeat center;"></li>
                <li data-swatch-name="Bleached Indigo" class="swatch" style="background: url(https://swatches.maidenform.com/HNS_09436/HNS_09436_BleachedIndigo_sw.jpg?quality=85&height=50&width=50&fit=bounds) no-repeat center;"></li>
                <li data-swatch-name="Chestnut" class="swatch" style="background: url(https://swatches.maidenform.com/HNS_09436/HNS_09436_Chestnut_sw.jpg?quality=85&height=50&width=50&fit=bounds) no-repeat center;"></li>
                <li data-swatch-name="Lilac Meringue" class="swatch" style="background: url(https://swatches.maidenform.com/HNS_09436/HNS_09436_LilacMeringue_sw.jpg?quality=85&height=50&width=50&fit=bounds) no-repeat center;"></li>
            </ul>
            <div class="selected-swatch-name">Black</div>
        </div>
        <div class="sidebar-section sizes-selector">
            <h4>AVAILABLE BAND SIZE</h4>
            <span class="size-guide">Size Guide</span>
            <ul>
                <li>34</li>
                <li>36</li>
                <li aria-disabled="true">38</li>
                <li>40</li>
                <li>42</li>
            </ul>
        </div>
        <div class="sidebar-section sizes-selector">
            <h4>AVAILABLE CUP SIZE</h4>
            <ul>
                <li>B</li>
                <li>C</li>
                <li>D</li>
                <li aria-disabled="true">DD</li>
            </ul>
        </div>
        <div class="sidebar-section">
            <h4 class="variant-selection"><span>SELECTION: </span><span>Black</span></h4>
        </div>
        <div class="sidebar-section quantity-select">
            <h4 class="selection">QUANTITY:</h4>
            <select>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </select>
        </div>
        <div class="sidebar-section cart">
            <button class="button primary cart-button">Add to Bag</button>
            <p>Pay in 4 interest free payments on purchases of $30-$1,500 with 
                <img style="height: 2rem; margin-bottom: -0.5rem;" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAxcHgiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAxMDEgMzIiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHhtbG5zPSJodHRwOiYjeDJGOyYjeDJGO3d3dy53My5vcmcmI3gyRjsyMDAwJiN4MkY7c3ZnIj48cGF0aCBmaWxsPSIjMDAzMDg3IiBkPSJNIDEyLjIzNyAyLjggTCA0LjQzNyAyLjggQyAzLjkzNyAyLjggMy40MzcgMy4yIDMuMzM3IDMuNyBMIDAuMjM3IDIzLjcgQyAwLjEzNyAyNC4xIDAuNDM3IDI0LjQgMC44MzcgMjQuNCBMIDQuNTM3IDI0LjQgQyA1LjAzNyAyNC40IDUuNTM3IDI0IDUuNjM3IDIzLjUgTCA2LjQzNyAxOC4xIEMgNi41MzcgMTcuNiA2LjkzNyAxNy4yIDcuNTM3IDE3LjIgTCAxMC4wMzcgMTcuMiBDIDE1LjEzNyAxNy4yIDE4LjEzNyAxNC43IDE4LjkzNyA5LjggQyAxOS4yMzcgNy43IDE4LjkzNyA2IDE3LjkzNyA0LjggQyAxNi44MzcgMy41IDE0LjgzNyAyLjggMTIuMjM3IDIuOCBaIE0gMTMuMTM3IDEwLjEgQyAxMi43MzcgMTIuOSAxMC41MzcgMTIuOSA4LjUzNyAxMi45IEwgNy4zMzcgMTIuOSBMIDguMTM3IDcuNyBDIDguMTM3IDcuNCA4LjQzNyA3LjIgOC43MzcgNy4yIEwgOS4yMzcgNy4yIEMgMTAuNjM3IDcuMiAxMS45MzcgNy4yIDEyLjYzNyA4IEMgMTMuMTM3IDguNCAxMy4zMzcgOS4xIDEzLjEzNyAxMC4xIFoiPjwvcGF0aD48cGF0aCBmaWxsPSIjMDAzMDg3IiBkPSJNIDM1LjQzNyAxMCBMIDMxLjczNyAxMCBDIDMxLjQzNyAxMCAzMS4xMzcgMTAuMiAzMS4xMzcgMTAuNSBMIDMwLjkzNyAxMS41IEwgMzAuNjM3IDExLjEgQyAyOS44MzcgOS45IDI4LjAzNyA5LjUgMjYuMjM3IDkuNSBDIDIyLjEzNyA5LjUgMTguNjM3IDEyLjYgMTcuOTM3IDE3IEMgMTcuNTM3IDE5LjIgMTguMDM3IDIxLjMgMTkuMzM3IDIyLjcgQyAyMC40MzcgMjQgMjIuMTM3IDI0LjYgMjQuMDM3IDI0LjYgQyAyNy4zMzcgMjQuNiAyOS4yMzcgMjIuNSAyOS4yMzcgMjIuNSBMIDI5LjAzNyAyMy41IEMgMjguOTM3IDIzLjkgMjkuMjM3IDI0LjMgMjkuNjM3IDI0LjMgTCAzMy4wMzcgMjQuMyBDIDMzLjUzNyAyNC4zIDM0LjAzNyAyMy45IDM0LjEzNyAyMy40IEwgMzYuMTM3IDEwLjYgQyAzNi4yMzcgMTAuNCAzNS44MzcgMTAgMzUuNDM3IDEwIFogTSAzMC4zMzcgMTcuMiBDIDI5LjkzNyAxOS4zIDI4LjMzNyAyMC44IDI2LjEzNyAyMC44IEMgMjUuMDM3IDIwLjggMjQuMjM3IDIwLjUgMjMuNjM3IDE5LjggQyAyMy4wMzcgMTkuMSAyMi44MzcgMTguMiAyMy4wMzcgMTcuMiBDIDIzLjMzNyAxNS4xIDI1LjEzNyAxMy42IDI3LjIzNyAxMy42IEMgMjguMzM3IDEzLjYgMjkuMTM3IDE0IDI5LjczNyAxNC42IEMgMzAuMjM3IDE1LjMgMzAuNDM3IDE2LjIgMzAuMzM3IDE3LjIgWiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMwMDMwODciIGQ9Ik0gNTUuMzM3IDEwIEwgNTEuNjM3IDEwIEMgNTEuMjM3IDEwIDUwLjkzNyAxMC4yIDUwLjczNyAxMC41IEwgNDUuNTM3IDE4LjEgTCA0My4zMzcgMTAuOCBDIDQzLjIzNyAxMC4zIDQyLjczNyAxMCA0Mi4zMzcgMTAgTCAzOC42MzcgMTAgQyAzOC4yMzcgMTAgMzcuODM3IDEwLjQgMzguMDM3IDEwLjkgTCA0Mi4xMzcgMjMgTCAzOC4yMzcgMjguNCBDIDM3LjkzNyAyOC44IDM4LjIzNyAyOS40IDM4LjczNyAyOS40IEwgNDIuNDM3IDI5LjQgQyA0Mi44MzcgMjkuNCA0My4xMzcgMjkuMiA0My4zMzcgMjguOSBMIDU1LjgzNyAxMC45IEMgNTYuMTM3IDEwLjYgNTUuODM3IDEwIDU1LjMzNyAxMCBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwOWNkZSIgZD0iTSA2Ny43MzcgMi44IEwgNTkuOTM3IDIuOCBDIDU5LjQzNyAyLjggNTguOTM3IDMuMiA1OC44MzcgMy43IEwgNTUuNzM3IDIzLjYgQyA1NS42MzcgMjQgNTUuOTM3IDI0LjMgNTYuMzM3IDI0LjMgTCA2MC4zMzcgMjQuMyBDIDYwLjczNyAyNC4zIDYxLjAzNyAyNCA2MS4wMzcgMjMuNyBMIDYxLjkzNyAxOCBDIDYyLjAzNyAxNy41IDYyLjQzNyAxNy4xIDYzLjAzNyAxNy4xIEwgNjUuNTM3IDE3LjEgQyA3MC42MzcgMTcuMSA3My42MzcgMTQuNiA3NC40MzcgOS43IEMgNzQuNzM3IDcuNiA3NC40MzcgNS45IDczLjQzNyA0LjcgQyA3Mi4yMzcgMy41IDcwLjMzNyAyLjggNjcuNzM3IDIuOCBaIE0gNjguNjM3IDEwLjEgQyA2OC4yMzcgMTIuOSA2Ni4wMzcgMTIuOSA2NC4wMzcgMTIuOSBMIDYyLjgzNyAxMi45IEwgNjMuNjM3IDcuNyBDIDYzLjYzNyA3LjQgNjMuOTM3IDcuMiA2NC4yMzcgNy4yIEwgNjQuNzM3IDcuMiBDIDY2LjEzNyA3LjIgNjcuNDM3IDcuMiA2OC4xMzcgOCBDIDY4LjYzNyA4LjQgNjguNzM3IDkuMSA2OC42MzcgMTAuMSBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwOWNkZSIgZD0iTSA5MC45MzcgMTAgTCA4Ny4yMzcgMTAgQyA4Ni45MzcgMTAgODYuNjM3IDEwLjIgODYuNjM3IDEwLjUgTCA4Ni40MzcgMTEuNSBMIDg2LjEzNyAxMS4xIEMgODUuMzM3IDkuOSA4My41MzcgOS41IDgxLjczNyA5LjUgQyA3Ny42MzcgOS41IDc0LjEzNyAxMi42IDczLjQzNyAxNyBDIDczLjAzNyAxOS4yIDczLjUzNyAyMS4zIDc0LjgzNyAyMi43IEMgNzUuOTM3IDI0IDc3LjYzNyAyNC42IDc5LjUzNyAyNC42IEMgODIuODM3IDI0LjYgODQuNzM3IDIyLjUgODQuNzM3IDIyLjUgTCA4NC41MzcgMjMuNSBDIDg0LjQzNyAyMy45IDg0LjczNyAyNC4zIDg1LjEzNyAyNC4zIEwgODguNTM3IDI0LjMgQyA4OS4wMzcgMjQuMyA4OS41MzcgMjMuOSA4OS42MzcgMjMuNCBMIDkxLjYzNyAxMC42IEMgOTEuNjM3IDEwLjQgOTEuMzM3IDEwIDkwLjkzNyAxMCBaIE0gODUuNzM3IDE3LjIgQyA4NS4zMzcgMTkuMyA4My43MzcgMjAuOCA4MS41MzcgMjAuOCBDIDgwLjQzNyAyMC44IDc5LjYzNyAyMC41IDc5LjAzNyAxOS44IEMgNzguNDM3IDE5LjEgNzguMjM3IDE4LjIgNzguNDM3IDE3LjIgQyA3OC43MzcgMTUuMSA4MC41MzcgMTMuNiA4Mi42MzcgMTMuNiBDIDgzLjczNyAxMy42IDg0LjUzNyAxNCA4NS4xMzcgMTQuNiBDIDg1LjczNyAxNS4zIDg1LjkzNyAxNi4yIDg1LjczNyAxNy4yIFoiPjwvcGF0aD48cGF0aCBmaWxsPSIjMDA5Y2RlIiBkPSJNIDk1LjMzNyAzLjMgTCA5Mi4xMzcgMjMuNiBDIDkyLjAzNyAyNCA5Mi4zMzcgMjQuMyA5Mi43MzcgMjQuMyBMIDk1LjkzNyAyNC4zIEMgOTYuNDM3IDI0LjMgOTYuOTM3IDIzLjkgOTcuMDM3IDIzLjQgTCAxMDAuMjM3IDMuNSBDIDEwMC4zMzcgMy4xIDEwMC4wMzcgMi44IDk5LjYzNyAyLjggTCA5Ni4wMzcgMi44IEMgOTUuNjM3IDIuOCA5NS40MzcgMyA5NS4zMzcgMy4zIFoiPjwvcGF0aD48L3N2Zz4" role="presentation" alt="PayPal Credit" aria-hidden="true">
            </p>
            <p class="secondary-action"><span class="icon icon-heart"></span>ADD TO FAVORITES</p>
            <p class="secondary-action"><span class="icon icon-envelope"></span>EMAIL</p>
            <p><a href="/customer-service">Need Help?</a></p>
        </div>
    </div>
    <div class="product-detail-description">
        <h3>PRODUCT DETAILS</h3>
        <p>
            Cushioned wire for all-day comfort.
            <ul><li>Full-coverage cups</li><li>Super-soft fabric</li><li>Lightly lined, cloud-foam cups</li><li>Side and back smoothing</li><li>Comfort Devotion® collection</li></ul>
        </p>
    </div>
  `;

  const carousel = new Carousel($block.querySelector('.product-details .product-detail-carousel'));
  carousel.init();

  $block.querySelectorAll('.swatch').forEach((swatch, index) => {
    swatch.addEventListener('click', () => {
      updateSelectedSwatch($block, index);
      updateSelection($block);
    });
  });

  $block.querySelectorAll('.sizes-selector > ul').forEach((sizeList) => {
    sizeList.querySelectorAll(':scope > li').forEach((sizeItem, index) => {
      sizeItem.addEventListener('click', () => {
        if (!sizeItem.getAttribute('aria-disabled')) {
          updateSelectedItemInList(sizeList, index);
          updateSelection($block);
        }
      });
    });
  });

  decorateIcons($block);
}

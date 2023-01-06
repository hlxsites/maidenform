export default function decorate(block) {
  block.textContent = '';

  // Add some dummy HTML
  const product = document.createRange().createContextualFragment(`
  <li>
    <div class="picture">
      <a href="https://www.maidenform.com/a22601.html">
        <picture>
          <source media="(min-width: 320px) and (max-width: 767px)" srcset="https://cdn.maidenform.com/catalog/product/H/N/HNS_M21405/HNS_M21405_BabyBlueStripe_Front.jpg?width=420&amp;quality=100&amp;bg-color=255,255,255">
          <source media="(min-width: 768px) and (max-width: 1024x)" srcset="https://cdn.maidenform.com/catalog/product/H/N/HNS_M21405/HNS_M21405_BabyBlueStripe_Front.jpg?width=768&amp;quality=100&amp;bg-color=255,255,255">
          <img class="product-image-photo" srcset="https://cdn.maidenform.com/catalog/product/H/N/HNS_M21405/HNS_M21405_BabyBlueStripe_Front.jpg?width=247&amp;quality=100&amp;bg-color=255,255,255&amp;dpr=1 1x,https://cdn.maidenform.com/catalog/product/H/N/HNS_M21405/HNS_M21405_BabyBlueStripe_Front.jpg?width=247&amp;quality=100&amp;bg-color=255,255,255&amp;dpr=1.5 1.5x,https://cdn.maidenform.com/catalog/product/H/N/HNS_M21405/HNS_M21405_BabyBlueStripe_Front.jpg?width=247&amp;quality=100&amp;bg-color=255,255,255&amp;dpr=2 2x" src="https://cdn.maidenform.com/catalog/product/H/N/HNS_M21405/HNS_M21405_BabyBlueStripe_Front.jpg?width=247&amp;quality=100&amp;bg-color=255,255,255" max-width="247" max-height="313" alt="Cozy Boxer Short">
        </picture>
      </a>
      <button class="add-to-cart-action">Add to Bag</button>
    </div>
    <div class="variants">
      <button class="previous">Previous</button>
      <div class="swatches">
        <button class="swatch active" style="background: url('https://swatches.maidenform.com/HNS_A22601/HNS_A22601_ClassicRedPlaid_sw.jpg?quality=85&height=50&width=50&fit=bounds') no-repeat center;">Classic Red Plaid</button>
        <button class="swatch" style="background: url('https://swatches.maidenform.com/HNS_A22601/HNS_A22601_MerlotFairisle_sw.jpg?quality=85&height=50&width=50&fit=bounds') no-repeat center;">Merlot Fairisle</button>
        <button class="swatch" style="background: url('https://swatches.maidenform.com/HNS_A22601/HNS_A22601_RedAndGreenTreeFairisle_sw.jpg?quality=85&height=50&width=50&fit=bounds') no-repeat center;">Red And Green Tree Fairisle</button>
        <button class="swatch" style="background: url('https://swatches.maidenform.com/HNS_A22601/HNS_A22601_SpruceGreenDot_sw.jpg?quality=85&height=50&width=50&fit=bounds') no-repeat center;">Spruce Green Dot</button>
        <button class="swatch" style="background: url('https://swatches.maidenform.com/HNS_A22601/HNS_A22601_MerlotFairisle_sw.jpg?quality=85&height=50&width=50&fit=bounds') no-repeat center;">Merlot Fairisle</button>
        <button class="swatch" style="background: url('https://swatches.maidenform.com/HNS_A22601/HNS_A22601_RedAndGreenTreeFairisle_sw.jpg?quality=85&height=50&width=50&fit=bounds') no-repeat center;">Red And Green Tree Fairisle</button>
        <button class="swatch" style="background: url('https://swatches.maidenform.com/HNS_A22601/HNS_A22601_SpruceGreenDot_sw.jpg?quality=85&height=50&width=50&fit=bounds') no-repeat center;">Spruce Green Dot</button>
        <button class="swatch" style="background: url('https://swatches.maidenform.com/HNS_A22601/HNS_A22601_MerlotFairisle_sw.jpg?quality=85&height=50&width=50&fit=bounds') no-repeat center;">Merlot Fairisle</button>
        <button class="swatch" style="background: url('https://swatches.maidenform.com/HNS_A22601/HNS_A22601_RedAndGreenTreeFairisle_sw.jpg?quality=85&height=50&width=50&fit=bounds') no-repeat center;">Red And Green Tree Fairisle</button>
        <button class="swatch" style="background: url('https://swatches.maidenform.com/HNS_A22601/HNS_A22601_SpruceGreenDot_sw.jpg?quality=85&height=50&width=50&fit=bounds') no-repeat center;">Spruce Green Dot</button>
        </div>
      <button class="next">Next</button>
    </div>
    <div class="name">
      <a href="https://www.maidenform.com/a22601.html">Comfy Cabin Thermal Holiday Pajama Set</a>
    </div>
    <div class="price">
      <span class="old-price">$48.00</span> <span>$20.00</span>
    </div>
    <div class="rating">
      <div style="--rating: 4.5;"></div>
      <span>(50)</span>
    </div>
  </li>`);

  const content = document.createRange().createContextualFragment(`
    <div class="facets">
      <h2>Filters</h2>
      <button class="close">Close</button>
      <div class="facet-list">
        <div class="facet radio">
          <input type="checkbox" id="facet-toggle-sleep" />
          <label for="facet-toggle-sleep">Sleep/Loungewear type</label>
          <div class="facet-content">
            <ol>
              <li><input type="radio" name="facet-sleep" id="facet-tops"> <label for="facet-tops">Tops <span class="count">12</span></label></li>
              <li><input type="radio" name="facet-sleep" id="facet-pajamas"> <label for="facet-pajamas">Pajamas <span class="count">12</span></label></li>
              <li><input type="radio" name="facet-sleep" id="facet-pants"> <label for="facet-pants">Pants <span class="count">12</span></label></li>
              <li><input type="radio" name="facet-sleep" id="facet-shorts"> <label for="facet-shorts">Shorts <span class="count">12</span></label></li>
            </ol>
          </div>
        </div>
        <div class="facet swatch size">
          <input type="checkbox" id="facet-size" />
          <label for="facet-size">Size</label>
          <div class="facet-content">
            <ol>
              <li><button>S</button></li>
              <li><button>M</button></li>
              <li><button>L</button></li>
              <li><button>XL</button></li>
              <li><button>1X</button></li>
            </ol>
          </div>
        </div>
        <div class="facet checkbox">
          <input type="checkbox" id="facet-trigger-price" />
          <label for="facet-trigger-price">Price</label>
          <div class="facet-content">
          <ol>
            <li><input type="checkbox" name="facet-price" id="facet-10"> <label for="facet-10">up to $10 <span class="count">12</span></label></li>
            <li><input type="checkbox" name="facet-price" id="facet-20"> <label for="facet-20">$10 to $20 <span class="count">12</span></label></li>
            <li><input type="checkbox" name="facet-price" id="facet-30"> <label for="facet-30">$20 to $30 <span class="count">12</span></label></li>
            <li><input type="checkbox" name="facet-price" id="facet-40"> <label for="facet-40">more than $30 <span class="count">12</span></label></li>
          </ol>
          </div>
        </div>
        <div class="facet swatch color">
          <input type="checkbox" id="facet-color" /> 
          <label for="facet-color">Color Family</label>
          <div class="facet-content">
            <ol>
              <li><button style="background: black">black</button></li>
              <li><button style="background: white">white</button></li>
              <li><button style="background: red">red</button></li>
              <li><button style="background: blue">blue</button></li>
              <li><button style="background: green">green</button></li>
              <li><button style="background: yellow">yellow</button></li>
              <li><button style="background: orange">orange</button></li>
              <li><button style="background: purple">purple</button></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <div class="products">
      <div class="title">
        <h1>Bralettes</h1>
        <span>(11 Products)</span>
        <div class="sort">
          <button>Sort By: Relevance</button>
          <div class="overlay">
            <button class="close">Close</button>
            <ul>
              <li><a href="#">Price: High to Low</a></li>
              <li><a href="#">Price: Low to High</a></li>
              <li><a href="#" class="active">Product Name</a></li>
              <li><a href="#">Relevance</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mobile-menu">
        <button id="toggle-filters">Filters</button>
        <button id="toggle-sortby">Sort By</button>
      </div>
      <div class="list">
        <ol></ol>
      </div>
      <div class="pagination">
        <div>
          <label for="select-pagesize">Show:</label>
          <select id="select-pagesize" name="pageSize">
            <option>20 Items</option>
            <option>30 Items</option>
            <option>40 Items</option>
            <option>50 Items</option>
          </select>
        </div>
        <div>
          <label for="select-page">Page:</label>
          <select id="select-page" name="page">
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
          <span>of 3</span>
        </div>
        <div>
          <button class="previous">Previous</button>
          <button class="next">Next</button>
        </div>
      </div>
    </div>
  `);
  Array.from({ length: 11 }, () => content.querySelector('.products ol').appendChild(product.cloneNode(true)));

  /*
  Mobile
  Click to open overlay, add close icon, CSS only?
  */

  // Add event listeners to all buttons
  content.querySelectorAll('.variants .previous').forEach((el) => el.addEventListener('click', (event) => {
    event.target.closest('.variants').querySelector('.swatches').scrollLeft -= 132;
  }));

  content.querySelectorAll('.variants .next').forEach((el) => el.addEventListener('click', (event) => {
    event.target.closest('.variants').querySelector('.swatches').scrollLeft += 132;
  }));

  // Add event listeners to mobile menu buttons
  content.querySelectorAll('.mobile-menu #toggle-filters, .facets .close').forEach((el) => el.addEventListener('click', (event) => {
    event.target.closest('.product-list-page').querySelector('.facets').classList.toggle('active');
  }));

  content.querySelectorAll('.mobile-menu #toggle-sortby, .sort .overlay .close').forEach((el) => el.addEventListener('click', (event) => {
    event.target.closest('.product-list-page').querySelector('.sort .overlay').classList.toggle('active');
  }));

  block.appendChild(content);
}

import { decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  block.innerHTML = '';
  // fetch nav content
  const resp = await fetch('nav.plain.html');
  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.innerHTML = html;

    // hamburger
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = '<span class="icon icon-mobile-menu"></span>';
    hamburger.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      document.body.style.overflowY = expanded ? '' : 'hidden';
      nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
    nav.querySelector(':scope > div').append(hamburger);
    nav.setAttribute('aria-expanded', 'false');

    // tools
    ['heart', 'minicart'].forEach((tool) => {
      const toolContainer = nav.querySelector('.nav-tools');
      const icon = document.createElement('span');
      icon.classList.add('icon', `icon-${tool}`);
      toolContainer.append(icon);
    });

    // link section
    const ul = document.createElement('ul');
    const menus = [...nav.querySelectorAll('.nav-menu > div')];
    for (let i = 0; i < menus.length - 1; i += 2) {
      const li = document.createElement('li');
      menus[i].classList.add('menu-nav-category');
      menus[i + 1].classList.add('menu-nav-dropdown');

      const dropdownArrow = document.createElement('span');
      dropdownArrow.classList.add('icon', 'icon-dropdown');
      menus[i].append(dropdownArrow);

      li.append(menus[i]);
      ['m-col-1', 'm-col-2', 'm-col-3', 'm-feat-img', 'm-bg-img'].forEach((category, j) => {
        menus[i + 1].querySelector(`:scope > div:nth-child(${j + 1})`)?.classList.add(category);
      });
      li.append(menus[i + 1]);
      li.addEventListener('click', () => {
        const expanded = li.getAttribute('aria-expanded') === 'true';
        li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
      ul.append(li);
    }
    nav.querySelector('.nav-menu').append(ul);

    decorateIcons(nav);

    block.append(nav);
  }
}

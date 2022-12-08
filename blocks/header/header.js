import { decorateIcons } from '../../scripts/lib-franklin.js';

function addDropdownIcon(element) {
  const dropdownArrow = document.createElement('span');
  dropdownArrow.classList.add('icon', 'icon-dropdown');
  element.append(dropdownArrow);
}

function wrapChildren(element, newType) {
  const wrapper = document.createElement(newType);
  wrapper.innerHTML = element.innerHTML;
  element.innerHTML = '';
  element.append(wrapper);
}

function menuHasNoContent(menu) {
  // check that first 4 columns have content
  return [...menu.children].slice(0, 5)
    .reduce((prev, curr) => prev && (curr.children[0]?.children?.length ?? 0) === 0, true);
}

function collapseAllSubmenus(menu) {
  menu.querySelectorAll('*[aria-expanded="true"]').forEach((el) => el.setAttribute('aria-expanded', 'false'));
}

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
      const menuTitle = menus[i];
      const menuDropdownList = menus[i + 1];
      menuTitle.classList.add('menu-nav-category');
      menuDropdownList.classList.add('menu-nav-dropdown');

      if (menuHasNoContent(menuDropdownList)) {
        li.append(menuTitle);
        ul.append(li);
        // eslint-disable-next-line no-continue
        continue;
      }

      addDropdownIcon(menuTitle);
      li.append(menuTitle);

      // Add class name for each column in dropdown
      ['m-col-featured', 'm-col-2', 'm-col-3', 'm-feat-img', 'm-bg-img'].forEach((category, j) => {
        menuDropdownList.querySelector(`:scope > div:nth-child(${j + 1})`)?.classList.add(category);
      });
      li.append(menuDropdownList);

      // Add top-level menu expansion event listener
      li.addEventListener('click', () => {
        const expanded = li.getAttribute('aria-expanded') === 'true';
        collapseAllSubmenus(ul);
        li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
      ul.append(li);

      // Create featured dropdown
      if (li.querySelector('.m-col-featured')?.children.length > 0) {
        const featuredP = document.createElement('p');
        featuredP.innerText = 'featured';
        li.querySelector('.m-col-featured')?.prepend(featuredP);
      }

      // Add second-level expansion even listener
      li.querySelectorAll('p + ul').forEach((subDropdown) => {
        const subDropdownTitle = subDropdown.previousElementSibling;
        subDropdownTitle.setAttribute('aria-expanded', 'false');
        subDropdownTitle.classList.add('m-expandable-title');
        wrapChildren(subDropdownTitle, 'span');
        subDropdown.classList.add('m-expandable-list');
        subDropdownTitle.addEventListener('click', (e) => {
          e.stopPropagation();
          const expanded = subDropdownTitle.getAttribute('aria-expanded') === 'true';
          collapseAllSubmenus(li);
          subDropdownTitle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
        addDropdownIcon(subDropdownTitle);
      });
    }
    nav.querySelector('.nav-menu').append(ul);

    decorateIcons(nav);

    block.append(nav);
  }
}

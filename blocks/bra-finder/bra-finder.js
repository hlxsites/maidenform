class Tabs {
  constructor(rootUl) {
    this.rootUl = rootUl;
  }

  decorate() {
    this.rootUl.setAttribute('role', 'tablist');
    this.rootUl.querySelectorAll(':scope > li > ul').forEach((ul) => {
      this.rootUl.parentElement.append(ul);
      ul.setAttribute('role', 'tabpanel');
      ul.setAttribute('hidden', 'true');
    });
  }

  attachEventListeners() {
    this.rootUl.querySelectorAll(':scope > li').forEach((li, i) => {
      li.addEventListener('click', () => {
        this.setSelectedTab(li, i);
      });
    });
  }

  deselectAllTabs() {
    this.rootUl.querySelectorAll(':scope > li').forEach((li) => {
      li.removeAttribute('aria-selected');
    });
    this.rootUl.parentElement.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
      panel.setAttribute('hidden', 'true');
    });
  }

  setSelectedTab(tab, i) {
    this.deselectAllTabs();
    tab.setAttribute('aria-selected', 'true');
    this.rootUl.parentElement.querySelectorAll('[role="tabpanel"]')[i].removeAttribute('hidden');
  }
}

export default function decorate(block) {
  const blockSections = block.children;

  ['fit-title', 'fit-image-overlay', 'fit-title', 'fit-measure-steps', 'fit-finder-tool', 'fit-tabs'].forEach((section, i) => {
    blockSections[i]?.classList.add(section);
  });

  // image overlay section
  const quizLink = block.querySelector('.fit-image-overlay > div:first-child p:last-of-type > a');
  if (quizLink) {
    const quizLinkParent = quizLink.parentElement;
    const overlaySection = block.querySelector('.fit-image-overlay > div:first-child');
    const rest = [...block.querySelectorAll('.fit-image-overlay > div:first-child > *:not(p:last-of-type)')];
    quizLink.innerHTML = '';
    quizLink.append(...rest);
    overlaySection.append(quizLink);
    quizLinkParent.remove();
  }

  // Instruction tabs section
  const tabs = new Tabs(block.querySelector('.fit-tabs ul'));
  tabs.decorate();
  tabs.attachEventListeners();
}

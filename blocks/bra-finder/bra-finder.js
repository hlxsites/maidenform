// eslint-disable-next-line max-classes-per-file
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

class SizeSelector {
  constructor() {
    this.bandSizes = [32, 34, 36, 38, 40, 42];
  }

  setSelectedBandSize(selectedSize) {
    this.cupSizes = Array.from({ length: 6 }, (_, i) => i + 1 + Number.parseInt(selectedSize, 10));
    this.parent.querySelector('select[name="cup-size"]').innerHTML = `
      <option disabled selected value="">Select your cup size</option>
      ${this.cupSizes.reduce((s, number) => `${s} <option>${number}</option>`, '')}
    `;
    this.parent.querySelector('select[name="cup-size"]').removeAttribute('disabled');
  }

  decorate(parent) {
    this.parent = parent;
    const fitFinderSelector = document.createElement('div');
    fitFinderSelector.classList.add('fit-finder-selector');

    fitFinderSelector.innerHTML = `
    <form action="/bra-fit-calculator/results">
        <div>
            <span class="title-number">1</span>
            <select name="band-size" required>
                <option disabled selected value="">Select your band size</option>
${this.bandSizes.reduce((s, number) => `${s} <option>${number}</option>`, '')}
            </select>
        </div>
        <div>
            <span class="title-number">2</span>
            <select name="cup-size" disabled="true" required>
                <option disabled selected value="">Select your cup size</option>
            </select>
        </div>
        <button>Fit Me</button>
    </form>`;

    parent.append(fitFinderSelector);
    fitFinderSelector.querySelector('select[name="band-size"]').addEventListener('change', (e) => {
      this.setSelectedBandSize(e.target.value);
    });
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

  // Create fit finder tool
  const selector = new SizeSelector();
  selector.decorate(block.querySelector('.fit-finder-tool'));
}

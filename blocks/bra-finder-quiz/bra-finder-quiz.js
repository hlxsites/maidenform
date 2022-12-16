import { toClassName } from '../../scripts/lib-franklin.js';

function deselectAll(parent) {
  parent.querySelectorAll('[aria-selected="true"]').forEach((selected) => {
    selected.removeAttribute('aria-selected');
  });
}

function getCurrentQuestion(block) {
  return block.querySelector('.question:not([hidden="true"])');
}

function checkCanAdvance(block) {
  const currentQuestion = getCurrentQuestion(block);

  const canAdvance = [...currentQuestion.querySelectorAll('ul')]
    .reduce((acc, questionPart) => acc && questionPart.querySelector('[aria-selected="true"]'), true);

  if (canAdvance) {
    block.querySelector('button').removeAttribute('disabled');
  }
}

function convertToValue(li) {
  const strong = li.querySelector(':scope > strong');
  if (strong && strong.children.length === 0) {
    return strong.innerText.split(' ').join('');
  }

  return toClassName(li.innerText.split(' ').join(''));
}

function collectSelections(block) {
  const searchParams = new URLSearchParams();

  block.querySelectorAll('ul').forEach((ul) => {
    // const value
    const selectedLi = ul.querySelector('li[aria-selected="true"]');
    const value = convertToValue(selectedLi);
    searchParams.append(ul.getAttribute('field-name'), value);
  });
  return searchParams;
}

export default function decorate(block) {
  ['title', 'question q1', 'question q2', 'question q3', 'question q4'].forEach((name, i) => {
    block.children[i]?.classList.add(...name.split(' '));
  });

  block.querySelectorAll('.question').forEach((question, i) => {
    if (i !== 0) question.setAttribute('hidden', 'true');
  });

  block.querySelectorAll('ul > li:first-child > em').forEach((fieldNameContainer, i) => {
    const fieldName = fieldNameContainer?.innerText ?? `field-${i}`;
    fieldNameContainer.closest('ul').setAttribute('field-name', fieldName);
    fieldNameContainer.closest('li').remove();
  });

  const nextButton = document.createElement('button');
  nextButton.innerText = 'Next';
  nextButton.setAttribute('disabled', 'true');
  nextButton.addEventListener('click', () => {
    nextButton.setAttribute('disabled', 'true');
    const currentQuestion = getCurrentQuestion(block);
    currentQuestion.setAttribute('hidden', 'true');
    const nextQuestion = currentQuestion.nextElementSibling;
    if (nextQuestion && nextQuestion.classList.contains('question')) {
      nextQuestion.removeAttribute('hidden');
    } else {
      window.location = `/bra-fit-finder/results?${collectSelections(block).toString()}`;
    }
  });
  block.append(nextButton);

  block.querySelectorAll('.question > div > ul > li').forEach((questionChoice) => {
    questionChoice.addEventListener('click', () => {
      deselectAll(questionChoice.closest('ul'));
      questionChoice.setAttribute('aria-selected', 'true');
      checkCanAdvance(block);
    });
  });
}

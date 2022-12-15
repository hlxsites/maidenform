export default async function decorate(block) {
  const params = new URLSearchParams(window.location.search);

  if (params.get('band-size') && params.get('cup-size')) {
    const braSizesResponse = await fetch('/brasizes.json');
    const braSizes = await braSizesResponse.json();

    const recommendation = braSizes.sizes?.data?.find(({ bandSize, cupSize }) => bandSize === params.get('band-size') && cupSize === params.get('cup-size'));

    if (!recommendation) {
      block.innerHTML = '<a href="/bra-finder">An error occurred. Click to go back.</a>';
      return;
    }

    const templateSubstitutes = {
      size: recommendation.size,
      alt1: recommendation.alternative1,
      alt2: recommendation.alternative2,
    };

    [...block.querySelectorAll('em')].forEach((el) => {
      const result = el.innerText.match(/{{(\w+)}}/);
      const templateKey = result?.[1];
      if (templateKey && templateSubstitutes[templateKey]) {
        el.innerText = el.innerText.replace(`{{${templateKey}}}`, templateSubstitutes[templateKey]);
        el.classList.add('substitute-template');
        el.parentElement.classList.add(`substitute-${templateKey}`);
      }
    });
  } else {
    block.innerHTML = '<a href="/bra-finder">An error occurred. Click to go back.</a>';
  }
}

function substituteTemplates(block, templates) {
  [...block.querySelectorAll('em')].forEach((el) => {
    const result = el.innerText.match(/{{(\w+)}}/);
    const templateKey = result?.[1];
    if (templateKey && templates[templateKey]) {
      el.innerText = el.innerText.replace(`{{${templateKey}}}`, templates[templateKey]);
      el.classList.add('substitute-template');
      el.parentElement.classList.add(`substitute-${templateKey}`);
    }
  });
}

async function decorateSimpleResults(block, bandSize, cupSize) {
  const braSizesResponse = await fetch('/brasizes.json');
  const braSizes = await braSizesResponse.json();

  const recommendation = braSizes.sizes?.data?.find(
    ({
      band,
      cup
    }) => bandSize === band && cupSize === cup,
  );

  if (!recommendation) {
    block.innerHTML = '<a href="/bra-finder">An error occurred. Click to go back.</a>';
    return;
  }

  const templateSubstitutes = {
    size: recommendation.size,
    alt1: recommendation.alternative1,
    alt2: recommendation.alternative2,
  };

  substituteTemplates(block, templateSubstitutes);
}

async function decorateExtendedResults(block, bandSize, cupSize, bandFit, cupFit, silhouette) {
  const braSizesResponse = await fetch('/brasizes.json');
  const braSizes = await braSizesResponse.json();

  console.log(braSizes['finder-32']?.data);

  const recommendation = braSizes['finder-32']?.data?.find(
    (rec) => bandSize === rec.band
      && cupSize.toLowerCase() === rec.cup.toLowerCase()
      && bandFit === rec.bandFit
      && rec.cupsFit === cupFit && rec.silhouette === silhouette,
  );

  if (!recommendation) {
    block.innerHTML = '<a href="/bra-finder">An error occurred. No recommendation found. Click to go back.</a>';
    return;
  }

  console.log(recommendation)

  const templateSubstitutes = {
    size: recommendation.size,
    alt1: recommendation.alternative1,
    alt2: recommendation.alternative2,
    recommendation: recommendation.recommendation,
  };

  substituteTemplates(block, templateSubstitutes);

  const otherSilhouettes = [...block.querySelectorAll('ul')].find((ul) => ul.querySelector('li:first-child > em')?.innerText === '{{other-sihlouettes}}');
  if (otherSilhouettes) {
    otherSilhouettes.children[0].remove();
    [...otherSilhouettes.children]
      .find((child) => child.innerText.trim().toLowerCase().replaceAll(/[- ]/g, '') === silhouette)?.remove();
    while (otherSilhouettes.children.length > 3) {
      otherSilhouettes.children[0].remove();
    }
    [...otherSilhouettes.children].forEach((silhouette) => {
      const url = new URL(window.location.href);
      const link = document.createElement('a');
      url.searchParams.set('silhouette', silhouette.innerText.trim().toLowerCase().replaceAll(/[- ]/g, ''));
      link.href = url.href;
      link.innerHTML = silhouette.innerHTML;
      silhouette.innerHTML = link.outerHTML;
    });
    otherSilhouettes.classList.add('other-silhouettes');
  }
}

export default async function decorate(block) {
  const params = new URLSearchParams(window.location.search);

  const bandSize = params.get('band-size');
  const cupSize = params.get('cup-size');
  const bandFit = params.get('band-fit');
  const cupFit = params.get('cup-fit');
  const silhouette = params.get('silhouette');

  if (bandSize && cupSize && bandFit && cupFit && silhouette) {
    await decorateExtendedResults(block, bandSize, cupSize, bandFit, cupFit, silhouette);
  } else if (bandSize && cupSize) {
    await decorateSimpleResults(block, bandSize, cupSize);
  } else {
    block.innerHTML = '<a href="/bra-finder">An error occurred. Click to go back.</a>';
  }
}

export default async function decorate(block) {
  const currentYear = new Date().getFullYear();
  block.innerHTML = block.innerHTML.replaceAll('{year}', currentYear);
}

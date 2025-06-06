function scrollCarrossel(direction) {
  const container = document.getElementById('carrossel');
  const item = container.querySelector('.carrossel-item');

  if (!item) return;

  const itemStyle = window.getComputedStyle(item);
  const itemWidth = item.offsetWidth + parseInt(itemStyle.marginRight || 0) + parseInt(itemStyle.marginLeft || 0);

  container.scrollBy({
    left: direction * itemWidth,
    behavior: 'smooth'
  });
}
function toggleMenu() {
  const nav = document.getElementById('menu');
  nav.classList.toggle('active');
}
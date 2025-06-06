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
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("active");
}

function scrollCarrossel(direction) {
  const carrossel = document.getElementById("carrossel");
  const itemWidth = carrossel.querySelector(".carrossel-item").offsetWidth + 20; // largura + gap

  if (direction === 'right') {
    carrossel.scrollBy({ left: itemWidth * 3, behavior: 'smooth' });
  } else {
    carrossel.scrollTo({ left: 0, behavior: 'smooth' });
  }
}

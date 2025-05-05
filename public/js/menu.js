console.log('menu JS loaded');

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu-toggle');
  const menu   = document.getElementById('menu');   // <ul id="menu">

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('show');
    toggle.setAttribute('aria-expanded', open);
  });

  // メニュー内リンクを押したら閉じる
  menu.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
      menu.classList.remove('show');
      toggle.setAttribute('aria-expanded', false);
    })
  );
});

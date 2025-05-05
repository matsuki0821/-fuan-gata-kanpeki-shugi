/* public/js/menu.js   --- ブラウザ側エントリ */

console.log('🍔 menu JS loaded');       // ← 動作確認用

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu-toggle');
  const menu   = document.getElementById('menu');
  if (!toggle || !menu) {
    console.error('menu‑toggle または menu が見つかりません');
    return;
  }

  // 開閉
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('show');
    toggle.setAttribute('aria-expanded', open);
  });

  // リンクを押したら閉じる
  menu.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
      menu.classList.remove('show');
      toggle.setAttribute('aria-expanded', false);
    }),
  );
});

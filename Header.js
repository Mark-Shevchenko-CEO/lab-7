/**
 * Header UI Component
 * Pure display component — renders site header with logo.
 */
export function Header() {
  return `
    <header class="header">
      <div class="header-inner">
        <span class="logo" data-nav="home" style="cursor:pointer">🍅 Smart Chef</span>
        <nav id="mainNav" class="nav">
          <a href="#" data-nav="home">Головна</a>
          <a href="#" data-nav="meals">Страви</a>
          <a href="#" data-nav="about">Про нас</a>
          <a href="#" data-nav="contact">Контакти</a>
        </nav>
      </div>
    </header>
  `;
}

/**
 * Updates active state of nav links.
 * @param {string} currentPage
 */
export function updateNavActiveState(currentPage) {
  document.querySelectorAll('#mainNav [data-nav]').forEach(link => {
    link.classList.toggle('active', link.dataset.nav === currentPage);
  });
}

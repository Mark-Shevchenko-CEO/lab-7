import { CardList } from '../components/ui/Card.js';

/**
 * HomePage — pure page component.
 * Receives data via props (from state), returns HTML string.
 *
 * @param {{ recipes: Array }} props
 * @returns {string} HTML string
 */
export function HomePage({ recipes }) {
  return `
    <section class="page page-home">
      <div class="hero">
        <span class="hero-tag">🍅 Smart Chef</span>
        <h1 class="hero-title">Готуй з<br>натхненням</h1>
        <p class="hero-sub">Розумний помічник на вашій кухні</p>
        <button class="btn hero-cta" data-nav="meals">🌍 Страви з усього світу</button>
      </div>

      <div class="login-card">
        <h2>Увійти</h2>
        <input type="email" placeholder="Email" autocomplete="email">
        <input type="password" placeholder="Пароль" autocomplete="current-password">
        <button class="btn">Увійти</button>
      </div>

      <section class="recipes-section">
        <h2>Мої рецепти</h2>
        ${CardList({ recipes })}
      </section>

      <section class="assistant-section">
        <h2>Асистент</h2>
        <div class="chat">
          <p class="bot">Привіт! Чим можу допомогти?</p>
          <p class="user">Хочу приготувати борщ</p>
        </div>
      </section>
    </section>
  `;
}

export function bindHomeEvents() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('p').textContent;
      alert(`Відкриваємо рецепт: ${title}`);
    });
  });
}

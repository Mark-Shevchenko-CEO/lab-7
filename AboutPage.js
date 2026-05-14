/**
 * AboutPage — pure page component.
 * No props needed — all content is static.
 * @returns {string} HTML string
 */
export function AboutPage() {
  return `
    <section class="page page-about">
      <div class="about-hero">
        <h1>Про Smart Chef</h1>
        <p class="about-lead">Ваш персональний кулінарний асистент, що допомагає готувати смачно та легко.</p>
      </div>

      <div class="about-grid">
        <div class="about-card">
          <span class="about-icon">🥘</span>
          <h3>Рецепти</h3>
          <p>Багато рецептів від простих до складних. Кожний знайде своє</p>
        </div>
        <div class="about-card">
          <span class="about-icon">🤖</span>
          <h3>AI-Асистент</h3>
          <p>Розумний помічник підкаже що приготувати.</p>
        </div>
        <div class="about-card">
          <span class="about-icon">🌍</span>
          <h3>TheMealDB API</h3>
          <p>Тисячі рецептів з усього світу!</p>
        </div>
        <div class="about-card">
          <span class="about-icon">📱</span>
          <h3>Будь-де</h3>
          <p>Зручний доступ на кухні або в магазині :)</p>
        </div>
      </div>

      <div class="team-section">
        <h2>Команда</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="avatar av1">ОМ</div>
            <p class="member-name">Олена Мельник</p>
            <p class="member-role">Шеф-кухар</p>
          </div>
          <div class="team-member">
            <div class="avatar av2">ІК</div>
            <p class="member-name">Іван Коваль</p>
            <p class="member-role">Розробник</p>
          </div>
          <div class="team-member">
            <div class="avatar av3">СЛ</div>
            <p class="member-name">Соня Лисенко</p>
            <p class="member-role">Дизайнер</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

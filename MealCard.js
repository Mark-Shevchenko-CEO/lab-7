import { escHtml } from '../../services/utils.js';

/**
 * MealCard UI Component — reusable meal card for the meals grid.
 * Reused for both category browsing and search results.
 *
 * @param {{ idMeal: string, strMeal: string, strMealThumb: string }} meal
 * @returns {string} HTML string
 */
export function MealCard({ idMeal, strMeal, strMealThumb }) {
  return `
    <div class="meal-card" data-meal-id="${escHtml(idMeal)}">
      <div class="meal-img-wrap">
        <img src="${escHtml(strMealThumb)}/preview" alt="${escHtml(strMeal)}" loading="lazy">
        <div class="meal-overlay"><span>Детальніше →</span></div>
      </div>
      <div class="meal-info">
        <p class="meal-title">${escHtml(strMeal)}</p>
      </div>
    </div>
  `;
}

/**
 * MealGrid UI Component — renders a grid of MealCard components.
 * @param {{ meals: Array }} props
 * @returns {string} HTML string
 */
export function MealGrid({ meals }) {
  if (!meals.length) return `<div class="empty-state"><p>Нічого не знайдено :(</p></div>`;
  return `
    <div class="meals-grid">
      ${meals.map(m => MealCard(m)).join('')}
    </div>
  `;
}

/**
 * MealDetail UI Component — full detail view for a single meal.
 * @param {Object} meal — raw meal object from TheMealDB API
 * @returns {string} HTML string
 */
export function MealDetail(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const msr = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${msr ? msr.trim() + ' ' : ''}${ing.trim()}`);
  }

  return `
    <section class="page page-meal-detail">
      <button class="btn btn-back" id="backToMeals">← Назад</button>
      <div class="meal-detail-card">
        <div class="meal-detail-img">
          <img src="${escHtml(meal.strMealThumb)}" alt="${escHtml(meal.strMeal)}">
          <div class="meal-detail-badges">
            <span class="badge">${escHtml(meal.strCategory || '')}</span>
            <span class="badge badge-green">${escHtml(meal.strArea || '')}</span>
          </div>
        </div>
        <div class="meal-detail-body">
          <h1 class="meal-detail-title">${escHtml(meal.strMeal)}</h1>
          <div class="ingredients-block">
            <h3>Інгредієнти</h3>
            <ul class="ingredients-list">
              ${ingredients.map(i => `<li>${escHtml(i)}</li>`).join('')}
            </ul>
          </div>
          <div class="instructions-block">
            <h3>Приготування</h3>
            <p>${escHtml(meal.strInstructions || '').replace(/\r?\n/g, '<br>')}</p>
          </div>
          ${meal.strYoutube ? `
            <a href="${escHtml(meal.strYoutube)}" target="_blank" class="btn yt-btn">
              ▶ Переглянути відео
            </a>` : ''}
        </div>
      </div>
    </section>
  `;
}

import { escHtml } from '../../services/utils.js';

/**
 * Card UI Component — reusable recipe card.
 * Used on: Home page (local recipes), potentially elsewhere.
 *
 * @param {{ id: number, title: string, color: string }} recipe
 * @returns {string} HTML string
 */
export function Card({ id, title, color }) {
  return `
    <div class="card" data-id="${id}">
      <div class="img ${escHtml(color)}"></div>
      <p>${escHtml(title)}</p>
    </div>
  `;
}

/**
 * CardList UI Component — renders a list of Card components.
 * @param {Array<{ id: number, title: string, color: string }>} recipes
 * @returns {string} HTML string
 */
export function CardList({ recipes }) {
  return `
    <div class="cards" id="recipeCards">
      ${recipes.map(r => Card(r)).join('')}
    </div>
  `;
}

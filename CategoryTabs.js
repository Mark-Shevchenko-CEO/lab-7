import { escHtml } from '../../services/utils.js';

/**
 * CategoryTabs UI Component
 * Pure display — renders category filter buttons.
 *
 * @param {{ categories: Array, activeCategory: string }} props
 * @returns {string} HTML string
 */
export function CategoryTabs({ categories, activeCategory }) {
  if (!categories.length) return '';
  return `
    <div class="category-tabs">
      ${categories.slice(0, 10).map(c => `
        <button class="cat-tab ${c.strCategory === activeCategory ? 'active' : ''}"
                data-category="${escHtml(c.strCategory)}">
          ${escHtml(c.strCategory)}
        </button>
      `).join('')}
    </div>
  `;
}

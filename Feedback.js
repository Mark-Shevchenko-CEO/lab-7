import { escHtml } from '../../services/utils.js';

/**
 * LoadingSpinner UI Component
 * Pure display — shown during API requests.
 * @returns {string} HTML string
 */
export function LoadingSpinner() {
  return `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Завантаження страв...</p>
    </div>
  `;
}

/**
 * ErrorBlock UI Component
 * Pure display — shown when an API error occurs.
 * @param {{ message: string }} props
 * @returns {string} HTML string
 */
export function ErrorBlock({ message }) {
  return `
    <div class="error-state">
      <span class="error-icon">⚠️</span>
      <p>${escHtml(message)}</p>
      <button class="btn btn-sm" id="retryBtn">Спробувати знову</button>
    </div>
  `;
}

import state from '../../store/state.js';
import { navigate } from '../../services/router.js';
import {
  fetchMealsByCategory,
  fetchCategories,
  fetchMealById,
  searchMeals,
} from '../../services/mealApi.js';
import { CategoryTabs } from '../ui/CategoryTabs.js';
import { MealGrid, MealDetail } from '../ui/MealCard.js';
import { LoadingSpinner, ErrorBlock } from '../ui/Feedback.js';

/**
 * MealsContainer — container component for the Meals page.
 * Handles: rendering, data loading, and all user interactions for /meals.
 */

export function renderMealsPage() {
  const { apiMeals, apiLoading, apiError, apiCategories, apiCategory, selectedMeal } = state;

  if (selectedMeal) return MealDetail(selectedMeal);

  const searchHtml = `
    <div class="search-wrap">
      <input type="text" id="mealSearch" class="search-input" placeholder="Пошук страви.." value="">
      <button class="btn btn-sm" id="searchBtn">🔍</button>
    </div>
  `;

  const contentHtml = apiLoading
    ? LoadingSpinner()
    : apiError
      ? ErrorBlock({ message: apiError })
      : MealGrid({ meals: apiMeals });

  return `
    <section class="page page-meals">
      <div class="meals-header">
        <div>
          <h1 class="meals-title">Страви світу</h1>
          <p class="meals-lead">Рецепти з бази TheMealDB</p>
        </div>
        ${searchHtml}
      </div>
      ${CategoryTabs({ categories: apiCategories, activeCategory: apiCategory })}
      ${contentHtml}
    </section>
  `;
}

export function bindMealsEvents() {
  if (!state.apiCategories.length) loadCategories();
  if (!state.apiMeals.length && !state.apiLoading) loadMeals(state.apiCategory);

  document.querySelectorAll('.cat-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;
      state.setState({ apiCategory: cat, selectedMeal: null });
      loadMeals(cat);
    });
  });

  document.getElementById('retryBtn')?.addEventListener('click', () => loadMeals(state.apiCategory));

  document.querySelectorAll('.meal-card').forEach(card => {
    card.addEventListener('click', () => loadMealDetail(card.dataset.mealId));
  });

  document.getElementById('backToMeals')?.addEventListener('click', () => {
    state.setState({ selectedMeal: null });
  });

  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('mealSearch');

  searchBtn?.addEventListener('click', () => {
    const q = searchInput?.value.trim();
    if (q) loadSearch(q);
  });

  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim();
      if (q) loadSearch(q);
    }
  });
}

// — Data loaders —

async function loadCategories() {
  try {
    const categories = await fetchCategories();
    state.setState({ apiCategories: categories });
  } catch { /* silent */ }
}

async function loadMeals(category) {
  state.setState({ apiLoading: true, apiError: null, apiMeals: [], selectedMeal: null });
  try {
    const meals = await fetchMealsByCategory(category);
    state.setState({ apiMeals: meals, apiLoading: false });
  } catch (err) {
    state.setState({ apiError: err.message, apiLoading: false });
  }
}

async function loadMealDetail(id) {
  state.setState({ apiLoading: true, apiError: null });
  try {
    const meal = await fetchMealById(id);
    state.setState({ selectedMeal: meal, apiLoading: false });
  } catch (err) {
    state.setState({ apiError: err.message, apiLoading: false });
  }
}

async function loadSearch(query) {
  state.setState({ apiLoading: true, apiError: null, apiMeals: [], selectedMeal: null });
  try {
    const meals = await searchMeals(query);
    state.setState({ apiMeals: meals, apiLoading: false });
  } catch (err) {
    state.setState({ apiError: err.message, apiLoading: false });
  }
}

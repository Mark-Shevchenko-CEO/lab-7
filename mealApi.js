const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function fetchMealsByCategory(category = 'Seafood') {
  const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
  if (!response.ok) throw new Error(`Помилка мережі: ${response.status} ${response.statusText}`);
  const data = await response.json();
  if (!data.meals) throw new Error('Страви не знайдено');
  return data.meals.slice(0, 12);
}

export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/categories.php`);
  if (!response.ok) throw new Error(`Помилка мережі: ${response.status} ${response.statusText}`);
  const data = await response.json();
  return data.categories || [];
}

export async function fetchMealById(id) {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  if (!response.ok) throw new Error(`Помилка мережі: ${response.status} ${response.statusText}`);
  const data = await response.json();
  if (!data.meals || !data.meals[0]) throw new Error('Страву не знайдено');
  return data.meals[0];
}

export async function searchMeals(query) {
  const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error(`Помилка мережі: ${response.status} ${response.statusText}`);
  const data = await response.json();
  return data.meals || [];
}

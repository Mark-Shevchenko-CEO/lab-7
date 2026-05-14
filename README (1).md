# 🍅 Smart Chef

Практична робота: рефакторинг Single Page Application

## Структура файлів

smart-chef/
│
├── index.html                          # HTML-оболонка, лише <main id="app">
├── main.js                             # Точка входу, оркестратор
├── styles.css                          # Глобальні стилі
│
├── store/
│   └── state.js                        # Централізований стан + pub/sub
│
├── services/
│   ├── mealApi.js                      # Всі HTTP-запити до TheMealDB
│   ├── router.js                       # navigate(), popstate, resolveRoute
│   └── utils.js                        # escHtml() та інші чисті утиліти
│
├── components/
│   ├── ui/                             # Презентаційні (dumb) компоненти
│   │   ├── Header.js                   # Хедер + updateNavActiveState()
│   │   ├── Footer.js                   # Футер
│   │   ├── Card.js                     # Card + CardList (★ повторне використання)
│   │   ├── MealCard.js                 # MealCard + MealGrid + MealDetail
│   │   ├── CategoryTabs.js             # Кнопки фільтрації категорій
│   │   └── Feedback.js                 # LoadingSpinner + ErrorBlock
│   │
│   └── containers/                     # Контейнерні (smart) компоненти
│       ├── MealsContainer.js           # Логіка сторінки Страви + API
│       └── ContactContainer.js         # Логіка форми + валідація
│
└── pages/
    ├── HomePage.js                     # Головна сторінка
    ├── AboutPage.js                    # Сторінка «Про нас»
    ├── MealsPage.js                    # Re-export MealsContainer
    └── ContactPage.js                  # Re-export ContactContainer

## Архітектурні рішення

### 1. Централізований стан (`store/state.js`)

Весь стан застосунку зберігається в одному об'єкті. Компоненти не зберігають стан локально вони зчитують його зі стору та підписуються на зміни через `state.subscribe(fn)`. При виклику `state.setState(patch)` автоматично тригериться перерендер.

```js
state.subscribe(render);         // підписка
state.setState({ apiLoading: true }); // оновлення → автоматичний ре-рендер
```

### 2. Сервісний шар (`services/`)

Уся взаємодія з зовнішніми системами винесена в окремі модулі:

- `mealApi.js` — HTTP-запити до TheMealDB, повертає Promise
- `router.js` — керує `history.pushState`, слухає `popstate`
- `utils.js` — чисті функції без залежностей (наприклад, `escHtml`)

Жоден компонент не викликає `fetch` напряму.

### 3. Розділення UI і логіки

| Тип | Що робить | Приклад |
|---|---|---|
| **UI-компонент** | Отримує дані → повертає HTML-рядок | `Card({ id, title, color })` |
| **Контейнер** | Тримає логіку, викликає API, bind-ить події | `MealsContainer.js` |
| **Сторінка** | Компонує потрібні частини для маршруту | `HomePage.js` |

### 4. Тонкий `main.js`

`main.js` — оркестратор, а не «God Component». Його єдині обов'язки:

1. Вмонтувати `Header` і `Footer` у DOM при старті
2. Підписатися на стан і при кожній зміні викликати потрібну сторінку
3. Прив'язати глобальні `[data-nav]` посилання

```js
// Реєстр сторінок вся логіка маршрутизації
const pages = {
  home:    { render: (s) => HomePage({ recipes: s.recipes }), bind: bindHomeEvents },
  meals:   { render: ()  => MealsPage(),                      bind: bindMealsEvents },
  about:   { render: ()  => AboutPage(),                      bind: () => {} },
  contact: { render: ()  => ContactPage(),                    bind: bindContactEvents },
};
```

---

## Типи компонентів

### UI-компоненти (Presentational / Dumb)

Чисті функції без побічних ефектів. Отримують дані через аргументи, повертають рядок HTML. Нічого не знають про стан, API чи DOM.

```js
// Card.js — приклад UI-компонента
export function Card({ id, title, color }) {
  return `
    <div class="card" data-id="${id}">
      <div class="img ${escHtml(color)}"></div>
      <p>${escHtml(title)}</p>
    </div>
  `;
}
```

**Список UI-компонентів:**
- `Header` — хедер з логотипом і навігацією
- `Footer` — футер
- `Card` + `CardList` — картка рецепту (★ повторне використання)
- `MealCard` + `MealGrid` + `MealDetail` — картка/грід/деталі страви
- `CategoryTabs` — кнопки фільтрації категорій
- `LoadingSpinner` — індикатор завантаження
- `ErrorBlock` — блок помилки з кнопкою «Спробувати знову»

### Контейнерні компоненти (Container / Smart)

Містять бізнес-логіку. Знають про стор, викликають сервіси, прив'язують обробники подій. Делегують рендер UI-компонентам.

**`MealsContainer.js`** відповідає за:
- початкове завантаження категорій і страв
- зміну активної категорії
- пошук за запитом
- відкриття детального перегляду
- кнопку «Назад» та «Спробувати знову»

**`ContactContainer.js`** відповідає за:
- збереження значень форми у стор при кожному `input`
- валідацію при сабміті (ім'я, email, повідомлення)
- відображення помилок і повідомлення про успіх
- додавання нового рецепту в стор після успішного відправлення

---

## Потік даних

```
Дія користувача (клік, введення тексту)
         │
         ▼
   services/router.js  або  обробник події в Container
         │
         ▼
   store/state.setState({ ... })
         │
         └──► _listeners[] → main.js render()
                                    │
                          ┌─────────┼──────────┐
                          ▼         ▼          ▼
                      pages/   containers/   ui/
                    (компонує) (логіка+API) (HTML-рядки)
```

Дані течуть **зверху вниз** через параметри функцій. Зворотний зв'язок відбувається тільки через `state.setState()`.

---

## Повторне використання компонентів

### `Card` — використовується у двох місцях

**Місце 1 — `HomePage`:** відображає локальні рецепти зі `state.recipes`
```js
// pages/HomePage.js
import { CardList } from '../components/ui/Card.js';

export function HomePage({ recipes }) {
  return `...${CardList({ recipes })}...`;
}
```

**Місце 2 — `ContactContainer`:** після успішного сабміту форми створює нову картку
```js
// components/containers/ContactContainer.js
const newRecipe = { id: Date.now(), title: `Рецепт від ${name}`, color: 'gray' };
state.setState({ recipes: [...state.recipes, newRecipe] });
// → HomePage автоматично отримає оновлений список і відрендерить новий Card
```

### `MealCard` — використовується у двох контекстах

- У `MealGrid` — для кожної картки в гріді страв
- У `MealDetail` — для показу повної інформації про обрану страву

Той самий компонент, різний контекст виклику.

---

## Що змінилось порівняно з оригіналом

| Аспект | До рефакторингу | Після |
|---|---|---|
| Кількість файлів | 5 | 17 |
| `main.js` (рядків логіки) | ~300 | ~50 |
| HTTP-запити | у `api.js` + частково в `main.js` | тільки `services/mealApi.js` |
| Роутер | `rout.js` | `services/router.js` |
| HTML-шаблони | вбудовані функції в `main.js` | окремі компоненти в `ui/` |
| Логіка форми | змішана з шаблоном у `main.js` | `ContactContainer.js` |
| Логіка API страв | змішана з шаблоном у `main.js` | `MealsContainer.js` |
| «God Component» | так | ні |
| Повторне використання | немає | `Card`, `MealCard` |

---

## Запуск проєкту

Проєкт використовує ES-модулі (`type="module"`), тому потрібен локальний HTTP-сервер.

```bash
# Варіант 1 — через Node.js
npx serve .

# Варіант 2 — через Python
python3 -m http.server 8080

# Варіант 3 розширення Live Server у VS Code
# Правий клік на index.html → Open with Live Server
```

Після запуску відкрийте `http://localhost:8080` у браузері.
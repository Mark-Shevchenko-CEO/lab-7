const state = {
  currentPage: 'home',

  formData: {
    name: '',
    email: '',
    message: '',
  },

  recipes: [
    { id: 1, title: 'Борщ',  color: 'red'  },
    { id: 2, title: 'Суп',   color: 'gray' },
    { id: 3, title: 'Салат', color: 'blue' },
  ],

  apiMeals:      [],
  apiCategories: [],
  apiLoading:    false,
  apiError:      null,
  apiCategory:   'Seafood',
  selectedMeal:  null,

  _listeners: [],

  subscribe(fn) {
    this._listeners.push(fn);
  },

  setState(patch) {
    Object.assign(this, patch);
    this._listeners.forEach(fn => fn(this));
  },
};

export default state;

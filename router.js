import state from '../store/state.js';

const routes = {
  '/':        'home',
  '/about':   'about',
  '/contact': 'contact',
  '/meals':   'meals',
};

const pageToPath = Object.fromEntries(
  Object.entries(routes).map(([path, page]) => [page, path])
);

export function navigate(page) {
  const path = pageToPath[page] || '/';
  history.pushState({ page }, '', path);
  state.setState({ currentPage: page });
}

export function resolveCurrentRoute() {
  const path = window.location.pathname;
  const page = routes[path] || 'home';
  state.setState({ currentPage: page });
}

window.addEventListener('popstate', (e) => {
  const page = e.state?.page || routes[window.location.pathname] || 'home';
  state.setState({ currentPage: page });
});

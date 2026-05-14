import state from './store/state.js';
import { navigate, resolveCurrentRoute } from './services/router.js';

import { Header, updateNavActiveState } from './components/ui/Header.js';
import { Footer } from './components/ui/Footer.js';

import { HomePage,    bindHomeEvents    } from './pages/HomePage.js';
import { AboutPage                      } from './pages/AboutPage.js';
import { MealsPage,   bindMealsEvents   } from './pages/MealsPage.js';
import { ContactPage, bindContactEvents } from './pages/ContactPage.js';

//Page registry

const pages = {
  home:    { render: (s) => HomePage({ recipes: s.recipes }), bind: bindHomeEvents    },
  meals:   { render: ()  => MealsPage(),                      bind: bindMealsEvents   },
  about:   { render: ()  => AboutPage(),                      bind: () => {}          },
  contact: { render: ()  => ContactPage(),                    bind: bindContactEvents },
};

//Mount static layout

document.body.insertAdjacentHTML('afterbegin', Header());
document.body.insertAdjacentHTML('beforeend', Footer());

//Render loop

function render(currentState) {
  const app = document.getElementById('app');
  updateNavActiveState(currentState.currentPage);

  const page = pages[currentState.currentPage] || pages.home;
  app.innerHTML = page.render(currentState);
  bindGlobalNavEvents();
  page.bind();
}

//Global nav (header + any data-nav elements)

function bindGlobalNavEvents() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(el.dataset.nav);
    });
  });
}

//Bootstrap

resolveCurrentRoute();
state.subscribe(render);
render(state);

import state from '../../store/state.js';
import { navigate } from '../../services/router.js';
import { escHtml } from '../../services/utils.js';

/**
 * ContactContainer — container component for the Contact page.
 * Handles form rendering, validation, and submission logic.
 */

export function renderContactPage() {
  const { name, email, message } = state.formData;
  return `
    <section class="page page-contact">
      <h1>Зв'яжіться з нами</h1>
      <p class="contact-lead">Маєте питання або пропозиції? Напишіть нам!</p>
      <form id="contactForm" class="contact-form" novalidate>
        <div class="field-group">
          <label for="cName">Ім'я</label>
          <input type="text" id="cName" placeholder="Ваше ім'я" value="${escHtml(name)}" required>
        </div>
        <div class="field-group">
          <label for="cEmail">Email</label>
          <input type="email" id="cEmail" placeholder="your@email.com" value="${escHtml(email)}" required>
        </div>
        <div class="field-group">
          <label for="cMessage">Повідомлення</label>
          <textarea id="cMessage" placeholder="Ваше повідомлення..." rows="5" required>${escHtml(message)}</textarea>
        </div>
        <div id="formErrors" class="form-errors"></div>
        <div id="formSuccess" class="form-success" style="display:none">
          Дякуємо! Ваша думка дуже корисна для нашого розвитку :)
        </div>
        <button type="submit" class="btn btn-full">Надіслати</button>
      </form>
    </section>
  `;
}

export function bindContactEvents() {
  const form    = document.getElementById('contactForm');
  const nameEl  = document.getElementById('cName');
  const emailEl = document.getElementById('cEmail');
  const msgEl   = document.getElementById('cMessage');

  // Keep form data in sync with state
  [nameEl, emailEl, msgEl].forEach(el => {
    el.addEventListener('input', () => {
      state.formData.name    = nameEl.value;
      state.formData.email   = emailEl.value;
      state.formData.message = msgEl.value;
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = validateForm(nameEl.value, emailEl.value, msgEl.value);
    const errBox = document.getElementById('formErrors');
    const okBox  = document.getElementById('formSuccess');

    if (errors.length) {
      errBox.innerHTML = errors.map(e => `<p>❌ ${e}</p>`).join('');
      okBox.style.display = 'none';
    } else {
      errBox.innerHTML = '';
      okBox.style.display = 'block';
      const newRecipe = {
        id:    Date.now(),
        title: `Рецепт від ${nameEl.value.trim()}`,
        color: 'gray',
      };
      state.setState({
        recipes:  [...state.recipes, newRecipe],
        formData: { name: '', email: '', message: '' },
      });
      setTimeout(() => navigate('home'), 1500);
    }
  });
}

// — Validation (pure function, no side effects) —

function validateForm(name, email, message) {
  const errors = [];
  if (!name.trim())  errors.push("Ім'я обов'язкове");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.push('Некоректний email');
  if (!message.trim()) errors.push("Повідомлення обов'язкове");
  return errors;
}

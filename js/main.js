const menuToggle = document.querySelector('.nav__toggle');
const navigation = document.querySelector('#primary-navigation');

if (menuToggle instanceof HTMLButtonElement && navigation instanceof HTMLElement) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    navigation.classList.toggle('nav--open', !isExpanded);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement && !event.target.classList.contains('btn')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('nav--open');
    }
  });
}

const faqQuestions = document.querySelectorAll('.faq__question');

faqQuestions.forEach((question) => {
  question.addEventListener('click', () => {
    const answerId = question.getAttribute('aria-controls');
    const answer = answerId ? document.getElementById(answerId) : null;

    if (!(answer instanceof HTMLElement)) {
      return;
    }

    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    question.setAttribute('aria-expanded', String(!isExpanded));
    answer.hidden = isExpanded;
  });
});

const billingOptions = document.querySelectorAll('.pricing-toggle__option');
const prices = document.querySelectorAll('.pricing__value');
const billingNotes = document.querySelectorAll('.pricing__billing-note');

billingOptions.forEach((option) => {
  option.addEventListener('click', () => {
    const billingPeriod = option.dataset.billing;

    if (billingPeriod !== 'monthly' && billingPeriod !== 'yearly') {
      return;
    }

    billingOptions.forEach((billingOption) => {
      const isActive = billingOption === option;
      billingOption.classList.toggle('pricing-toggle__option--active', isActive);
      billingOption.setAttribute('aria-pressed', String(isActive));
    });

    prices.forEach((price, index) => {
      const value = price.dataset[billingPeriod];

      if (value) {
        price.textContent = value === 'custom' ? "Let's talk" : `$${value}`;
      }

      const note = billingNotes[index];
      if (note) {
        note.textContent = price.dataset.monthly === 'custom'
          ? 'Tailored to your team'
          : billingPeriod === 'yearly' ? 'Billed yearly · 2 months free' : 'Billed monthly';
      }
    });

    document.querySelectorAll('.pricing__period').forEach((period) => {
      period.textContent = billingPeriod === 'yearly' ? '/ year' : '/ month';
    });
  });
});

const planSelect = document.querySelector('#plan');
document.querySelectorAll('[data-plan]').forEach((link) => {
  link.addEventListener('click', () => {
    if (planSelect instanceof HTMLSelectElement) {
      planSelect.value = link.getAttribute('data-plan') || '';
    }
  });
});

const signupForm = document.querySelector('#signup-form');
const formStatus = document.querySelector('#form-status');

if (signupForm instanceof HTMLFormElement && formStatus instanceof HTMLElement) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!signupForm.reportValidity()) {
      return;
    }

    formStatus.textContent = 'Thanks for your interest. This demo form is not connected to enrollment, so your details were not sent or stored.';
    signupForm.reset();
  });
}

const currentYear = document.querySelector('#current-year');
if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

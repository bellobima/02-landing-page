/**
 * Initializes the responsive navigation menu.
 */
const initMobileMenu = () => {
  const menuToggle = document.querySelector('.nav__toggle');
  const navigation = document.querySelector('#primary-navigation');

  if (!(menuToggle instanceof HTMLButtonElement) || !(navigation instanceof HTMLElement)) {
    return;
  }

  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('nav--open');
  };

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    navigation.classList.toggle('nav--open', !isExpanded);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuToggle.focus();
    }
  });
};

/**
 * Initializes the single-open, height-animated FAQ accordion.
 */
const initAccordion = () => {
  const questions = document.querySelectorAll('.faq__question');

  const setPanelState = (question, panel, shouldOpen) => {
    question.setAttribute('aria-expanded', String(shouldOpen));

    if (shouldOpen) {
      panel.hidden = false;
      panel.style.height = '0px';
      requestAnimationFrame(() => {
        panel.style.height = `${panel.scrollHeight}px`;
      });
      return;
    }

    panel.style.height = `${panel.scrollHeight}px`;
    requestAnimationFrame(() => {
      panel.style.height = '0px';
    });
  };

  questions.forEach((question) => {
    const panelId = question.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;

    if (!(panel instanceof HTMLElement)) {
      return;
    }

    question.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    panel.style.height = '0px';

    panel.addEventListener('transitionend', (event) => {
      if (event.propertyName !== 'height') {
        return;
      }

      if (question.getAttribute('aria-expanded') === 'true') {
        panel.style.height = 'auto';
      } else {
        panel.hidden = true;
      }
    });

    question.addEventListener('click', () => {
      const shouldOpen = question.getAttribute('aria-expanded') !== 'true';

      questions.forEach((otherQuestion) => {
        if (otherQuestion === question) {
          return;
        }

        const otherPanelId = otherQuestion.getAttribute('aria-controls');
        const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;

        if (otherPanel instanceof HTMLElement && otherQuestion.getAttribute('aria-expanded') === 'true') {
          setPanelState(otherQuestion, otherPanel, false);
        }
      });

      setPanelState(question, panel, shouldOpen);
    });
  });
};

/**
 * Initializes the monthly/yearly pricing switch and displayed savings.
 */
const initPricingToggle = () => {
  const options = document.querySelectorAll('.pricing-toggle__option');
  const prices = document.querySelectorAll('.pricing__value');
  const billingNotes = document.querySelectorAll('.pricing__billing-note');
  const savingsBadge = document.querySelector('.pricing-toggle__badge');

  const setBillingPeriod = (period) => {
    options.forEach((option) => {
      const isActive = option.dataset.billing === period;
      option.classList.toggle('pricing-toggle__option--active', isActive);
      option.setAttribute('aria-pressed', String(isActive));
    });

    prices.forEach((price, index) => {
      const value = price.dataset[period];

      if (value) {
        price.textContent = value === 'custom' ? "Let's talk" : `$${value}`;
      }

      const billingNote = billingNotes[index];
      if (billingNote) {
        billingNote.textContent = price.dataset.monthly === 'custom'
          ? 'Tailored to your team'
          : period === 'yearly' ? 'Billed yearly · save 20%' : 'Billed monthly';
      }
    });

    document.querySelectorAll('.pricing__period').forEach((pricePeriod) => {
      pricePeriod.textContent = period === 'yearly' ? '/ year' : '/ month';
    });

    if (savingsBadge instanceof HTMLElement) {
      savingsBadge.hidden = period !== 'yearly';
    }
  };

  options.forEach((option) => {
    option.addEventListener('click', () => {
      const period = option.dataset.billing;

      if (period === 'monthly' || period === 'yearly') {
        setBillingPeriod(period);
      }
    });
  });
};

/**
 * Adds a shadow to the sticky header after the page scrolls.
 */
const initHeaderShadow = () => {
  const header = document.querySelector('.header');

  if (!(header instanceof HTMLElement)) {
    return;
  }

  const updateHeaderShadow = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', updateHeaderShadow, { passive: true });
  updateHeaderShadow();
};

/**
 * Prefills the enquiry form from a selected pricing plan.
 */
const initPlanSelection = () => {
  const planSelect = document.querySelector('#plan');

  if (!(planSelect instanceof HTMLSelectElement)) {
    return;
  }

  document.querySelectorAll('[data-plan]').forEach((link) => {
    link.addEventListener('click', () => {
      planSelect.value = link.getAttribute('data-plan') || '';
    });
  });
};

/**
 * Validates and stores a signup in this browser's local storage.
 */
const initSignupForm = () => {
  const signupForm = document.querySelector('#signup-form');
  const formStatus = document.querySelector('#form-status');

  if (!(signupForm instanceof HTMLFormElement) || !(formStatus instanceof HTMLElement)) {
    return;
  }

  const fields = {
    name: signupForm.elements.namedItem('name'),
    email: signupForm.elements.namedItem('email'),
    plan: signupForm.elements.namedItem('plan'),
    terms: signupForm.elements.namedItem('terms')
  };
  const validation = {
    name: { field: fields.name, error: document.querySelector('#name-error') },
    email: { field: fields.email, error: document.querySelector('#email-error') },
    plan: { field: fields.plan, error: document.querySelector('#plan-error') },
    terms: { field: fields.terms, error: document.querySelector('#terms-error') }
  };
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const setFieldError = (key, message) => {
    const item = validation[key];

    if (!(item.field instanceof HTMLElement) || !(item.error instanceof HTMLElement)) {
      return;
    }

    item.field.setAttribute('aria-invalid', String(Boolean(message)));
    item.error.textContent = message;
  };

  const validateField = (key) => {
    switch (key) {
      case 'name':
        setFieldError('name', fields.name instanceof HTMLInputElement && fields.name.value.trim().length < 2
          ? 'Enter a name with at least 2 characters.'
          : '');
        break;
      case 'email':
        setFieldError('email', fields.email instanceof HTMLInputElement && !emailPattern.test(fields.email.value.trim())
          ? 'Enter a valid email address.'
          : '');
        break;
      case 'plan':
        setFieldError('plan', fields.plan instanceof HTMLSelectElement && !fields.plan.value
          ? 'Select a program.'
          : '');
        break;
      case 'terms':
        setFieldError('terms', fields.terms instanceof HTMLInputElement && !fields.terms.checked
          ? 'Agree to the terms to continue.'
          : '');
        break;
      default:
        break;
    }

    const item = validation[key];
    return item?.field instanceof HTMLElement && item.field.getAttribute('aria-invalid') !== 'true';
  };

  Object.keys(validation).forEach((key) => {
    const item = validation[key];

    if (!(item.field instanceof HTMLElement)) {
      return;
    }

    const eventName = item.field instanceof HTMLSelectElement || item.field instanceof HTMLInputElement && item.field.type === 'checkbox'
      ? 'change'
      : 'input';

    item.field.addEventListener(eventName, () => {
      validateField(key);
      formStatus.textContent = '';
      formStatus.classList.remove('form__status--error');
    });
  });

  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus.textContent = '';
    formStatus.classList.remove('form__status--error');

    const isValid = Object.keys(validation).map(validateField).every(Boolean);

    if (!isValid) {
      const firstInvalidField = Object.values(validation).find(({ field }) => field instanceof HTMLElement && field.getAttribute('aria-invalid') === 'true')?.field;
      firstInvalidField?.focus();
      return;
    }

    if (!(fields.name instanceof HTMLInputElement) || !(fields.email instanceof HTMLInputElement) || !(fields.plan instanceof HTMLSelectElement)) {
      formStatus.textContent = 'The signup form could not be processed because a required field is unavailable.';
      formStatus.classList.add('form__status--error');
      return;
    }

    const signup = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      plan: fields.plan.value,
      createdAt: new Date().toISOString()
    };

    try {
      const storedSignups = localStorage.getItem('signups');
      const signups = storedSignups ? JSON.parse(storedSignups) : [];

      if (!Array.isArray(signups)) {
        formStatus.textContent = 'Your signup could not be saved because the stored signup data is invalid. Clear the "signups" entry in localStorage and try again.';
        formStatus.classList.add('form__status--error');
        return;
      }

      const alreadySignedUp = signups.some((entry) => (
        entry && typeof entry.email === 'string' && entry.email.trim().toLowerCase() === signup.email.toLowerCase()
      ));

      if (alreadySignedUp) {
        formStatus.textContent = "You've already signed up";
        formStatus.classList.add('form__status--error');
        return;
      }

      localStorage.setItem('signups', JSON.stringify([...signups, signup]));
    } catch (error) {
      formStatus.textContent = error instanceof SyntaxError
        ? 'Your signup could not be saved because the stored signup data is invalid. Clear the "signups" entry in localStorage and try again.'
        : 'Your signup could not be saved in this browser. Check that local storage is available and try again.';
      formStatus.classList.add('form__status--error');
      return;
    }

    signupForm.reset();
    Object.keys(validation).forEach((key) => setFieldError(key, ''));
    Object.values(validation).forEach(({ field }) => field instanceof HTMLElement && field.setAttribute('aria-invalid', 'false'));
    formStatus.textContent = 'Thanks for signing up. Your enquiry has been saved in this browser.';
  });
};

/**
 * Sets the footer copyright year to the current year.
 */
const initFooterYear = () => {
  const year = document.querySelector('#current-year');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
};

/**
 * Initializes the page behavior after the document has been parsed.
 */
const init = () => {
  initMobileMenu();
  initAccordion();
  initPricingToggle();
  initHeaderShadow();
  initPlanSelection();
  initSignupForm();
  initFooterYear();
};

document.addEventListener('DOMContentLoaded', init);

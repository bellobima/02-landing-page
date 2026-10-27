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
 * Validates the demo enquiry form and explains that it does not submit data.
 */
const initSignupForm = () => {
  const signupForm = document.querySelector('#signup-form');
  const formStatus = document.querySelector('#form-status');

  if (!(signupForm instanceof HTMLFormElement) || !(formStatus instanceof HTMLElement)) {
    return;
  }

  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!signupForm.reportValidity()) {
      return;
    }

    formStatus.textContent = 'Thanks for your interest. This demo form is not connected to enrollment, so your details were not sent or stored.';
    signupForm.reset();
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

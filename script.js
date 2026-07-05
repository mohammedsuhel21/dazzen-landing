(() => {
  'use strict';

  // ---------------------------------------------------------------------
  // CONFIG
  // launchDate: estimated timeline only — update when a real date is set.
  // waitlistEndpoint: POST target for signups. Currently wired to a Google
  // Apps Script Web App tied to a Google Sheet (Name, Email, Phone,
  // Timestamp, Source columns). To point at a different backend, replace
  // this URL — the payload shape stays { firstName, email, phone, timestamp,
  // source }. Leave it as '' to fall back to a localStorage-only demo mode.
  //
  // Supabase option:
  //   1. Create a table `waitlist` (id uuid default gen_random_uuid(),
  //      first_name text, email text unique, phone text, source text,
  //      created_at timestamptz default now()).
  //   2. Create a Supabase Edge Function (or serverless function on Vercel/
  //      Netlify) that receives this JSON body and calls:
  //        supabase.from('waitlist').insert({ first_name, email, phone, source })
  //   3. Keep SUPABASE_URL / SUPABASE_ANON_KEY as server-side environment
  //      variables — never embed real keys in this client file.
  //   4. Point waitlistEndpoint at that function's URL.
  //
  // Google Sheets option (current): an Apps Script Web App with a doPost
  // handler that appends [firstName, email, phone, timestamp, source] as a
  // row. See README.md for the exact script and deployment steps.
  // ---------------------------------------------------------------------
  const CONFIG = {
    launchDate: '2026-10-15T00:00:00+05:30',
    showCountdown: true,
    waitlistEndpoint: 'https://script.google.com/macros/s/AKfycbwmhSOzgFsx3J_2y3sL_RaaCME6qpLrR2WGTgBeEWTvbSTAp-UmiPgdtBd3hFV_GvHjOg/exec',
  };

  const STORAGE_KEY = 'dazzen_waitlist';

  // ---------------------------------------------------------------------
  // Scroll-reveal
  // ---------------------------------------------------------------------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ---------------------------------------------------------------------
  // Hero blob parallax
  // ---------------------------------------------------------------------
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      parallaxEls.forEach((el) => {
        const factor = parseFloat(el.getAttribute('data-parallax')) || 0;
        el.style.transform = `translateY(${y * factor}px)`;
      });
    }, { passive: true });
  }

  // ---------------------------------------------------------------------
  // Countdown
  // ---------------------------------------------------------------------
  const countdownSection = document.querySelector('[data-countdown-section]');
  if (countdownSection) {
    if (!CONFIG.showCountdown) {
      countdownSection.hidden = true;
    } else {
      const target = new Date(CONFIG.launchDate).getTime();
      const els = {
        days: countdownSection.querySelector('[data-countdown="days"]'),
        hours: countdownSection.querySelector('[data-countdown="hours"]'),
        minutes: countdownSection.querySelector('[data-countdown="minutes"]'),
        seconds: countdownSection.querySelector('[data-countdown="seconds"]'),
      };
      const pad = (n) => String(n).padStart(2, '0');
      const tick = () => {
        const diff = Math.max(0, target - Date.now());
        els.days.textContent = pad(Math.floor(diff / 86400000));
        els.hours.textContent = pad(Math.floor(diff / 3600000) % 24);
        els.minutes.textContent = pad(Math.floor(diff / 60000) % 60);
        els.seconds.textContent = pad(Math.floor(diff / 1000) % 60);
      };
      tick();
      setInterval(tick, 1000);
    }
  }

  // ---------------------------------------------------------------------
  // Button ripple
  // ---------------------------------------------------------------------
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const span = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 1.4;
      span.className = 'ripple';
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${e.clientX - rect.left - size / 2}px`;
      span.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(span);
      span.addEventListener('animationend', () => span.remove());
    });
  });

  // ---------------------------------------------------------------------
  // Waitlist forms (two independent instances: hero card = "a", closing CTA = "b")
  // ---------------------------------------------------------------------
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\+?\d{7,15}$/.test(phone.replace(/[\s\-()]/g, ''));

  function readStored() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (err) {
      return [];
    }
  }

  function setLoading(form, isLoading) {
    const button = form.querySelector('button[type="submit"]');
    const indicator = button.querySelector('[data-loading-indicator]');
    const label = button.querySelector('[data-submit-label]');
    if (!button.dataset.defaultLabel) button.dataset.defaultLabel = label.textContent;
    button.disabled = isLoading;
    if (indicator) indicator.hidden = !isLoading;
    if (label) label.textContent = isLoading ? 'Joining…' : button.dataset.defaultLabel;
  }

  document.querySelectorAll('[data-waitlist-form]').forEach((form) => {
    const key = form.getAttribute('data-waitlist-form');
    const errorEl = document.querySelector(`[data-form-error="${key}"]`);
    const idleEl = document.querySelector(`[data-form-idle="${key}"]`);
    const successEl = document.querySelector(`[data-form-success="${key}"]`);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameEl = form.querySelector('[data-field="name"]');
      const emailEl = form.querySelector('[data-field="email"]');
      const phoneEl = form.querySelector('[data-field="phone"]');

      const firstName = (nameEl.value || '').trim();
      const email = (emailEl.value || '').trim().toLowerCase();
      const phone = (phoneEl.value || '').trim();

      const showError = (msg) => {
        errorEl.textContent = msg;
        errorEl.hidden = false;
      };

      if (!firstName) return showError('Please enter your first name.');
      if (!isValidEmail(email)) return showError('Please enter a valid email address.');
      if (!isValidPhone(phone)) return showError('Please enter a valid contact number.');

      const stored = readStored();
      if (stored.some((row) => row.email === email)) {
        return showError("You're already on the waitlist.");
      }

      errorEl.hidden = true;
      setLoading(form, true);

      const entry = { firstName, email, phone, timestamp: new Date().toISOString(), source: 'dazzen-launch-page' };

      try {
        if (CONFIG.waitlistEndpoint) {
          // Content-Type left as text/plain on purpose: Google Apps Script web
          // apps don't handle CORS preflight (OPTIONS) requests, and a
          // "simple request" (text/plain) skips the preflight entirely. The
          // Apps Script side still reads it fine via JSON.parse(e.postData.contents).
          await fetch(CONFIG.waitlistEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(entry),
          });
        } else {
          await new Promise((resolve) => setTimeout(resolve, 900));
        }
        stored.push(entry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        idleEl.hidden = true;
        successEl.hidden = false;
      } catch (err) {
        setLoading(form, false);
        showError('Something went wrong. Please try again.');
      }
    });
  });
})();

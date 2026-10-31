// Matty's Christening Invitation - Interactive Logic & Audio Synth

(function () {
  'use strict';

  // --- Music Synthesizer (Web Audio API) ---
  const melodyNotes = [
    659.25, 783.99, 1046.5, 783.99, 880, 783.99, 659.25, 587.33,
    523.25, 659.25, 783.99, 659.25, 587.33, 659.25, 523.25, 0
  ];
  const bassNotes = [130.81, 196, 174.61, 196];

  let audioCtx = null;
  let synthTimer = null;
  let noteIndex = 0;
  let isMusicPlaying = false;

  function playTone(freq, duration, peakGain, oscType) {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = oscType;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  function onSynthTick() {
    const melody = melodyNotes[noteIndex % 16];
    if (melody) {
      playTone(melody, 1.6, 0.07, 'triangle');
    }
    if (noteIndex % 4 === 0) {
      playTone(bassNotes[(noteIndex / 4) % 4], 2.4, 0.05, 'sine');
    }
    noteIndex++;
  }

  function startMusic() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) {
        audioCtx = new AudioCtx();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!synthTimer) {
        synthTimer = setInterval(onSynthTick, 470);
      }
      isMusicPlaying = true;
      updateMusicButtonUI(true);
      return true;
    } catch (e) {
      console.warn('Audio play failed or blocked:', e);
      return false;
    }
  }

  function stopMusic() {
    if (synthTimer) {
      clearInterval(synthTimer);
      synthTimer = null;
    }
    isMusicPlaying = false;
    updateMusicButtonUI(false);
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }

  function updateMusicButtonUI(playing) {
    const muBtn = document.getElementById('mu');
    if (!muBtn) return;
    if (playing) {
      muBtn.classList.add('on');
      muBtn.setAttribute('aria-pressed', 'true');
      muBtn.textContent = '❚❚';
    } else {
      muBtn.classList.remove('on');
      muBtn.setAttribute('aria-pressed', 'false');
      muBtn.textContent = '♪';
    }
  }

  // --- Curtain Transition ---
  const curDialog = document.getElementById('cur');
  const btnOpenMusic = document.getElementById('co');
  const btnOpenSilent = document.getElementById('cq');
  const btnMusicToggle = document.getElementById('mu');

  function openCurtain(withMusic) {
    if (!curDialog) return;
    curDialog.classList.add('open');

    if (btnMusicToggle) {
      btnMusicToggle.removeAttribute('hidden');
    }

    if (withMusic) {
      startMusic();
    } else {
      stopMusic();
    }

    setTimeout(function () {
      document.body.classList.remove('lock');
      if (curDialog && curDialog.parentNode) {
        curDialog.style.display = 'none';
      }
    }, 1900);
  }

  if (btnOpenMusic) {
    btnOpenMusic.addEventListener('click', function () {
      openCurtain(true);
    });
  }

  if (btnOpenSilent) {
    btnOpenSilent.addEventListener('click', function () {
      openCurtain(false);
    });
  }

  if (btnMusicToggle) {
    btnMusicToggle.addEventListener('click', function () {
      toggleMusic();
    });
  }

  // Auto focus open button on load
  if (btnOpenMusic) {
    btnOpenMusic.focus();
  }

  // Handle visibility change (pause music when tab is hidden)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && isMusicPlaying) {
      stopMusic();
    }
  });

  // --- Real-time Countdown Timer ---
  const countdownRoot = document.getElementById('countdown-root');
  const targetDateStr = '2026-08-19T00:00:00+08:00';
  const targetTime = new Date(targetDateStr).getTime();

  function updateCountdown() {
    if (!countdownRoot) return;
    const now = Date.now();
    const diff = targetTime - now;
    let rem = Math.abs(diff);

    const units = [
      ['Days', 86400000],
      ['Hours', 3600000],
      ['Min', 60000],
      ['Sec', 1000]
    ];

    let html = '<div class="cd">';
    if (diff <= 0) {
      html += '<p style="width:100%;margin:0 0 4px;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold)">Since we celebrated</p>';
    }

    for (let i = 0; i < units.length; i++) {
      const label = units[i][0];
      const ms = units[i][1];
      const val = Math.floor(rem / ms);
      rem %= ms;
      html += '<div><b>' + val + '</b><span>' + label + '</span></div>';
    }
    html += '</div>';

    countdownRoot.innerHTML = html;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --- RSVP Configuration & Form Handler ---
  // Paste your Google Apps Script Web App URL here after deploying:
  // e.g., 'https://script.google.com/macros/s/AKfycb.../exec'
  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyG8LFXEmY-64Z0olVcPA9Ei9pnL9DU8irtofBoXWu7gyV-Tf6ZwZTxqyGgBjQgjDUDKA/exec';
  const AUTH_TOKEN = 'matty-christening-2026';
  const PAGE_LOAD_TIME = Date.now();

  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpWrap = document.getElementById('rsvp-wrap');
  const rsvpName = document.getElementById('rsvp-name');
  const rsvpCount = document.getElementById('rsvp-count');
  const rsvpMsg = document.getElementById('rsvp-msg');
  const rsvpErr = document.getElementById('rsvp-err');
  const rsvpBtn = document.getElementById('rsvp-btn');
  const rsvpNote = document.getElementById('rsvp-note');
  const rsvpHp = document.getElementById('rsvp-hp');
  const captchaQuestion = document.getElementById('captcha-question');
  const captchaAns = document.getElementById('captcha-ans');
  const captchaRefresh = document.getElementById('captcha-refresh');

  // --- Dynamic Security Challenge Generator ---
  let captchaSolution = 0;
  function generateCaptcha() {
    const numA = Math.floor(Math.random() * 8) + 2;
    const numB = Math.floor(Math.random() * 7) + 1;
    captchaSolution = numA + numB;
    if (captchaQuestion) {
      captchaQuestion.textContent = numA + ' + ' + numB + ' = ?';
    }
    if (captchaAns) {
      captchaAns.value = '';
    }
  }

  generateCaptcha();

  if (captchaRefresh) {
    captchaRefresh.addEventListener('click', function () {
      generateCaptcha();
    });
  }

  function renderSuccessCard(guestName, guestCount, isAttending) {
    const messageText = isAttending === 'yes'
      ? 'Thank you, ' + guestName + "! We can't wait to celebrate with you and your party of " + guestCount + '.'
      : 'Thank you, ' + guestName + '. You will be missed, and we appreciate your prayers.';

    rsvpWrap.innerHTML =
      '<div class="card" style="max-width:460px;margin:24px auto 0">' +
      '<h3>Thank you!</h3>' +
      '<p style="margin-top:10px;font-size:17px;line-height:1.6">' + messageText + '</p>' +
      '</div>';
  }

  // Display helpful indicator based on configuration
  if (rsvpNote) {
    if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL.trim().length > 0) {
      rsvpNote.textContent = 'Responses are recorded directly for our family.';
    } else {
      rsvpNote.textContent = 'Preview mode — paste your Google Apps Script URL in app.js to record responses.';
    }
  }

  if (rsvpForm && rsvpWrap) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = rsvpName.value.trim();
      const count = Number(rsvpCount.value);
      const attRadio = document.querySelector('input[name="att"]:checked');
      const attending = attRadio ? attRadio.value : 'yes';
      const message = rsvpMsg ? rsvpMsg.value.trim() : '';

      // --- Bot Defense 1: Honeypot check (hidden input that only bots fill) ---
      if (rsvpHp && rsvpHp.value.trim().length > 0) {
        console.warn('Bot detected via honeypot trap.');
        rsvpBtn.disabled = true;
        rsvpBtn.textContent = 'Sending…';
        setTimeout(function () {
          renderSuccessCard(name, count, attending);
        }, 800);
        return;
      }

      // --- Bot Defense 2: Submission Timing Check ---
      const elapsedSeconds = (Date.now() - PAGE_LOAD_TIME) / 1000;
      if (elapsedSeconds < 2.0) {
        console.warn('Bot detected via rapid submission timing (' + elapsedSeconds.toFixed(2) + 's).');
        rsvpBtn.disabled = true;
        rsvpBtn.textContent = 'Sending…';
        setTimeout(function () {
          renderSuccessCard(name, count, attending);
        }, 800);
        return;
      }

      // --- Bot Defense 3: Security Challenge CAPTCHA Validation ---
      const enteredCaptcha = captchaAns ? Number(captchaAns.value.trim()) : NaN;
      if (isNaN(enteredCaptcha) || enteredCaptcha !== captchaSolution) {
        rsvpErr.textContent = 'Incorrect verification answer. Please solve the security check.';
        generateCaptcha();
        if (captchaAns) {
          captchaAns.focus();
        }
        return;
      }

      // --- Input Validation ---
      if (name.length < 2) {
        rsvpErr.textContent = 'Please enter your full name.';
        return;
      }

      // --- Bot Defense 3: Reject web links in name ---
      if (/https?:\/\/|www\./i.test(name)) {
        rsvpErr.textContent = 'Please enter a valid name without web links.';
        return;
      }

      if (!count || count < 1 || count > 10) {
        rsvpErr.textContent = 'Attendees must be between 1 and 10.';
        return;
      }

      // --- Bot Defense 4: Client Rate Limiting (max 4 per session) ---
      try {
        const history = JSON.parse(sessionStorage.getItem('rsvp_attempts') || '[]');
        const now = Date.now();
        const recent = history.filter(function (t) { return now - t < 300000; });
        if (recent.length >= 4) {
          rsvpErr.textContent = 'Too many submissions. Please wait a few minutes before trying again.';
          return;
        }
        recent.push(now);
        sessionStorage.setItem('rsvp_attempts', JSON.stringify(recent));
      } catch (storageErr) {
        // Fallback gracefully if sessionStorage is disabled
      }

      rsvpErr.textContent = '';
      rsvpBtn.disabled = true;
      rsvpBtn.textContent = 'Sending…';

      // Send to Google Sheets if configured
      if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL.trim().length > 0) {
        const payload = {
          token: AUTH_TOKEN,
          name: name,
          attendees: count,
          attending: attending,
          message: message,
          submittedAt: new Date().toISOString()
        };

        try {
          fetch(GOOGLE_SHEET_URL.trim(), {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
          }).catch(function (fetchErr) {
            console.warn('Google Sheet fetch error:', fetchErr);
          });
        } catch (postErr) {
          console.warn('Failed to dispatch RSVP to Google Sheet:', postErr);
        }
      } else {
        console.info('RSVP submitted in preview mode (no Google Sheet URL configured):', {
          name: name,
          attendees: count,
          attending: attending,
          message: message
        });
      }

      setTimeout(function () {
        renderSuccessCard(name, count, attending);
      }, 900);
    });
  }

  // --- Scroll Fade In (IntersectionObserver) ---
  const fadeElements = document.querySelectorAll('.fade');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        }
      });
    }, { threshold: 0.15 });

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeElements.forEach(function (el) {
      el.classList.add('in');
    });
  }
})();

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

  // --- RSVP Form Handler ---
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpWrap = document.getElementById('rsvp-wrap');
  const rsvpName = document.getElementById('rsvp-name');
  const rsvpCount = document.getElementById('rsvp-count');
  const rsvpErr = document.getElementById('rsvp-err');
  const rsvpBtn = document.getElementById('rsvp-btn');

  if (rsvpForm && rsvpWrap) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = rsvpName.value.trim();
      const count = Number(rsvpCount.value);
      const attRadio = document.querySelector('input[name="att"]:checked');
      const attending = attRadio ? attRadio.value : 'yes';

      if (name.length < 2) {
        rsvpErr.textContent = 'Please enter your full name.';
        return;
      }

      if (!count || count < 1 || count > 10) {
        rsvpErr.textContent = 'Attendees must be between 1 and 10.';
        return;
      }

      rsvpErr.textContent = '';
      rsvpBtn.disabled = true;
      rsvpBtn.textContent = 'Sending…';

      setTimeout(function () {
        const messageText = attending === 'yes'
          ? 'Thank you, ' + name + "! We can't wait to celebrate with you and your party of " + count + '.'
          : 'Thank you, ' + name + '. You will be missed, and we appreciate your prayers.';

        rsvpWrap.innerHTML =
          '<div class="card" style="max-width:460px;margin:24px auto 0">' +
          '<h3>Thank you!</h3>' +
          '<p style="margin-top:10px;font-size:17px;line-height:1.6">' + messageText + '</p>' +
          '</div>';
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

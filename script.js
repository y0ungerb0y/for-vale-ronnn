/* ====== 🔒 НАСТРОЙКИ ЗАМКА ====== */
const SECRET = {
  question: "Как я называю тебя, когда мы одни?",
  // Правильные ответы (регистр/ё/пробелы не важны)
  answers: ["солнышко", "моё солнышко", "кися", "киса", "принцесска", "принцесса"],
  hint: "Подсказка: я называю тебя так всегда ☀️",
  storageKey: "love_site_unlocked_v1"
};

/* ====== 🎯 НАСТРОЙКИ ФИНАЛА ====== */
const FINAL = {
  question: "Ты меня любишь?",
  finalMessage: "Я знал 💖 Ты — моё всё.",
  noTexts: [
    "Нет",
    "Точно нет?",
    "Подумай ещё",
    "Уверена?",
    "Не-а 😏",
    "Ни за что",
    "Даже не думай",
    "Последний шанс",
    "Ну ЛЕЕЕРАА",
    "Кнопка сломалась"
  ],
  fleeRadius: 120,
  jumpStrength: 220
};

/* ====== ЭЛЕМЕНТЫ ====== */
const lockScreen   = document.getElementById('screen-lock');
const lockForm     = document.getElementById('lock-form');
const secretInput  = document.getElementById('secret-input');
const errorText    = document.getElementById('error-text');
const heartsContainer = document.getElementById('hearts');

const btnYes       = document.getElementById('btn-yes');
const btnNo        = document.getElementById('btn-no');
const actions      = document.getElementById('actions');
const finalBlock   = document.getElementById('final');
const finalMessage = document.getElementById('final-message');

const musicBtn     = document.getElementById('music-toggle');
const music        = document.getElementById('bg-music');

/* ====== СОСТОЯНИЕ ====== */
let attempts = 0;
let currentScreen = 1;
const totalScreens = 7;

/* ====== 🔒 ЛОГИКА ЗАМКА ====== */

function normalize(str) {
  return str.toLowerCase().trim().replace(/ё/g, 'е').replace(/\s+/g, ' ');
}

function initLock() {
  document.getElementById('secret-question').textContent = SECRET.question;
  const hintEl = document.getElementById('hint-text');
  if (SECRET.hint) hintEl.textContent = SECRET.hint;
  else hintEl.style.display = 'none';

  lockForm.addEventListener('submit', handleUnlock);

  // Уже разблокировано? Сразу на "до нас", замок не показываем вообще
  if (localStorage.getItem(SECRET.storageKey) === 'true') {
    showBeforeScreen();
    return;
  }

  // Иначе — плавно показываем замок
  lockScreen.classList.add('active');
}

function handleUnlock(e) {
  e.preventDefault();
  const value = normalize(secretInput.value);
  const ok = SECRET.answers.some(a => normalize(a) === value);

  if (!ok) {
    attempts++;
    secretInput.value = '';
    lockForm.classList.remove('shake');
    void lockForm.offsetWidth;
    lockForm.classList.add('shake');
    errorText.textContent = attempts >= 3
      ? "Это только для моей любимой 💕 Попробуй ещё разок."
      : "Не совсем... попробуй ещё 💭";
    return;
  }

  localStorage.setItem(SECRET.storageKey, 'true');
    showBeforeScreen();
}

function showBeforeScreen() {
  lockScreen.classList.remove('active');
  document.getElementById('screen-before').classList.add('active');

  showHugButton();
  showKissButton();
  showMessageButton();
  showCertButton();
  showRestartButton();
  showPet();

  startBeforeScreen();
}


/* ====== НАВИГАЦИЯ ====== */

function nextScreen() {
  if (currentScreen >= totalScreens) return;

  const currentEl = document.getElementById(getScreenId(currentScreen));
  if (currentEl) currentEl.classList.remove('active');

  currentScreen++;

  const nextEl = document.getElementById(getScreenId(currentScreen));
  if (nextEl) nextEl.classList.add('active');

  if (currentScreen === 2 && typeof drawConstellation === 'function') {
    setTimeout(drawConstellation, 700);
  }
  if (currentScreen === 4 && typeof initBossBattle === 'function') {
    setTimeout(initBossBattle, 400);
  }
  if (currentScreen === 5 && typeof initMaze === 'function') {
    setTimeout(initMaze, 300);
  }
  if (currentScreen === 6 && typeof initDateScreen === 'function') {
    setTimeout(initDateScreen, 300);
  }
}

function getScreenId(n) {
  if (n === 1) return 'screen-1';
  if (n === 2) return 'screen-2';
  if (n === 3) return 'screen-star-map';
  if (n === 4) return 'screen-boss';
  if (n === 5) return 'screen-maze';
  if (n === 6) return 'screen-date';
  if (n === 7) return 'screen-3';
  return 'screen-' + n;
}
function drawConstellation() {
  const lines = document.querySelectorAll('.cline');
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add('drawn'), i * 500);
  });
}
/* ====== ПЕЧАТАЮЩИЙСЯ ТЕКСТ ====== */

let typewriterStarted = false;
function typeWriter(el, text, speed = 60, onDone = null) {
  el.textContent = '';
  let i = 0;
  function tick() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(tick, speed);
    } else if (typeof onDone === 'function') {
      onDone();
    }
  }
  tick();
}

function startExperience() {
  if (typewriterStarted) return;
  typewriterStarted = true;
  typeWriter(
    document.getElementById('typewriter-1'),
    'У меня для тебя кое-что есть...',
    60
  );
}

/* ====== ⏱️ СЧЁТЧИК В РЕАЛЬНОМ ВРЕМЕНИ ====== */

// Дата вашего начала — поменяй
const startDate = new Date('2026-09-18T00:00:00');

function plural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

function updateCounter() {
  const now = Date.now();
  let diff = Math.max(0, now - startDate.getTime());

  const SEC = 1000;
  const MIN = 60 * SEC;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;

  // Приблизительно считаем годы и месяцы, потом уточняем
  let years = 0;
  let months = 0;

  // Считаем полные годы
  const tmpYears = new Date(startDate);
  while (true) {
    const next = new Date(tmpYears);
    next.setFullYear(next.getFullYear() + 1);
    if (next.getTime() <= now) {
      tmpYears.setFullYear(tmpYears.getFullYear() + 1);
      years++;
    } else break;
  }

  // Считаем полные месяцы от последнего «дня рождения отношений»
  while (true) {
    const next = new Date(tmpYears);
    next.setMonth(next.getMonth() + 1);
    if (next.getTime() <= now) {
      tmpYears.setMonth(tmpYears.getMonth() + 1);
      months++;
    } else break;
  }

  // Остаток считаем от tmpYears
  const remainder = now - tmpYears.getTime();
  const days    = Math.floor(remainder / DAY);
  const hours   = Math.floor((remainder % DAY) / HOUR);
  const minutes = Math.floor((remainder % HOUR) / MIN);
  const seconds = Math.floor((remainder % MIN) / SEC);

  const parts = [];
  if (years > 0)   parts.push(`${years} ${plural(years, 'год', 'года', 'лет')}`);
  if (months > 0)  parts.push(`${months} ${plural(months, 'месяц', 'месяца', 'месяцев')}`);
  parts.push(`${days} ${plural(days, 'день', 'дня', 'дней')}`);
  parts.push(`${hours} ${plural(hours, 'час', 'часа', 'часов')}`);
  parts.push(`${minutes} ${plural(minutes, 'минута', 'минуты', 'минут')}`);
  parts.push(`${seconds} ${plural(seconds, 'секунда', 'секунды', 'секунд')}`);

  const el = document.getElementById('days-counter');
  if (el) el.textContent = 'Мы вместе уже ' + parts.join(', ') + ' 💕';
}

let counterInterval = null;
function startCounter() {
  updateCounter();
  if (counterInterval) clearInterval(counterInterval);
  counterInterval = setInterval(updateCounter, 1000);
}

/* ====== ПАДАЮЩИЕ СЕРДЕЧКИ ====== */

const heartEmojis = ['❤️', '💕', '💖', '💗', '🌸'];

function spawnHeart() {
  const h = document.createElement('div');
  h.classList.add('heart');
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = Math.random() * 100 + 'vw';
  h.style.animationDuration = (5 + Math.random() * 5) + 's';
  h.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
  heartsContainer.appendChild(h);
  setTimeout(() => h.remove(), 10000);
}

/* ====== САЛЮТ ====== */

function burstHearts(x, y, count = 30) {
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.classList.add('burst');
    b.textContent = ['💖','💕','❤️','✨'][Math.floor(Math.random() * 4)];
    b.style.left = x + 'px';
    b.style.top = y + 'px';
    b.style.setProperty('--x', (Math.random() - 0.5) * 700 + 'px');
    b.style.setProperty('--y', (Math.random() - 0.5) * 700 + 'px');
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1500);
  }
}

function fireworks() {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      burstHearts(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight * 0.7,
        25
      );
    }, i * 300);
  }
}

/* ====== 🏃 УБЕГАЮЩАЯ КНОПКА «НЕТ» ====== */

let noIndex = 0;
let floating = false;
let broken = false;

// Убегает только при клике. Когда текст доходит до последнего — «ломается».

function jumpToRandom() {
  const margin = 30;
  const w = btnNo.offsetWidth;
  const h = btnNo.offsetHeight;
  const maxX = window.innerWidth - w - margin;
  const maxY = window.innerHeight - h - margin;
  const newX = margin + Math.random() * Math.max(1, maxX - margin);
  const newY = margin + Math.random() * Math.max(1, maxY - margin);
  btnNo.style.left = newX + 'px';
  btnNo.style.top = newY + 'px';
}

btnNo.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();

  // Если уже сломана — вообще ничего не делаем
  if (broken) return;

  // 1) Меняем текст при каждом клике
  if (noIndex < FINAL.noTexts.length - 1) {
    noIndex++;
    btnNo.textContent = FINAL.noTexts[noIndex];
  }

  // 2) Тряска экрана
  document.body.classList.remove('shake');
  void document.body.offsetWidth;
  document.body.classList.add('shake');

  // 3) Если ещё не «оторвалась» — фиксируем её на месте
  if (!floating) {
    const rect = btnNo.getBoundingClientRect();
    btnNo.style.position = 'fixed';
    btnNo.style.left = rect.left + 'px';
    btnNo.style.top = rect.top + 'px';
    btnNo.style.margin = '0';
    btnNo.style.zIndex = '999';
    btnNo.style.transition = 'left 0.35s ease, top 0.35s ease';
    floating = true;
    void btnNo.offsetWidth;
  }

  // 4) Дошли до последнего текста — ломаем кнопку
  if (noIndex >= FINAL.noTexts.length - 1) {
  broken = true;

  // маленький «удар» перед поломкой
  btnNo.style.transition = 'transform 0.12s ease';
  btnNo.style.transform = 'rotate(2deg) scale(1.05)';

  setTimeout(() => {
    btnNo.style.transform = '';
    btnNo.classList.add('broken');

    // добавляем «осколок» внутрь кнопки
    const shard = document.createElement('span');
    shard.className = 'shard';
    btnNo.appendChild(shard);
  }, 130);

  return;
}

  // 5) Иначе — прыгаем в случайную точку
  jumpToRandom();
});

/* ====== ПОБЕДА ====== */

btnYes.addEventListener('click', () => {
  actions.style.display = 'none';
  document.getElementById('final-question').style.display = 'none';
  document.getElementById('days-counter').style.display = 'none';
  finalBlock.hidden = false;

  fireworks();
  setTimeout(fireworks, 1500);
  setTimeout(fireworks, 3000);

  // Письмо
  const letterText = document.getElementById('love-letter');
  const letterSign = document.getElementById('love-sign');

  const LETTER = `Лерочка,

я долго думал, как сказать это словами,
и понял — словами не получится.
Поэтому я сделал этот сайт.
Каждая строчка кода здесь написана
с мыслью о тебе.

Спасибо, что ты рядом.
Спасибо за твою улыбку,
за то, что ты — это ты,
я уверен что со временем
мы преодолеем трудности
и будем уверены в том
что мы созданы только
друг для друга.

Я люблю тебя.
Больше, чем можно уместить в пиксели.`;

  const SIGNATURE = '— навсегда твой Никиточка❤️';

  setTimeout(() => {
    if (!letterText) return;
    typeWriter(letterText, LETTER, 40, () => {
      letterText.classList.add('done');
      // Подпись появляется с задержкой
      setTimeout(() => {
        if (letterSign) {
          letterSign.textContent = SIGNATURE;
          letterSign.classList.add('show');
        }
      }, 400);
    });
  }, 1000);
});

/* ====== МУЗЫКА ====== */

function setupMusic() {
  music.volume = 0.4;

  musicBtn.addEventListener('click', () => {
    if (music.paused) {
      music.play().catch(() => {});
      musicBtn.classList.add('playing');
      musicBtn.textContent = '🎶';
    } else {
      music.pause();
      musicBtn.classList.remove('playing');
      musicBtn.textContent = '🎵';
    }
  });

  // Пробуем автозапуск после первого клика по сайту
  
  const tryAutoplay = () => {
    music.play().then(() => {
      musicBtn.classList.add('playing');
      musicBtn.textContent = '🎶';
    }).catch(() => {});
    document.removeEventListener('click', tryAutoplay);
  };
  document.addEventListener('click', tryAutoplay, { once: true });
}

/* ====== ПАРАЛЛАКС НА ФОТО ====== */

function setupParallax() {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    document.querySelectorAll('.parallax').forEach((img, i) => {
      const k = (i + 1) * 0.6;
      img.style.transform = `translate(${x * k}px, ${y * k}px)`;
    });
  });
}
/* ====== 🖱️ ШЛЕЙФ СЕРДЕЧЕК ЗА КУРСОРОМ ====== */

let lastTrail = 0;
const trailEmojis = ['💕', '❤️', '💖', '✨', '🌸'];

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastTrail < 60) return;   // не чаще 16 раз в секунду
  lastTrail = now;

  const h = document.createElement('div');
  h.className = 'trail-heart';
  h.textContent = trailEmojis[Math.floor(Math.random() * trailEmojis.length)];
  h.style.left = e.clientX + 'px';
  h.style.top = e.clientY + 'px';
  h.style.fontSize = (10 + Math.random() * 10) + 'px';
  document.body.appendChild(h);

  requestAnimationFrame(() => h.classList.add('fade'));
  setTimeout(() => h.remove(), 1000);
});

/* ====== 🎁 ПАСХАЛКА ====== */

const SECRET_WORD = 'лера';   // ← поменяй на нужное слово
let typedBuffer = '';
const toast = document.createElement('div');
toast.id = 'secret-toast';
document.body.appendChild(toast);

document.addEventListener('keydown', (e) => {
  if (e.key.length !== 1) return;
  typedBuffer = (typedBuffer + e.key.toLowerCase()).slice(-SECRET_WORD.length);

  if (typedBuffer === SECRET_WORD) {
    typedBuffer = '';
    triggerSecret();
  }
});

function triggerSecret() {
  toast.textContent = '💖 Ты нашла секрет! Я люблю тебя ещё сильнее 💖';
  toast.classList.add('show');

  // Мощный салют
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      burstHearts(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight * 0.8,
        40
      );
    }, i * 200);
  }

  setTimeout(() => toast.classList.remove('show'), 4500);
}
/* ====== 🐱 ЭКРАН «ДО НАС» ====== */

let beforeStarted = false;

function startBeforeScreen() {
  if (beforeStarted) return;
  beforeStarted = true;

  const el = document.getElementById('before-text');

  // Пауза перед началом — чтобы зритель успел "войти" в экран
  setTimeout(() => {
    const texts = [
      'Я жил обычной жизнью...',
      'День за днём. Ничего особенного.',
      'И не знал, что чего-то не хватает.'
    ];

    let idx = 0;
    function nextLine() {
      if (idx >= texts.length) {
        document.getElementById('btn-before-next').style.display = 'inline-block';
        return;
      }
      el.textContent = '';
      typeWriter(el, texts[idx], 50, () => {
        idx++;
        setTimeout(nextLine, 1200);
      });
    }
    nextLine();
  }, 500);
}

function showAfter() {
  document.getElementById('screen-before').classList.remove('active');
  document.getElementById('screen-after').classList.add('active');
}

function goToScreen1() {
  document.getElementById('screen-after').classList.remove('active');
  document.getElementById('screen-1').classList.add('active');
  currentScreen = 1;
  startExperience();
}

/* ====== 🤗 КНОПКА «ОБНЯТЬ» ====== */

function setupHugButton() {
  const btn = document.getElementById('hug-btn');
  const overlay = document.getElementById('hug-overlay');
  if (!btn || !overlay) return;

  // Кнопка появляется после разблокировки
  // (вызываем showHugButton() из unlockSite)
  let hugging = false;

  btn.addEventListener('click', () => {
    if (hugging) return;
    hugging = true;
    doHug();
  });

  function doHug() {
    // 1) Показать оверлей с сообщением
    overlay.classList.add('show');

    // 2) Запустить сердечки, летящие к центру
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const emojis = ['💕', '❤️', '💖', '🤗', '💗'];

    for (let i = 0; i < 25; i++) {
      const h = document.createElement('div');
      h.className = 'hug-heart';
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      // Стартовая точка — по краям экрана
      const angle = (i / 25) * Math.PI * 2 + Math.random() * 0.5;
      const radius = Math.max(window.innerWidth, window.innerHeight) * 0.7;
      const startX = cx + Math.cos(angle) * radius;
      const startY = cy + Math.sin(angle) * radius;

      h.style.left = startX + 'px';
      h.style.top = startY + 'px';

      // Куда лететь (к центру + чуть-чуть случайности)
      const dx = (cx - startX) + (Math.random() - 0.5) * 80;
      const dy = (cy - startY) + (Math.random() - 0.5) * 80;
      h.style.setProperty('--dx', dx + 'px');
      h.style.setProperty('--dy', dy + 'px');

      document.body.appendChild(h);

      // Запускаем анимацию в следующем кадре
      requestAnimationFrame(() => {
        setTimeout(() => h.classList.add('gather'), i * 25);
      });

      setTimeout(() => h.remove(), 2200);
    }

    // 3) Плавно убираем оверлей через 2.5 секунды
    setTimeout(() => {
      overlay.classList.remove('show');
      setTimeout(() => {
        hugging = false;
      }, 600);
    }, 2500);
  }
}

// Показать кнопку после разблокировки
function showHugButton() {
  const btn = document.getElementById('hug-btn');
  if (btn) btn.classList.add('show');
}

/* ====== 💗 ПРЕЛОАДЕР ====== */

let preloaderCallback = null;

function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) {
    if (typeof preloaderCallback === 'function') preloaderCallback();
    return;
  }
  preloader.classList.add('hide');
  // Когда прелоадер растворился — запускаем игру
  setTimeout(() => {
    preloader.remove();
    if (typeof preloaderCallback === 'function') preloaderCallback();
  }, 800);
}

function initPreloader(onDone) {
  preloaderCallback = onDone;

  const images = Array.from(document.images);
  let loaded = 0;
  const total = images.length;
  const MIN_TIME = 1500;
  const startTime = Date.now();

  function tryHide() {
    const elapsed = Date.now() - startTime;
    const wait = Math.max(0, MIN_TIME - elapsed);
    setTimeout(hidePreloader, wait);
  }

  if (total === 0) {
    window.addEventListener('load', tryHide);
    return;
  }

  images.forEach(img => {
    if (img.complete) loaded++;
    else {
      img.addEventListener('load', onOne);
      img.addEventListener('error', onOne);
    }
  });

  function onOne() {
    loaded++;
    if (loaded >= total) tryHide();
  }

  setTimeout(tryHide, 5000);   // страховка
}
/* ====== 💌 ПОСЛАНИЕ ОТ НЕЁ ====== */

// 👇 ВСТАВЬ СВОИ ДАННЫЕ ИЗ ШАГОВ 1-2
const TELEGRAM = {
  botToken: '8711158658:AAEXmNZQOx5ZeVZZCEpgP7fPaSv9TcvTtIY',
  chatId: '836872425'
};

function setupMessage() {
  const btn = document.getElementById('message-btn');
  const overlay = document.getElementById('message-overlay');
  const close = document.getElementById('message-close');
  const send = document.getElementById('message-send');
  const input = document.getElementById('message-input');
  const status = document.getElementById('message-status');
  if (!btn || !overlay) return;

  btn.addEventListener('click', () => {
    overlay.classList.add('show');
    status.textContent = '';
    status.className = 'message-status';
    setTimeout(() => input.focus(), 350);
  });

  close.addEventListener('click', () => overlay.classList.remove('show'));

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('show');
  });

  send.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) {
      status.textContent = 'Напиши что-нибудь 💭';
      status.className = 'message-status error';
      return;
    }

    send.disabled = true;
    send.textContent = 'Отправляю...';
    status.textContent = '';

    try {
      const url = `https://api.telegram.org/bot${TELEGRAM.botToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM.chatId,
          text: `💌 Послание от любимой:\n\n${text}`,
          parse_mode: 'HTML'
        })
      });

      if (!res.ok) throw new Error('send failed');

      status.textContent = 'Отправлено 💖 Спасибо, любимая!';
      status.className = 'message-status success';
      input.value = '';
      send.textContent = 'Отправлено 💖';

      setTimeout(() => {
        overlay.classList.remove('show');
        setTimeout(() => {
          send.disabled = false;
          send.textContent = 'Отправить';
          status.textContent = '';
          status.className = 'message-status';
        }, 400);
      }, 1800);

    } catch (err) {
      status.textContent = 'Не получилось отправить 😔 Попробуй ещё раз';
      status.className = 'message-status error';
      send.disabled = false;
      send.textContent = 'Отправить';
    }
  });
}

// Показ кнопки — вызываем там же, где showHugButton/showWheelButton
function showMessageButton() {
  const btn = document.getElementById('message-btn');
  if (btn) btn.classList.add('show');
}
/* ====== 🏆 СЕРТИФИКАТ «ЛУЧШЕЙ ДЕВУШКЕ» ====== */

// 👇 Настрой под себя
const CERT = {
  name: 'Лерочка',                                     // её имя
  subtitle: 'Лучшей девушке в мире',
  body: 'Настоящим подтверждается, что ты — самая\nлюбимая, самая красивая и самая родная.\nЗа твою улыбку, тепло и бесконечное терпение.',
  sign: 'с любовью от Никиточки',
  date: new Date().toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
};

let certDrawn = false;

function drawCertificate() {
  const canvas = document.getElementById('cert-canvas');
  if (!canvas) return;

  const W = 1200, H = 850;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1) Фон — пергамент
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#fdf6e3');
  bg.addColorStop(1, '#f5e6c8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Лёгкая текстура — пятна
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = 20 + Math.random() * 80;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(200, 160, 100, 0.06)');
    g.addColorStop(1, 'rgba(200, 160, 100, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // 2) Внешняя золотая рамка
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, W - 60, H - 60);

  // Внутренняя тонкая рамка
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.strokeRect(55, 55, W - 110, H - 110);

  // 3) Декоративные уголки
  drawCorner(ctx, 55, 55, 1, 1);
  drawCorner(ctx, W - 55, 55, -1, 1);
  drawCorner(ctx, 55, H - 55, 1, -1);
  drawCorner(ctx, W - 55, H - 55, -1, -1);

  // 4) Заголовок
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7a2b3a';
  ctx.font = '400 90px "Great Vibes", cursive';
  ctx.fillText('Сертификат', W / 2, 210);

  ctx.fillStyle = '#b8860b';
  ctx.font = '600 26px "Cormorant Garamond", serif';
  ctx.fillText('· · ·  ОФИЦИАЛЬНО ПОДТВЕРЖДАЕТСЯ  · · ·', W / 2, 260);

  // 5) Подзаголовок «лучшей девушке»
  ctx.fillStyle = '#3d2a35';
  ctx.font = 'italic 300 38px "Cormorant Garamond", serif';
  ctx.fillText(CERT.subtitle, W / 2, 330);

  // 6) Имя
  ctx.fillStyle = '#7a2b3a';
  ctx.font = '400 110px "Great Vibes", cursive';
  ctx.fillText(CERT.name, W / 2, 460);

  // Подчёркивание под именем
  const nameWidth = ctx.measureText(CERT.name).width;
  ctx.beginPath();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.moveTo(W / 2 - nameWidth / 2 - 40, 480);
  ctx.lineTo(W / 2 + nameWidth / 2 + 40, 480);
  ctx.stroke();

  // 7) Основной текст
  ctx.fillStyle = '#3d2a35';
  ctx.font = '300 24px "Cormorant Garamond", serif';
  const lines = CERT.body.split('\n');
  lines.forEach((line, i) => {
    ctx.fillText(line, W / 2, 550 + i * 36);
  });

  // 8) Дата слева внизу
  ctx.textAlign = 'left';
  ctx.fillStyle = '#3d2a35';
  ctx.font = '300 22px "Cormorant Garamond", serif';
  ctx.fillText('Дата: ' + CERT.date, 110, H - 130);

  // 9) Подпись справа внизу
  ctx.textAlign = 'right';
  ctx.fillStyle = '#7a2b3a';
  ctx.font = '400 42px "Great Vibes", cursive';
  ctx.fillText(CERT.sign, W - 110, H - 130);

  // Линия под подписью
  ctx.beginPath();
  ctx.strokeStyle = '#3d2a35';
  ctx.lineWidth = 1;
  ctx.moveTo(W - 400, H - 115);
  ctx.lineTo(W - 110, H - 115);
  ctx.stroke();

  // 10) Золотая печать-сердце в правом нижнем углу
  const sealX = W / 2;
  const sealY = H - 160;
  drawSeal(ctx, sealX, sealY, 60);

  certDrawn = true;
}

function drawCorner(ctx, x, y, dirX, dirY) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dirX, dirY);

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(50, 0);
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 50);

  // Декоративный ромбик
  ctx.beginPath();
  ctx.moveTo(15, 15);
  ctx.lineTo(25, 5);
  ctx.lineTo(35, 15);
  ctx.lineTo(25, 25);
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}

function drawSeal(ctx, x, y, r) {
  // Красный кружок
  ctx.beginPath();
  ctx.fillStyle = '#b8860b';
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Внутренний круг
  ctx.beginPath();
  ctx.strokeStyle = '#7a2b3a';
  ctx.lineWidth = 2;
  ctx.arc(x, y, r - 8, 0, Math.PI * 2);
  ctx.stroke();

  // Сердце внутри
  ctx.fillStyle = '#7a2b3a';
  ctx.beginPath();
  const s = r * 0.5;
  ctx.moveTo(x, y + s * 0.6);
  ctx.bezierCurveTo(x - s, y - s * 0.2, x - s * 0.5, y - s, x, y - s * 0.3);
  ctx.bezierCurveTo(x + s * 0.5, y - s, x + s, y - s * 0.2, x, y + s * 0.6);
  ctx.fill();
}

function setupCert() {
  const btn = document.getElementById('cert-btn');
  const overlay = document.getElementById('cert-overlay');
  const close = document.getElementById('cert-close');
  const download = document.getElementById('cert-download');
  if (!btn || !overlay) return;

  btn.addEventListener('click', async () => {
    overlay.classList.add('show');

    // Ждём загрузки шрифтов, потом рисуем
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    if (!certDrawn) drawCertificate();
  });

  close.addEventListener('click', () => overlay.classList.remove('show'));

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('show');
  });

  download.addEventListener('click', () => {
    const canvas = document.getElementById('cert-canvas');
    if (!canvas) return;

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Сертификат_${CERT.name}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  });
}

function showCertButton() {
  const btn = document.getElementById('cert-btn');
  if (btn) btn.classList.add('show');
}

/* ====== 🐱 ВИРТУАЛЬНЫЙ ПИТОМЕЦ ====== */

const PET = {
  name: 'Мурзик',
  storageKey: 'love_pet_state_v1',
  achievementsKey: 'love_pet_achievements_v1',
  hungerPerMin: 0.8,
  happyPerMin: 0.5
};

let petState = {
  hunger: 100,
  happy: 100,
  lastTick: Date.now(),
  feeds: 0,
  pets: 0,
  plays: 0
};

let petAchievements = {};

const ACHIEVEMENTS = [
  { id: 'first_feed', icon: '🍖', text: 'Первый раз покормила!' },
  { id: 'first_pet',  icon: '💕', text: 'Впервые погладила!' },
  { id: 'first_play', icon: '🎾', text: 'Первая игра!' },
  { id: 'feed_10',    icon: '🥇', text: 'Покормила 10 раз!' },
  { id: 'pet_20',     icon: '💖', text: 'Погладила 20 раз!' },
  { id: 'play_10',    icon: '🏆', text: 'Сыграла 10 партий!' },
  { id: 'all_happy',  icon: '😻', text: 'Котик абсолютно счастлив!' }
];

/* ====== Сохранение / загрузка ====== */

function loadPet() {
  try {
    const raw = localStorage.getItem(PET.storageKey);
    if (raw) petState = Object.assign(petState, JSON.parse(raw));
    const rawAch = localStorage.getItem(PET.achievementsKey);
    if (rawAch) petAchievements = JSON.parse(rawAch);
  } catch (e) { /* ignore */ }
}

function savePet() {
  petState.lastTick = Date.now();
  try {
    localStorage.setItem(PET.storageKey, JSON.stringify(petState));
    localStorage.setItem(PET.achievementsKey, JSON.stringify(petAchievements));
  } catch (e) { /* ignore */ }
}

function applyPetDecay() {
  const now = Date.now();
  const minutes = (now - petState.lastTick) / 60000;
  petState.hunger = Math.max(0, petState.hunger - minutes * PET.hungerPerMin);
  petState.happy = Math.max(0, petState.happy - minutes * PET.happyPerMin);
  petState.lastTick = now;
}

/* ====== Отрисовка ====== */

function renderPet() {
  const hungerFill = document.getElementById('pet-hunger-fill');
  const happyFill  = document.getElementById('pet-happy-fill');
  const body       = document.getElementById('pet-body');
  const mood       = document.getElementById('pet-mood');
  const toggle     = document.getElementById('pet-toggle');
  if (!hungerFill || !happyFill || !body || !mood) return;

  hungerFill.style.width = petState.hunger + '%';
  happyFill.style.width  = petState.happy + '%';

  let emoji = '🐱', moodText = 'Мур-мур 💕', toggleEmoji = '🐱';

  if (petState.hunger < 25) {
    emoji = '😿'; moodText = 'Я голодный...'; toggleEmoji = '😿';
  } else if (petState.happy < 25) {
    emoji = '🙀'; moodText = 'Мне скучно, поиграй со мной'; toggleEmoji = '🙀';
  } else if (petState.hunger > 80 && petState.happy > 80) {
    emoji = '😻'; moodText = 'Я самый счастливый котик на свете!'; toggleEmoji = '😻';
  } else if (petState.hunger > 50 && petState.happy > 50) {
    emoji = '😺'; moodText = 'Мур-мур, всё хорошо 💕'; toggleEmoji = '😺';
  } else {
    emoji = '🐱'; moodText = 'Мяу?..'; toggleEmoji = '🐱';
  }

  body.textContent = emoji;
  mood.textContent = moodText;
  if (toggle) toggle.textContent = toggleEmoji;
}

/* ====== Реакции (летящие эмодзи) ====== */

function petReaction(emoji) {
  const body = document.getElementById('pet-body');
  if (!body) return;

  body.style.transform = 'scale(1.3)';
  setTimeout(() => { body.style.transform = ''; }, 200);

  const rect = body.getBoundingClientRect();
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div');
    el.className = 'pet-float';
    el.textContent = emoji;
    el.style.left = (rect.left + rect.width / 2) + 'px';
    el.style.top  = (rect.top + rect.height / 2) + 'px';
    el.style.setProperty('--dx', ((Math.random() - 0.5) * 120) + 'px');
    el.style.setProperty('--dy', (-60 - Math.random() * 80) + 'px');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}

/* ====== 🎵 Звук мурчания (Web Audio API, без файла) ====== */

function playPurr() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.value = 45;   // низкое мурчание

    filter.type = 'lowpass';
    filter.frequency.value = 220;

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.15);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.6);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1.0);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.4);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.0);

    // Лёгкая вибрация громкости — имитация мурчания
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 25;
    lfoGain.gain.value = 0.03;
    lfo.connect(lfoGain).connect(gain.gain);

    osc.connect(filter).connect(gain).connect(ctx.destination);

    osc.start();
    lfo.start();
    osc.stop(ctx.currentTime + 2.1);
    lfo.stop(ctx.currentTime + 2.1);
  } catch (e) { /* тихо игнорируем */ }
}

/* ====== 🏆 Ачивки ====== */

function showAchievement(id) {
  if (petAchievements[id]) return;
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return;

  petAchievements[id] = true;
  savePet();

  const container = document.getElementById('pet-achievements');
  if (!container) return;

  const el = document.createElement('div');
  el.className = 'pet-achievement';
  el.innerHTML = `<span class="ach-icon">${ach.icon}</span><span class="ach-text">${ach.text}</span>`;
  container.appendChild(el);

  requestAnimationFrame(() => el.classList.add('show'));

  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 500);
  }, 3500);
}

function checkAchievements() {
  if (petState.feeds >= 1) showAchievement('first_feed');
  if (petState.pets  >= 1) showAchievement('first_pet');
  if (petState.plays >= 1) showAchievement('first_play');
  if (petState.feeds >= 10) showAchievement('feed_10');
  if (petState.pets  >= 20) showAchievement('pet_20');
  if (petState.plays >= 10) showAchievement('play_10');
  if (petState.hunger > 90 && petState.happy > 90) showAchievement('all_happy');
}

/* ====== Действия ====== */

function feedPet() {
  petState.hunger = Math.min(100, petState.hunger + 30);
  petState.happy  = Math.min(100, petState.happy + 5);
  petState.feeds  = (petState.feeds || 0) + 1;
  savePet();
  renderPet();
  petReaction('🍖');
  checkAchievements();
}

function petTheCat() {
  petState.happy = Math.min(100, petState.happy + 20);
  petState.pets  = (petState.pets || 0) + 1;
  savePet();
  renderPet();
  petReaction('💕');
  playPurr();          // 🔊 мурчание
  checkAchievements();
}

function playWithCat() {
  const body = document.getElementById('pet-body');
  if (!body) return;

  petState.happy  = Math.min(100, petState.happy + 25);
  petState.hunger = Math.max(0, petState.hunger - 5);   // игра = тратит энергию
  petState.plays  = (petState.plays || 0) + 1;
  savePet();
  renderPet();

  // Летит мячик
  const rect = body.getBoundingClientRect();
  const ball = document.createElement('div');
  ball.className = 'pet-ball';
  ball.textContent = '🎾';
  ball.style.left = (rect.left + rect.width / 2) + 'px';
  ball.style.top  = (rect.top + rect.height / 2) + 'px';
  ball.style.setProperty('--bx', ((Math.random() - 0.5) * 200) + 'px');
  ball.style.setProperty('--by', (-80 - Math.random() * 60) + 'px');
  ball.style.setProperty('--ex', ((Math.random() - 0.5) * 260) + 'px');
  ball.style.setProperty('--ey', (60 + Math.random() * 40) + 'px');
  document.body.appendChild(ball);
  setTimeout(() => ball.remove(), 1100);

  setTimeout(() => petReaction('✨'), 200);
  checkAchievements();
}

/* ====== Инициализация ====== */

function setupPet() {
  const widget  = document.getElementById('pet-widget');
  const toggle  = document.getElementById('pet-toggle');
  const panel   = document.getElementById('pet-panel');
  const closeBtn = document.getElementById('pet-panel-close');
  const feed    = document.getElementById('pet-feed');
  const petBtn  = document.getElementById('pet-pet');
  const playBtn = document.getElementById('pet-play');
  const body    = document.getElementById('pet-body');
  if (!widget || !toggle || !panel) return;

  const nameEl = document.getElementById('pet-name');
  if (nameEl) nameEl.textContent = PET.name;

  loadPet();
  applyPetDecay();
  renderPet();

  setInterval(() => {
    applyPetDecay();
    renderPet();
    savePet();
  }, 30000);

  toggle.addEventListener('click', () => {
    panel.classList.toggle('show');
    applyPetDecay();
    renderPet();
  });

  closeBtn.addEventListener('click', () => panel.classList.remove('show'));

  feed.addEventListener('click', feedPet);
  petBtn.addEventListener('click', petTheCat);
  if (playBtn) playBtn.addEventListener('click', playWithCat);
  if (body) body.addEventListener('click', petTheCat);
}

function showPet() {
  const widget = document.getElementById('pet-widget');
  if (widget) widget.classList.add('show');
}
/* ====== ☁️ ОБЛАКО СЛОВ ====== */

const CLOUD_WORDS = [
  'любимая', 'родная', 'красивая', 'нежная',
  'солнышко', 'моя', 'единственная', 'счастье',
  'киса', 'принцесса', 'умница', 'милая'
];

function initCloud() {
  const cloud = document.getElementById('word-cloud');
  if (!cloud) return;
  cloud.innerHTML = '';

  // Позиции по краям экрана (не в центре, чтобы не мешать заголовку)
  const positions = [
    { top: '12%', left: '8%' },
    { top: '22%', left: '78%' },
    { top: '75%', left: '12%' },
    { top: '82%', left: '70%' },
    { top: '40%', left: '4%' },
    { top: '35%', left: '82%' },
    { top: '60%', left: '80%' },
    { top: '65%', left: '6%' },
    { top: '8%', left: '42%' },
    { top: '88%', left: '45%' },
    { top: '45%', left: '88%' },
    { top: '48%', left: '2%' }
  ];

  CLOUD_WORDS.forEach((word, i) => {
    const el = document.createElement('span');
    el.className = 'cloud-word';
    el.textContent = word;
    const p = positions[i % positions.length];
    el.style.top = p.top;
    el.style.left = p.left;
    el.style.animationDelay = (i * 0.4) + 's';
    el.style.fontSize = (1.2 + Math.random() * 0.9) + 'rem';
    cloud.appendChild(el);
  });
}
/* ====== 👊 БИТВА С БОССОМ ====== */

const BOSSES = [
  { name: 'Грусть', emoji: '😢', hp: 100 },
  { name: 'Скука',  emoji: '😐', hp: 120 },
  { name: 'Ссора',  emoji: '😠', hp: 150 }
];

let bossIndex = 0;
let bossHp = 0;
let bossMaxHp = 0;
let bossBattleStarted = false;
let bossBattleFinished = false;

function initBossBattle() {
  if (bossBattleStarted) return;
  bossBattleStarted = true;
  bossIndex = 0;
  bossBattleFinished = false;

  // Кнопка «Дальше» скрыта в начале
  const nextBtn = document.getElementById('btn-boss-next');
  if (nextBtn) nextBtn.style.display = 'none';
  const hitBtn = document.getElementById('btn-hit');
  if (hitBtn) hitBtn.style.display = 'inline-block';

  startBoss(BOSSES[0]);

  if (hitBtn && !hitBtn._bound) {
    hitBtn._bound = true;
    hitBtn.addEventListener('click', hitBoss);
  }
}

function startBoss(boss) {
  bossMaxHp = boss.hp;
  bossHp = boss.hp;

  document.getElementById('boss-name').textContent = boss.name;
  const sprite = document.getElementById('boss-sprite');
  sprite.textContent = boss.emoji;
  sprite.className = 'boss-sprite';
  document.getElementById('boss-hp').style.width = '100%';
  document.getElementById('battle-log').textContent = '';

  const hitBtn = document.getElementById('btn-hit');
  hitBtn.disabled = false;
  hitBtn.textContent = '💖 Ударить любовью';
}

function hitBoss() {
  if (bossBattleFinished) return;

  const hitBtn = document.getElementById('btn-hit');
  const sprite = document.getElementById('boss-sprite');
  const hpBar = document.getElementById('boss-hp');
  const log = document.getElementById('battle-log');

  // Урон со случайностью + крит
  const isCrit = Math.random() < 0.2;
  const dmg = isCrit ? 30 : 12 + Math.floor(Math.random() * 8);
  bossHp = Math.max(0, bossHp - dmg);

  hpBar.style.width = (bossHp / bossMaxHp * 100) + '%';

  // Анимация удара
  sprite.classList.remove('hit');
  void sprite.offsetWidth;
  sprite.classList.add('hit');

  // Летящие сердечки
  const rect = sprite.getBoundingClientRect();
  const count = isCrit ? 10 : 5;
  for (let i = 0; i < count; i++) {
    const h = document.createElement('div');
    h.className = 'burst';
    h.textContent = ['💖','💕','❤️'][Math.floor(Math.random() * 3)];
    h.style.left = (rect.left + rect.width / 2) + 'px';
    h.style.top  = (rect.top + rect.height / 2) + 'px';
    h.style.setProperty('--x', ((Math.random() - 0.5) * 200) + 'px');
    h.style.setProperty('--y', ((Math.random() - 0.5) * 200) + 'px');
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1500);
  }

  // Лог
  if (isCrit) {
    log.innerHTML = '<span class="crit">КРИТ! −' + dmg + ' HP 💥</span>';
  } else {
    log.textContent = 'Удар любовью! −' + dmg + ' HP';
  }

  // Босс побеждён?
  if (bossHp <= 0) {
    hitBtn.disabled = true;
    sprite.classList.add('die');

    setTimeout(() => {
      bossIndex++;
      if (bossIndex < BOSSES.length) {
        startBoss(BOSSES[bossIndex]);
      } else {
        winBattle();
      }
    }, 900);
  }
}

function winBattle() {
  bossBattleFinished = true;

  document.getElementById('boss-name').textContent = '💖 Победа!';
  const sprite = document.getElementById('boss-sprite');
  sprite.textContent = '🥰';
  sprite.className = 'boss-sprite';
  document.getElementById('boss-hp').style.width = '0%';
  document.getElementById('battle-log').textContent =
    'Ты победила всё, что мешает нам быть вместе.';
  document.getElementById('btn-hit').style.display = 'none';
  document.getElementById('btn-boss-next').style.display = 'inline-block';

  fireworks();
  setTimeout(fireworks, 800);
}
/* ====== 💋 КНОПКА «ПОЦЕЛОВАТЬ» ====== */

function playKissSound() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch (e) {}
}

function setupKissButton() {
  const btn = document.getElementById('kiss-btn');
  const overlay = document.getElementById('kiss-overlay');
  if (!btn || !overlay) return;

  let kissing = false;

  btn.addEventListener('click', () => {
    if (kissing) return;
    kissing = true;

    overlay.classList.add('show');
    playKissSound();

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const emojis = ['💋', '💕', '❤️', '💗', '😘'];

    for (let i = 0; i < 25; i++) {
      const el = document.createElement('div');
      el.className = 'kiss-heart';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const angle = (i / 25) * Math.PI * 2 + Math.random() * 0.5;
      const radius = Math.max(window.innerWidth, window.innerHeight) * 0.7;
      const startX = cx + Math.cos(angle) * radius;
      const startY = cy + Math.sin(angle) * radius;
      el.style.left = startX + 'px';
      el.style.top  = startY + 'px';
      el.style.setProperty('--dx', ((cx - startX) + (Math.random() - 0.5) * 80) + 'px');
      el.style.setProperty('--dy', ((cy - startY) + (Math.random() - 0.5) * 80) + 'px');
      document.body.appendChild(el);
      requestAnimationFrame(() => {
        setTimeout(() => el.classList.add('gather'), i * 25);
      });
      setTimeout(() => el.remove(), 2200);
    }

    setTimeout(() => {
      overlay.classList.remove('show');
      setTimeout(() => { kissing = false; }, 600);
    }, 2500);
  });
}

function showKissButton() {
  const btn = document.getElementById('kiss-btn');
  if (btn) btn.classList.add('show');
}

/* ====== 🔄 КНОПКА «ПРОЙТИ ЗАНОВО» ====== */

function setupRestart() {
  const btn = document.getElementById('restart-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (!confirm('Вернуться в начало и пройти всё заново?')) return;
    ['love_site_unlocked_v1',
     'love_pet_state_v1',
     'love_pet_achievements_v1',
     'love_site_light'
    ].forEach(k => {
      try { localStorage.removeItem(k); } catch (e) {}
    });
    location.reload();
  });
}

function showRestartButton() {
  const btn = document.getElementById('restart-btn');
  if (btn) btn.classList.add('show');
}

/* ====== 🌀 ЛАБИРИНТ К СЕРДЦУ ====== */

const MAZE = [
  "S.#....",
  ".#.#.#.",
  ".#.#.#.",
  "...#...",
  ".#.#.#.",
  ".#.#.#.",
  ".....E."
];
const MAZE_COLS = 7;
const MAZE_ROWS = 7;
const MAZE_CELL = 60;
const MAZE_FONT = `${MAZE_CELL * 0.7}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;

let mazeState = { x: 0, y: 0, won: false };
let mazeInitialized = false;

function findMazeStart() {
  for (let y = 0; y < MAZE_ROWS; y++)
    for (let x = 0; x < MAZE_COLS; x++)
      if (MAZE[y][x] === 'S') return { x, y };
  return { x: 0, y: 0 };
}

function isMazeWall(x, y) {
  if (x < 0 || y < 0 || x >= MAZE_COLS || y >= MAZE_ROWS) return true;
  return MAZE[y][x] === '#';
}

function isMazeGoal(x, y) { return MAZE[y][x] === 'E'; }

function drawMaze() {
  const canvas = document.getElementById('maze-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = MAZE_COLS * MAZE_CELL;
  const H = MAZE_ROWS * MAZE_CELL;

  // Фон
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#1a0b1f');
  bg.addColorStop(1, '#2d1231');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Клетки
  for (let y = 0; y < MAZE_ROWS; y++) {
    for (let x = 0; x < MAZE_COLS; x++) {
      if (MAZE[y][x] === '#') {
        ctx.fillStyle = 'rgba(107, 45, 92, 0.95)';
        ctx.fillRect(x * MAZE_CELL, y * MAZE_CELL, MAZE_CELL, MAZE_CELL);
        ctx.strokeStyle = 'rgba(255, 182, 213, 0.35)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * MAZE_CELL + 0.5, y * MAZE_CELL + 0.5, MAZE_CELL - 1, MAZE_CELL - 1);
      } else {
        // Свободные клетки — чуть светлее
        ctx.fillStyle = 'rgba(60, 30, 60, 0.6)';
        ctx.fillRect(x * MAZE_CELL, y * MAZE_CELL, MAZE_CELL, MAZE_CELL);
      }
    }
  }

  // 🎯 Финиш — большое пульсирующее сердце с подложкой
  const goalPos = findMazeGoal();
  if (goalPos) {
    const gx = goalPos.x * MAZE_CELL + MAZE_CELL / 2;
    const gy = goalPos.y * MAZE_CELL + MAZE_CELL / 2;
    drawHeart(ctx, gx, gy, MAZE_CELL * 0.42, '#ff1493', true);
  }

  // ❤️ Игрок — розовое сердце с белым свечением
  const px = mazeState.x * MAZE_CELL + MAZE_CELL / 2;
  const py = mazeState.y * MAZE_CELL + MAZE_CELL / 2;
  drawHeart(ctx, px, py, MAZE_CELL * 0.38, '#ff69b4', true);
}

// Рисует красивое сердце с подложкой и свечением
function drawHeart(ctx, cx, cy, size, color, glow) {
  // Свечение (мягкое пятно под сердцем)
  if (glow) {
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.6);
    grd.addColorStop(0, color + 'aa');
    grd.addColorStop(0.5, color + '40');
    grd.addColorStop(1, color + '00');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Тёмная подложка, чтобы сердце не сливалось с фоном
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 1.05, 0, Math.PI * 2);
  ctx.fill();

  // Само сердце — рисуем через кривые Безье
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(size / 50, size / 50);   // размер normalized к 50

  ctx.beginPath();
  ctx.moveTo(0, 15);
  ctx.bezierCurveTo(-25, -10, -30, -35, 0, -25);
  ctx.bezierCurveTo(30, -35, 25, -10, 0, 15);
  ctx.closePath();

  // Заливка
  ctx.fillStyle = color;
  ctx.fill();

  // Белая обводка для контраста
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3 / (size / 50);
  ctx.stroke();

  // Внутренний блик
  ctx.beginPath();
  ctx.ellipse(-8, -12, 6, 4, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fill();

  ctx.restore();
}

function findMazeGoal() {
  for (let y = 0; y < MAZE_ROWS; y++)
    for (let x = 0; x < MAZE_COLS; x++)
      if (MAZE[y][x] === 'E') return { x, y };
  return null;
}

function tryMazeMove(dx, dy) {
  if (mazeState.won) return;
  if (!document.getElementById('screen-maze').classList.contains('active')) return;

  const nx = mazeState.x + dx;
  const ny = mazeState.y + dy;
  if (isMazeWall(nx, ny)) return;
  mazeState.x = nx;
  mazeState.y = ny;
  drawMaze();

  if (isMazeGoal(nx, ny)) {
    mazeState.won = true;
    setTimeout(winMaze, 300);
  }
}

function winMaze() {
  document.getElementById('maze-win').classList.add('show');
  document.getElementById('maze-controls').style.display = 'none';
  document.getElementById('maze-hint').style.display = 'none';
  fireworks();
}

function initMaze() {
  if (mazeInitialized) return;
  mazeInitialized = true;
  const s = findMazeStart();
  mazeState.x = s.x;
  mazeState.y = s.y;
  drawMaze();
}

function setupMaze() {
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('screen-maze').classList.contains('active')) return;
    if (e.key === 'ArrowUp'    || e.key === 'w' || e.key === 'W') { e.preventDefault(); tryMazeMove(0, -1); }
    if (e.key === 'ArrowDown'  || e.key === 's' || e.key === 'S') { e.preventDefault(); tryMazeMove(0, 1); }
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') { e.preventDefault(); tryMazeMove(-1, 0); }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); tryMazeMove(1, 0); }
  });

  document.querySelectorAll('.maze-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = btn.dataset.dir;
      if (d === 'up')    tryMazeMove(0, -1);
      if (d === 'down')  tryMazeMove(0, 1);
      if (d === 'left')  tryMazeMove(-1, 0);
      if (d === 'right') tryMazeMove(1, 0);
    });
  });

  const canvas = document.getElementById('maze-canvas');
  if (canvas) {
    let ts = null;
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) ts = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    canvas.addEventListener('touchend', (e) => {
      if (!ts) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - ts.x;
      const dy = t.clientY - ts.y;
      ts = null;
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
      if (Math.abs(dx) > Math.abs(dy)) tryMazeMove(dx > 0 ? 1 : -1, 0);
      else tryMazeMove(0, dy > 0 ? 1 : -1);
    });
  }
}
/* ====== 📅 ЭКРАН ВЫБОРА ДАТЫ ====== */

let dateScreenInitialized = false;

function initDateScreen() {
  if (dateScreenInitialized) return;
  dateScreenInitialized = true;

  const picker = document.getElementById('date-picker');
  const send = document.getElementById('date-send');
  const note = document.getElementById('date-note');
  const status = document.getElementById('date-status');
  if (!picker || !send) return;

  // Запрещаем прошедшие даты
  const today = new Date();
  const iso = today.toISOString().split('T')[0];
  picker.setAttribute('min', iso);

  // Если она уже выбирала — подставляем
  try {
    const saved = localStorage.getItem('love_date');
    if (saved) picker.value = saved;
  } catch (e) {}

  if (send._bound) return;
  send._bound = true;

  send.addEventListener('click', async () => {
    const dateValue = picker.value;
    const noteValue = note.value.trim();

    if (!dateValue) {
      status.textContent = 'Выбери дату, любимая 💭';
      status.className = 'date-status error';
      return;
    }

    // Форматируем дату
    const d = new Date(dateValue + 'T12:00:00');
    const months = ['января','февраля','марта','апреля','мая','июня',
                    'июля','августа','сентября','октября','ноября','декабря'];
    const days = ['воскресенье','понедельник','вторник','среда',
                  'четверг','пятница','суббота'];
    const pretty = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} (${days[d.getDay()]})`;

    // Сколько осталось
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const target = new Date(dateValue + 'T00:00:00');
    const diffDays = Math.round((target - todayStart) / (1000*60*60*24));

    let timeStr;
    if (diffDays === 0) timeStr = '⭐ Сегодня!';
    else if (diffDays === 1) timeStr = '💫 Завтра!';
    else if (diffDays > 0) timeStr = `⏳ Осталось ${diffDays} ${plural(diffDays,'день','дня','дней')}`;
    else timeStr = '(уже прошло)';

    let msg = `💕 Лерочка выбрала дату!\n\n📅 ${pretty}\n${timeStr}`;
    if (noteValue) msg += `\n\n💌 Записка от неё:\n«${noteValue}»`;

    send.disabled = true;
    send.textContent = 'Отправляю...';
    status.textContent = '';
    status.className = 'date-status';

    try {
      const url = `https://api.telegram.org/bot${TELEGRAM.botToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM.chatId,
          text: msg
        })
      });

      if (!res.ok) throw new Error('send failed');

      status.textContent = 'Отправлено 💖 Спасибо, любимая!';
      status.className = 'date-status success';
      send.textContent = 'Отправлено 💖';

      try { localStorage.setItem('love_date', dateValue); } catch (e) {}

      fireworks();

      // Показываем кнопку "Дальше" через секунду
      setTimeout(() => {
        document.getElementById('btn-date-next').style.display = 'inline-block';
      }, 1200);

    } catch (err) {
      status.textContent = 'Не получилось отправить 😔 Попробуй ещё';
      status.className = 'date-status error';
      send.disabled = false;
      send.textContent = 'Отправить 💌';
    }
  });
}

/* ====== 💌 СЕКРЕТ НА СЕРДЕЧКЕ ====== */

// 👇 Настрой под себя
const HEART_SECRET = {
  // Сколько кликов надо, чтобы открыть секрет
  clicks: 5,
  // Заголовок в модалке
  title: 'Ты нашла мой секрет 💖',
  // Текст
  text: 'Каждый раз, когда ты нажимаешь на это сердце, я улыбаюсь.\nПотому что ты — самое лучшее, что со мной случилось.',
  // Ссылка (оставь пустой, если не нужна)
  link: '',           // например: 'https://open.spotify.com/...'
  linkText: 'Открыть плейлист'
};

let heartClicks = 0;
let heartSecretOpened = false;
let heartClickListener = null;

function setupHeartSecret() {
  const heart = document.getElementById('heart-secret');
  const overlay = document.getElementById('heart-overlay');
  const close = document.getElementById('heart-secret-close');
  const titleEl = document.getElementById('heart-secret-title');
  const textEl = document.getElementById('heart-secret-text');
  const linkEl = document.getElementById('heart-secret-link');
  if (!heart || !overlay) return;

  // Один раз привязываем обработчик
  if (heartClickListener) return;

  heartClickListener = () => {
    if (heartSecretOpened) return;

    heartClicks++;

    // Лёгкая пульсация на каждый клик
    heart.style.transform = 'scale(1.3)';
    setTimeout(() => { heart.style.transform = ''; }, 150);

    // Мини-салют на каждый клик
    const rect = heart.getBoundingClientRect();
    for (let i = 0; i < 4; i++) {
      const h = document.createElement('div');
      h.className = 'burst';
      h.textContent = ['💖','💕','❤️','✨'][Math.floor(Math.random() * 4)];
      h.style.left = (rect.left + rect.width / 2) + 'px';
      h.style.top  = (rect.top + rect.height / 2) + 'px';
      h.style.setProperty('--x', ((Math.random() - 0.5) * 250) + 'px');
      h.style.setProperty('--y', ((Math.random() - 0.5) * 250) + 'px');
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1500);
    }

    // Дошла до нужного числа кликов — открываем секрет
    if (heartClicks >= HEART_SECRET.clicks) {
      heartSecretOpened = true;
      openHeartSecret();
    }
  };

  heart.addEventListener('click', heartClickListener);

  close.addEventListener('click', () => overlay.classList.remove('show'));

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('show');
  });

  function openHeartSecret() {
    titleEl.textContent = HEART_SECRET.title;
    textEl.textContent = HEART_SECRET.text;

    if (HEART_SECRET.link) {
      linkEl.href = HEART_SECRET.link;
      linkEl.textContent = HEART_SECRET.linkText || 'Открыть →';
      linkEl.style.display = 'inline-block';
    } else {
      linkEl.style.display = 'none';
    }

    overlay.classList.add('show');
    fireworks();
    setTimeout(fireworks, 600);
  }
}
/* ====== СТАРТ ====== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader(() => {
    initLock();
    startCounter();
    setInterval(spawnHeart, 500);
    setupMusic();
    setupParallax();
    setupHugButton();
    setupKissButton();
    setupMessage();
    setupCert();
    setupPet();
    setupRestart();
    setupMaze();
    initDateScreen();      
    initCloud();
    setupHeartSecret();  
  });
});

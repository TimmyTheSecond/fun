// Shared game-card rendering for the home page and category pages.
(function () {
  const FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSduSqSDUYzhNrz-5Ma_DIyV7inqtkY7JyVpPemY4zXF_Qyd4g/viewform';
  const style = document.createElement('style');
  style.textContent = `
    .game-image-wrap { position: relative; }
    .game-image-wrap > a { display: block; margin: 0; }
    .game-image-wrap .game-report-link {
      position: absolute; top: 8px; right: 8px; z-index: 2;
      display: grid; width: 36px; height: 36px; margin: 0; padding: 0;
      place-items: center; border: 0; color: #fff; background: #e33434;
      clip-path: polygon(28% 0, 72% 0, 100% 28%, 100% 72%, 72% 100%, 28% 100%, 0 72%, 0 28%);
      box-shadow: 0 3px 12px rgba(0,0,0,.4); font: 800 20px/1 Arial, sans-serif;
      text-decoration: none; opacity: 0; visibility: hidden; transform: scale(.7) rotate(-12deg);
      transition: opacity 180ms ease, visibility 180ms ease, transform 220ms cubic-bezier(.2,.8,.2,1), background 160ms ease;
    }
    .game:hover .game-report-link, .game:focus-within .game-report-link { opacity: 1; visibility: visible; transform: scale(1) rotate(0); }
    .game-image-wrap .game-report-link:hover { color: #fff; background: #ff4b4b; transform: scale(1.12) rotate(6deg); }
    .game-image-wrap .game-report-link:focus-visible { opacity: 1; visibility: visible; outline: 3px solid #fff; outline-offset: 3px; }
    @media (hover: none) { .game-image-wrap .game-report-link { opacity: 1; visibility: visible; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .game-image-wrap .game-report-link { transition: none; } }
    .brand-copy { white-space: nowrap; }
    .category-page-header { margin: 32px 0 24px; }
    .category-page-header h1 { margin-top: 24px; font-size: clamp(32px, 5vw, 48px); }
    .back-home-link { display: inline-flex; align-items: center; gap: 8px; color: #b7adff; font-size: 13px; font-weight: 700; text-decoration: none; }
    .back-home-link:hover { color: #fff; }
  `;
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.brand').forEach(brand => {
      const mark = brand.querySelector('.brand-mark');
      brand.replaceChildren();
      if (mark) brand.appendChild(mark);
      const copy = document.createElement('span');
      copy.className = 'brand-copy';
      copy.textContent = 'Classes';
      brand.appendChild(copy);
    });

    const header = document.querySelector('.site-header');
    if (header && !header.querySelector('.feedback-link')) {
      const feedbackLink = document.createElement('a');
      feedbackLink.className = 'backup-link feedback-link';
      feedbackLink.href = FEEDBACK_FORM_URL;
      feedbackLink.target = '_blank';
      feedbackLink.rel = 'noopener noreferrer';
      feedbackLink.textContent = 'Feedback ↗';
      header.appendChild(feedbackLink);
    }
  });

  function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game';
    const imageWrap = document.createElement('div');
    imageWrap.className = 'game-image-wrap';
    const gameLink = document.createElement('a');
    gameLink.href = game.link;
    const image = document.createElement('img');
    image.src = game.image;
    image.alt = game.title;
    gameLink.appendChild(image);
    const reportLink = document.createElement('a');
    reportLink.className = 'game-report-link';
    reportLink.href = FEEDBACK_FORM_URL;
    reportLink.target = '_blank';
    reportLink.rel = 'noopener noreferrer';
    reportLink.textContent = '!';
    reportLink.setAttribute('aria-label', `Report ${game.title}`);
    reportLink.title = `Report ${game.title}`;
    imageWrap.append(gameLink, reportLink);
    const titleLink = document.createElement('a');
    titleLink.href = game.link;
    titleLink.textContent = game.title;
    card.append(imageWrap, titleLink);
    return card;
  }

  window.renderGameCards = function (container, games) {
    container.replaceChildren(...games.map(createGameCard));
  };

  document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('gameContainer');
    if (!container || !document.body.dataset.category && !document.body.dataset.group) return;
    fetch('data.json')
      .then(response => {
        if (!response.ok) throw new Error(`Could not load games (${response.status})`);
        return response.json();
      })
      .then(data => {
        let games = data.games;
        if (document.body.dataset.category) games = games.filter(game => game.category === document.body.dataset.category);
        if (document.body.dataset.group) games = games.filter(game => game.group === document.body.dataset.group);
        window.renderGameCards(container, games);
      })
      .catch(error => console.error('Error loading games:', error));
  });
})();

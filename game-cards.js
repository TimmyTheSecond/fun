// Shared game-card rendering for the home page and category pages.
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .game-image-wrap { position: relative; }
    .game-image-wrap > a { display: block; margin: 0; }
    .game-image-wrap .game-report-link {
      position: absolute; top: 8px; right: 8px; z-index: 2;
      display: grid; width: 34px; height: 34px; margin: 0; padding: 0;
      place-items: center; border: 1px solid rgba(255,255,255,.72);
      border-radius: 50%; color: #17152a; background: #d3ccff;
      box-shadow: 0 2px 9px rgba(0,0,0,.4); font: 800 20px/1 Arial, sans-serif;
      text-decoration: none; transition: transform 160ms ease, background 160ms ease;
    }
    .game-image-wrap .game-report-link:hover { color: #17152a; background: #fff; transform: scale(1.08); }
    .game-image-wrap .game-report-link:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }
    .category-page-header { margin: 32px 0 24px; }
    .category-page-header h1 { margin-top: 24px; font-size: clamp(32px, 5vw, 48px); }
    .back-home-link { display: inline-flex; align-items: center; gap: 8px; color: #b7adff; font-size: 13px; font-weight: 700; text-decoration: none; }
    .back-home-link:hover { color: #fff; }
  `;
  document.head.appendChild(style);

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
    reportLink.href = `report.html?game=${encodeURIComponent(game.title)}`;
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
        if (document.body.dataset.category) {
          games = games.filter(game => game.category === document.body.dataset.category);
        }
        if (document.body.dataset.group) {
          games = games.filter(game => game.group === document.body.dataset.group);
        }
        window.renderGameCards(container, games);
      })
      .catch(error => console.error('Error loading games:', error));
  });
})();

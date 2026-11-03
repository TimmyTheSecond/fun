let gamesnumber = 0;
let allGames = [];

fetch('data.json')
  .then(response => {
    if (!response.ok) throw new Error(`Could not load games (${response.status})`);
    return response.json();
  })
  .then(data => {
    allGames = data.games;
    renderGames(allGames);
    countGames(allGames);
  })
  .catch(error => console.error('Error loading games:', error));

function countGames(games) {
  gamesnumber = games.length;
  const gameCounter = document.getElementById('gamesnumber');
  if (gameCounter) gameCounter.textContent = `Games: ${gamesnumber}`;
}

function renderGames(games) {
  const gameContainer = document.getElementById('gameContainer');
  if (gameContainer && window.renderGameCards) window.renderGameCards(gameContainer, games);
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      renderGames(allGames.filter(game => game.title.toLowerCase().includes(searchTerm)));
    });
  }

  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  if (scrollToTopBtn) {
    const updateScrollButton = () => {
      scrollToTopBtn.style.display = window.scrollY > 20 ? 'flex' : 'none';
    };
    window.addEventListener('scroll', updateScrollButton);
    updateScrollButton();
    scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});

const REPORT_COOLDOWN_MS = 60 * 1000;
const LAST_REPORT_KEY = 'arcadeLastReportAt';

function readLastReportTime() {
  try {
    return Number(localStorage.getItem(LAST_REPORT_KEY)) || 0;
  } catch (error) {
    return 0;
  }
}

function updateCooldownMessage(status) {
  const remaining = Math.max(0, REPORT_COOLDOWN_MS - (Date.now() - readLastReportTime()));
  if (remaining > 0) {
    const seconds = Math.ceil(remaining / 1000);
    status.textContent = `Please wait ${seconds} second${seconds === 1 ? '' : 's'} before sending another report.`;
    return true;
  }
  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const game = params.get('game') || 'Unspecified game';
  const gameLine = document.getElementById('reportGame');
  const status = document.getElementById('reportStatus');
  const form = document.getElementById('reportForm');
  const gameStrong = document.createElement('strong');
  gameStrong.textContent = game;
  gameLine.append('Game: ', gameStrong);

  const timer = window.setInterval(() => updateCooldownMessage(status), 1000);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (updateCooldownMessage(status)) return;

    const reason = document.getElementById('reason').value;
    const description = document.getElementById('description').value.trim();
    const reportTitle = `Game report: ${game} — ${reason}`;
    const reportBody = [
      `Game: ${game}`,
      `Reason: ${reason}`,
      '',
      'Description:',
      description || '(No additional details provided.)'
    ].join('\n');

    // GitHub Pages has no server to receive reports. Open a pre-filled issue draft;
    // the visitor can review and submit it on GitHub.
    try {
      localStorage.setItem(LAST_REPORT_KEY, String(Date.now()));
    } catch (error) {
      // Continue to the issue draft if browser storage is unavailable.
    }
    window.clearInterval(timer);
    status.textContent = 'Opening a pre-filled GitHub issue. Sign in and submit it there to send the report.';
    const issueUrl = new URL('https://github.com/TimmyTheSecond/fun/issues/new');
    issueUrl.searchParams.set('title', reportTitle);
    issueUrl.searchParams.set('body', reportBody);
    window.location.assign(issueUrl.toString());
  });
});

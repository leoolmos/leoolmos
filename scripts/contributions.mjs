// Draws the last six months of GitHub contributions as two SVG files
// (light and dark) that the profile README embeds. No dependencies.
//
//   GH_TOKEN=$(gh auth token) node scripts/contributions.mjs
//
// In GitHub Actions the workflow passes its own GITHUB_TOKEN.

import { mkdirSync, writeFileSync } from 'node:fs';

const LOGIN = process.env.PROFILE_LOGIN || process.env.GITHUB_REPOSITORY_OWNER || 'leoolmos';
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const MONTHS = 6;
const OUT_DIR = new URL('../assets/', import.meta.url);

if (!TOKEN) {
  console.error('Set GH_TOKEN or GITHUB_TOKEN.');
  process.exit(1);
}

// ---- data -----------------------------------------------------------------

const to = new Date();
const from = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth() - MONTHS, to.getUTCDate()));

const query = `
  query ($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }`;

const response = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    authorization: `bearer ${TOKEN}`,
    'content-type': 'application/json',
    'user-agent': 'profile-contributions-graph',
  },
  body: JSON.stringify({
    query,
    variables: { login: LOGIN, from: from.toISOString(), to: to.toISOString() },
  }),
});
const payload = await response.json();
if (!response.ok || payload.errors || !payload.data?.user) {
  console.error('GitHub API error:', JSON.stringify(payload.errors ?? payload));
  process.exit(1);
}

const calendar = payload.data.user.contributionsCollection.contributionCalendar;
const weeks = calendar.weeks.map((week) => week.contributionDays);
const total = calendar.totalContributions;

// ---- layout ---------------------------------------------------------------

const LEVELS = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CELL = 26; // square size
const GAP = 5; // space between squares
const PITCH = CELL + GAP;
const RADIUS = 5;
const LEFT = 44; // room for the weekday labels
const TOP = 78; // room for the title and the month labels
const WIDTH = LEFT + weeks.length * PITCH - GAP + 2;
const GRID_BOTTOM = TOP + 7 * PITCH - GAP;
const HEIGHT = GRID_BOTTOM + 46;

const weekday = (date) => new Date(`${date}T00:00:00Z`).getUTCDay(); // 0 = Sunday

// A month label goes over the first column that holds that month's first day.
const monthLabels = [];
weeks.forEach((days, column) => {
  const first = days.find((day) => day.date.endsWith('-01'));
  const startsHere = column === 0 ? days[0] : first;
  if (!startsHere) return;
  const month = Number(startsHere.date.slice(5, 7)) - 1;
  const previous = monthLabels.at(-1);
  if (previous && previous.month === month) return;
  if (previous && column - previous.column < 3) {
    // Too close to the label before it: the newer month wins.
    if (previous.column === 0) monthLabels.pop();
    else return;
  }
  monthLabels.push({ column, month });
});

const THEMES = {
  light: {
    text: '#1f2328',
    muted: '#59636e',
    stroke: 'rgba(31,35,40,0.06)',
    ramp: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  },
  dark: {
    text: '#f0f6fc',
    muted: '#9198a1',
    stroke: 'rgba(240,246,252,0.05)',
    ramp: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  },
};

function render(theme) {
  const font = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif`;
  const parts = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-labelledby="t d" font-family="${font}">`,
    `<title id="t">${total} contributions in the last ${MONTHS} months</title>`,
    `<desc id="d">Calendar heatmap of ${LOGIN}'s GitHub contributions, one square per day from ${weeks[0][0].date} to ${weeks.at(-1).at(-1).date}. Darker squares mean more contributions.</desc>`,
    `<text x="0" y="24" font-size="20" font-weight="600" fill="${theme.text}">${total.toLocaleString('en-US')} contributions <tspan font-weight="400" fill="${theme.muted}">in the last ${MONTHS} months</tspan></text>`,
  );

  for (const { column, month } of monthLabels) {
    parts.push(
      `<text x="${LEFT + column * PITCH}" y="${TOP - 12}" font-size="14" fill="${theme.muted}">${MONTH_NAMES[month]}</text>`,
    );
  }

  for (const [row, label] of [[1, 'Mon'], [3, 'Wed'], [5, 'Fri']]) {
    parts.push(
      `<text x="0" y="${TOP + row * PITCH + CELL / 2 + 5}" font-size="14" fill="${theme.muted}">${label}</text>`,
    );
  }

  weeks.forEach((days, column) => {
    for (const day of days) {
      const level = Math.max(0, LEVELS.indexOf(day.contributionLevel));
      parts.push(
        `<rect x="${LEFT + column * PITCH}" y="${TOP + weekday(day.date) * PITCH}" width="${CELL}" height="${CELL}" rx="${RADIUS}" fill="${theme.ramp[level]}" stroke="${theme.stroke}" stroke-width="1"/>`,
      );
    }
  });

  // Legend, right-aligned under the grid.
  const legendY = GRID_BOTTOM + 20;
  const swatch = 16;
  const swatchGap = 5;
  const moreWidth = 36;
  const swatchesWidth = theme.ramp.length * (swatch + swatchGap) - swatchGap;
  const right = WIDTH - 2;
  const swatchesX = right - moreWidth - 8 - swatchesWidth;
  parts.push(
    `<text x="${swatchesX - 8}" y="${legendY + 13}" font-size="14" text-anchor="end" fill="${theme.muted}">Less</text>`,
  );
  theme.ramp.forEach((color, index) => {
    parts.push(
      `<rect x="${swatchesX + index * (swatch + swatchGap)}" y="${legendY}" width="${swatch}" height="${swatch}" rx="4" fill="${color}" stroke="${theme.stroke}" stroke-width="1"/>`,
    );
  });
  parts.push(
    `<text x="${right}" y="${legendY + 13}" font-size="14" text-anchor="end" fill="${theme.muted}">More</text>`,
    `</svg>`,
  );

  return parts.join('\n') + '\n';
}

mkdirSync(OUT_DIR, { recursive: true });
for (const [name, theme] of Object.entries(THEMES)) {
  writeFileSync(new URL(`contributions-${name}.svg`, OUT_DIR), render(theme));
}
console.log(`${LOGIN}: ${total} contributions, ${weeks.length} weeks, ${WIDTH}x${HEIGHT}`);

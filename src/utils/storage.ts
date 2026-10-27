import type { Scoreboard } from '../types/game.types';

export const SCOREBOARD_STORAGE_KEY = 'tic_tac_toe_scoreboard';

export const INITIAL_SCOREBOARD: Readonly<Scoreboard> = {
  xWins: 0,
  oWins: 0,
  draws: 0,
};

/**
 * Loads scoreboard from localStorage with fallback on missing or corrupted data.
 */
export function loadScoreboard(): Scoreboard {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { ...INITIAL_SCOREBOARD };
  }

  try {
    const raw = window.localStorage.getItem(SCOREBOARD_STORAGE_KEY);
    if (!raw) {
      return { ...INITIAL_SCOREBOARD };
    }

    const parsed = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      Number.isInteger(parsed.xWins) &&
      parsed.xWins >= 0 &&
      Number.isInteger(parsed.oWins) &&
      parsed.oWins >= 0 &&
      Number.isInteger(parsed.draws) &&
      parsed.draws >= 0
    ) {
      return {
        xWins: parsed.xWins,
        oWins: parsed.oWins,
        draws: parsed.draws,
      };
    }
  } catch {
    // Malformed JSON or blocked storage access
  }

  return { ...INITIAL_SCOREBOARD };
}

/**
 * Saves scoreboard to localStorage safely.
 */
export function saveScoreboard(scoreboard: Scoreboard): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(SCOREBOARD_STORAGE_KEY, JSON.stringify(scoreboard));
  } catch {
    // Storage quota exceeded or disabled
  }
}

/**
 * Clears scoreboard in localStorage and returns zeroed scoreboard.
 */
export function clearScoreboard(): Scoreboard {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(SCOREBOARD_STORAGE_KEY);
    } catch {
      // Storage error
    }
  }
  return { ...INITIAL_SCOREBOARD };
}

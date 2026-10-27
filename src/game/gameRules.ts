import type { Cell, Player } from '../types/game.types';

export const WINNING_COMBINATIONS: readonly number[][] = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

export interface WinResult {
  winner: Player;
  line: number[];
}

/**
 * Checks if there is a winner on the board.
 * Returns the winning player and the winning cell indices, or null.
 */
export function checkWinner(board: Cell[]): WinResult | null {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as Player,
        line: [a, b, c],
      };
    }
  }
  return null;
}

/**
 * Checks if the board is in a draw state (all cells filled, no winner).
 */
export function checkDraw(board: Cell[]): boolean {
  if (checkWinner(board) !== null) {
    return false;
  }
  return board.every((cell) => cell !== null);
}

/**
 * Returns the list of indices (0-8) that are currently empty.
 */
export function getAvailableMoves(board: Cell[]): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

/**
 * Converts a 0-based index (0-8) into 1-based row and column.
 */
export function indexToRowCol(index: number): { row: number; column: number } {
  const row = Math.floor(index / 3) + 1;
  const column = (index % 3) + 1;
  return { row, column };
}

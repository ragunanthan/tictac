import type { Cell } from '../types/game.types';
import { checkWinner, getAvailableMoves } from './gameRules';

const CORNERS: readonly number[] = [0, 2, 6, 8];
const SIDES: readonly number[] = [1, 3, 5, 7];
const CENTER = 4;

/**
 * Calculates the next move for the computer ('O') based on strict rule priorities:
 * 1. Win: If O can win in the next move, select that cell.
 * 2. Block: If X can win in the next move, block that cell.
 * 3. Center: Select the center cell (4) if available.
 * 4. Corner: Select an available corner (0, 2, 6, 8).
 * 5. Remaining Cell: Select any other available cell (1, 3, 5, 7).
 *
 * Returns the 0-based cell index (0-8) or null if no valid move exists.
 */
export function getComputerMove(board: Cell[]): number | null {
  const available = getAvailableMoves(board);
  if (available.length === 0) {
    return null;
  }

  // 1. Win: Check if O can win in 1 move
  for (const move of available) {
    const testBoard = [...board];
    testBoard[move] = 'O';
    const winResult = checkWinner(testBoard);
    if (winResult && winResult.winner === 'O') {
      return move;
    }
  }

  // 2. Block: Check if X can win in 1 move and block it
  for (const move of available) {
    const testBoard = [...board];
    testBoard[move] = 'X';
    const winResult = checkWinner(testBoard);
    if (winResult && winResult.winner === 'X') {
      return move;
    }
  }

  // 3. Center: Select center cell if available
  if (board[CENTER] === null) {
    return CENTER;
  }

  // 4. Corner: Select the first available corner
  for (const corner of CORNERS) {
    if (board[corner] === null) {
      return corner;
    }
  }

  // 5. Remaining Cell: Select the first available edge/side cell
  for (const side of SIDES) {
    if (board[side] === null) {
      return side;
    }
  }

  return null;
}

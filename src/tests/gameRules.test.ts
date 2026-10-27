import { describe, expect, it } from 'vitest';
import {
  checkDraw,
  checkWinner,
  getAvailableMoves,
  indexToRowCol,
  WINNING_COMBINATIONS,
} from '../game/gameRules';
import type { Cell } from '../types/game.types';

describe('gameRules', () => {
  it('has 8 winning combinations', () => {
    expect(WINNING_COMBINATIONS).toHaveLength(8);
  });

  describe('checkWinner', () => {
    it('detects row wins correctly', () => {
      // Row 0: [0, 1, 2]
      const board1: Cell[] = ['X', 'X', 'X', null, null, null, null, null, null];
      expect(checkWinner(board1)).toEqual({ winner: 'X', line: [0, 1, 2] });

      // Row 1: [3, 4, 5]
      const board2: Cell[] = [null, null, null, 'O', 'O', 'O', null, null, null];
      expect(checkWinner(board2)).toEqual({ winner: 'O', line: [3, 4, 5] });

      // Row 2: [6, 7, 8]
      const board3: Cell[] = [null, null, null, null, null, null, 'X', 'X', 'X'];
      expect(checkWinner(board3)).toEqual({ winner: 'X', line: [6, 7, 8] });
    });

    it('detects column wins correctly', () => {
      // Col 0: [0, 3, 6]
      const board1: Cell[] = ['X', null, null, 'X', null, null, 'X', null, null];
      expect(checkWinner(board1)).toEqual({ winner: 'X', line: [0, 3, 6] });

      // Col 1: [1, 4, 7]
      const board2: Cell[] = [null, 'O', null, null, 'O', null, null, 'O', null];
      expect(checkWinner(board2)).toEqual({ winner: 'O', line: [1, 4, 7] });

      // Col 2: [2, 5, 8]
      const board3: Cell[] = [null, null, 'X', null, null, 'X', null, null, 'X'];
      expect(checkWinner(board3)).toEqual({ winner: 'X', line: [2, 5, 8] });
    });

    it('detects diagonal wins correctly', () => {
      // Main diagonal: [0, 4, 8]
      const board1: Cell[] = ['O', null, null, null, 'O', null, null, null, 'O'];
      expect(checkWinner(board1)).toEqual({ winner: 'O', line: [0, 4, 8] });

      // Anti-diagonal: [2, 4, 6]
      const board2: Cell[] = [null, null, 'X', null, 'X', null, 'X', null, null];
      expect(checkWinner(board2)).toEqual({ winner: 'X', line: [2, 4, 6] });
    });

    it('returns null when there is no winner', () => {
      const emptyBoard: Cell[] = Array(9).fill(null);
      expect(checkWinner(emptyBoard)).toBeNull();

      const incompleteBoard: Cell[] = ['X', 'O', 'X', 'X', 'O', null, null, null, null];
      expect(checkWinner(incompleteBoard)).toBeNull();
    });
  });

  describe('checkDraw', () => {
    it('returns true when board is full and no winner exists', () => {
      const drawBoard: Cell[] = [
        'X', 'O', 'X',
        'X', 'O', 'O',
        'O', 'X', 'X',
      ];
      expect(checkDraw(drawBoard)).toBe(true);
    });

    it('returns false if board is not full', () => {
      const inProgressBoard: Cell[] = [
        'X', 'O', 'X',
        'X', null, 'O',
        'O', 'X', 'X',
      ];
      expect(checkDraw(inProgressBoard)).toBe(false);
    });

    it('returns false if a player has won even if board is full', () => {
      const wonBoard: Cell[] = [
        'X', 'X', 'X',
        'O', 'O', 'X',
        'O', 'X', 'O',
      ];
      expect(checkDraw(wonBoard)).toBe(false);
    });
  });

  describe('getAvailableMoves', () => {
    it('returns all indices for an empty board', () => {
      const emptyBoard: Cell[] = Array(9).fill(null);
      expect(getAvailableMoves(emptyBoard)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('returns only empty cell indices', () => {
      const board: Cell[] = ['X', null, 'O', null, 'X', null, null, null, 'O'];
      expect(getAvailableMoves(board)).toEqual([1, 3, 5, 6, 7]);
    });

    it('returns empty array when board is full', () => {
      const fullBoard: Cell[] = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
      expect(getAvailableMoves(fullBoard)).toEqual([]);
    });
  });

  describe('indexToRowCol', () => {
    it('calculates 1-based row and column correctly for each index', () => {
      expect(indexToRowCol(0)).toEqual({ row: 1, column: 1 });
      expect(indexToRowCol(1)).toEqual({ row: 1, column: 2 });
      expect(indexToRowCol(2)).toEqual({ row: 1, column: 3 });
      expect(indexToRowCol(3)).toEqual({ row: 2, column: 1 });
      expect(indexToRowCol(4)).toEqual({ row: 2, column: 2 });
      expect(indexToRowCol(5)).toEqual({ row: 2, column: 3 });
      expect(indexToRowCol(6)).toEqual({ row: 3, column: 1 });
      expect(indexToRowCol(7)).toEqual({ row: 3, column: 2 });
      expect(indexToRowCol(8)).toEqual({ row: 3, column: 3 });
    });
  });
});

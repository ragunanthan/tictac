import { describe, expect, it } from 'vitest';
import { getComputerMove } from '../game/computerPlayer';
import type { Cell } from '../types/game.types';

describe('computerPlayer algorithm', () => {
  it('Priority 1 (Win): selects the winning cell when O can win', () => {
    // O has [0] and [1], [2] is empty. O should take [2] to win.
    const board: Cell[] = [
      'O', 'O', null,
      'X', 'X', null,
      null, null, null,
    ];
    expect(getComputerMove(board)).toBe(2);
  });

  it('Priority 1 over Priority 2: prioritizes winning over blocking', () => {
    // Both X and O have 2 in a row. O must take the winning move instead of blocking X.
    // O can win at index 2 (row 0: [0, 1, 2])
    // X can win at index 5 (row 1: [3, 4, 5])
    const board: Cell[] = [
      'O', 'O', null,
      'X', 'X', null,
      null, null, null,
    ];
    expect(getComputerMove(board)).toBe(2);
  });

  it('Priority 2 (Block): blocks X from winning on the next move', () => {
    // X has [0] and [3], [6] is empty. O must pick [6] to block.
    const board: Cell[] = [
      'X', 'O', null,
      'X', null, null,
      null, null, null,
    ];
    expect(getComputerMove(board)).toBe(6);
  });

  it('Priority 2 (Block): blocks diagonal win for X', () => {
    // X has [0] and [4], [8] is empty. O must pick [8].
    const board: Cell[] = [
      'X', null, null,
      null, 'X', null,
      null, null, null,
    ];
    expect(getComputerMove(board)).toBe(8);
  });

  it('Priority 3 (Center): selects center cell (index 4) if available', () => {
    // X moves to corner [0]. Center [4] is available. O selects center.
    const board: Cell[] = [
      'X', null, null,
      null, null, null,
      null, null, null,
    ];
    expect(getComputerMove(board)).toBe(4);
  });

  it('Priority 4 (Corner): selects corner when center is occupied and no immediate win/block', () => {
    // X took center [4]. Corners are [0, 2, 6, 8].
    // Deterministic algorithm picks first available corner: index 0.
    const board: Cell[] = [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ];
    expect(getComputerMove(board)).toBe(0);
  });

  it('Priority 4 (Corner): selects next available corner when first corner is occupied', () => {
    // [0] and [4] occupied. Next corner is [2].
    const board: Cell[] = [
      'X', null, null,
      null, 'O', null,
      null, null, null,
    ];
    expect(getComputerMove(board)).toBe(2);
  });

  it('Priority 5 (Remaining Cell): selects edge/side when center and all corners are occupied', () => {
    // Corners [0, 2, 6, 8] and center [4] occupied.
    // Sides are [1, 3, 5, 7]. First available side is [1].
    const board: Cell[] = [
      'X', null, 'O',
      null, 'X', null,
      'O', null, 'X',
    ];
    // Remaining are 1, 3, 5, 7. None allows immediate win for X or O.
    // Available: 1, 3, 5, 7.
    // Should pick 1.
    expect(getComputerMove(board)).toBe(1);
  });

  it('returns null when no moves are available', () => {
    const fullBoard: Cell[] = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X',
    ];
    expect(getComputerMove(fullBoard)).toBeNull();
  });
});

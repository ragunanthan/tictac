import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTicTacToe } from '../hooks/useTicTacToe';

describe('useTicTacToe hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with default twoPlayer mode and clean board', () => {
    const { result } = renderHook(() => useTicTacToe('twoPlayer'));
    expect(result.current.mode).toBe('twoPlayer');
    expect(result.current.board.every((c) => c === null)).toBe(true);
    expect(result.current.currentPlayer).toBe('X');
    expect(result.current.status).toBe('InProgress');
    expect(result.current.canUndo).toBe(false);
  });

  it('triggers computer move after delay in computer mode', () => {
    const { result } = renderHook(() => useTicTacToe('computer'));

    // Human plays X at index 0
    act(() => {
      result.current.makeMove(0);
    });

    expect(result.current.board[0]).toBe('X');
    expect(result.current.currentPlayer).toBe('O');
    expect(result.current.isComputerThinking).toBe(true);

    // Fast-forward timer by 400ms
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.isComputerThinking).toBe(false);
    // Computer takes center cell [4] (Priority 3)
    expect(result.current.board[4]).toBe('O');
    expect(result.current.currentPlayer).toBe('X');
    expect(result.current.moveHistory).toHaveLength(2);
  });

  it('pending computer move cannot modify a reset game', () => {
    const { result } = renderHook(() => useTicTacToe('computer'));

    // Human plays X at index 0
    act(() => {
      result.current.makeMove(0);
    });

    expect(result.current.board[0]).toBe('X');
    expect(result.current.isComputerThinking).toBe(true);

    // Before timer finishes, reset game!
    act(() => {
      result.current.resetGame();
    });

    // Board is now completely clean
    expect(result.current.board.every((c) => c === null)).toBe(true);
    expect(result.current.isComputerThinking).toBe(false);
    expect(result.current.currentPlayer).toBe('X');

    // Advance time past the original 400ms
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Verify board remains completely clean - computer did NOT play on reset game!
    expect(result.current.board.every((c) => c === null)).toBe(true);
    expect(result.current.moveHistory).toHaveLength(0);
  });

  it('pending computer move is cancelled when mode is switched', () => {
    const { result } = renderHook(() => useTicTacToe('computer'));

    act(() => {
      result.current.makeMove(0);
    });
    expect(result.current.isComputerThinking).toBe(true);

    // Switch mode
    act(() => {
      result.current.setMode('twoPlayer');
    });

    expect(result.current.mode).toBe('twoPlayer');
    expect(result.current.isComputerThinking).toBe(false);

    // Advance timer
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.board.every((c) => c === null)).toBe(true);
  });
});

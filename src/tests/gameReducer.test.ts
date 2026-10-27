import { beforeEach, describe, expect, it } from 'vitest';
import { createInitialState, gameReducer } from '../game/gameReducer';
import { SCOREBOARD_STORAGE_KEY } from '../utils/storage';
import type { GameState } from '../types/game.types';

describe('gameReducer', () => {
  let initialState: GameState;

  beforeEach(() => {
    localStorage.clear();
    initialState = createInitialState('twoPlayer', { xWins: 0, oWins: 0, draws: 0 });
  });

  describe('MAKE_MOVE', () => {
    it('updates cell on valid move', () => {
      const state = gameReducer(initialState, { type: 'MAKE_MOVE', index: 0 });
      expect(state.board[0]).toBe('X');
      expect(state.moveHistory).toHaveLength(1);
      expect(state.moveHistory[0]).toEqual({
        moveNumber: 1,
        player: 'X',
        row: 1,
        column: 1,
        cellIndex: 0,
      });
    });

    it('rejects move on occupied cell', () => {
      const state1 = gameReducer(initialState, { type: 'MAKE_MOVE', index: 4 });
      const state2 = gameReducer(state1, { type: 'MAKE_MOVE', index: 4 });
      expect(state2).toBe(state1);
      expect(state2.board[4]).toBe('X');
      expect(state2.moveHistory).toHaveLength(1);
      expect(state2.currentPlayer).toBe('O');
    });

    it('rejects move with invalid index', () => {
      const stateNegative = gameReducer(initialState, { type: 'MAKE_MOVE', index: -1 });
      expect(stateNegative).toBe(initialState);

      const stateTooHigh = gameReducer(initialState, { type: 'MAKE_MOVE', index: 9 });
      expect(stateTooHigh).toBe(initialState);
    });

    it('alternates turns between X and O', () => {
      expect(initialState.currentPlayer).toBe('X');

      const state1 = gameReducer(initialState, { type: 'MAKE_MOVE', index: 0 });
      expect(state1.currentPlayer).toBe('O');

      const state2 = gameReducer(state1, { type: 'MAKE_MOVE', index: 1 });
      expect(state2.currentPlayer).toBe('X');
    });

    it('detects a row win and updates scoreboard once', () => {
      // Moves: X: 0, O: 3, X: 1, O: 4, X: 2 (Row 0 win)
      let state = gameReducer(initialState, { type: 'MAKE_MOVE', index: 0 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 3 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 1 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 4 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 2 });

      expect(state.status).toBe('Won');
      expect(state.winner).toBe('X');
      expect(state.winningCells).toEqual([0, 1, 2]);
      expect(state.scoreboard.xWins).toBe(1);
      expect(state.scoreboard.oWins).toBe(0);
      expect(state.scoreboard.draws).toBe(0);

      // Verify saved in localStorage
      const saved = JSON.parse(localStorage.getItem(SCOREBOARD_STORAGE_KEY) || '{}');
      expect(saved.xWins).toBe(1);
    });

    it('detects a column win for O', () => {
      // Moves: X: 1, O: 0, X: 2, O: 3, X: 5, O: 6 (Col 0 win for O)
      let state = gameReducer(initialState, { type: 'MAKE_MOVE', index: 1 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 0 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 2 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 3 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 5 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 6 });

      expect(state.status).toBe('Won');
      expect(state.winner).toBe('O');
      expect(state.winningCells).toEqual([0, 3, 6]);
      expect(state.scoreboard.oWins).toBe(1);
    });

    it('detects a diagonal win for X', () => {
      // Moves: X: 0, O: 1, X: 4, O: 2, X: 8 (Diag [0, 4, 8])
      let state = gameReducer(initialState, { type: 'MAKE_MOVE', index: 0 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 1 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 4 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 2 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 8 });

      expect(state.status).toBe('Won');
      expect(state.winner).toBe('X');
      expect(state.winningCells).toEqual([0, 4, 8]);
    });

    it('detects a draw and updates scoreboard once', () => {
      // Draw sequence:
      // X: 0, O: 1, X: 2
      // X: 4, O: 3, X: 5
      // O: 6, X: 7, O: 8
      const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
      // 0: X, 1: O, 2: X, 4: O, 3: X, 5: O, 7: X, 6: O, 8: X
      let state = initialState;
      for (const m of moves) {
        state = gameReducer(state, { type: 'MAKE_MOVE', index: m });
      }

      expect(state.status).toBe('Draw');
      expect(state.winner).toBeNull();
      expect(state.scoreboard.draws).toBe(1);
      expect(state.scoreboard.xWins).toBe(0);
      expect(state.scoreboard.oWins).toBe(0);
    });

    it('rejects moves after game completion', () => {
      // Win the game
      let state = gameReducer(initialState, { type: 'MAKE_MOVE', index: 0 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 3 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 1 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 4 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 2 });
      expect(state.status).toBe('Won');

      // Attempt additional move
      const nextState = gameReducer(state, { type: 'MAKE_MOVE', index: 8 });
      expect(nextState).toBe(state);
      expect(nextState.board[8]).toBeNull();
      expect(nextState.scoreboard.xWins).toBe(1); // not incremented again
    });
  });

  describe('UNDO_MOVE', () => {
    it('removes the latest move in Two Player mode', () => {
      let state = gameReducer(initialState, { type: 'MAKE_MOVE', index: 0 }); // X moves 0
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 4 }); // O moves 4
      expect(state.board[4]).toBe('O');
      expect(state.currentPlayer).toBe('X');

      const undoneState = gameReducer(state, { type: 'UNDO_MOVE' });
      expect(undoneState.board[4]).toBeNull();
      expect(undoneState.board[0]).toBe('X');
      expect(undoneState.currentPlayer).toBe('O');
      expect(undoneState.moveHistory).toHaveLength(1);
    });

    it('removes human and computer turns together in Computer mode', () => {
      const computerInitial = createInitialState('computer');
      // Human X plays 0
      let state = gameReducer(computerInitial, { type: 'MAKE_MOVE', index: 0 });
      // Computer O plays 4
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 4 });

      expect(state.moveHistory).toHaveLength(2);
      expect(state.board[0]).toBe('X');
      expect(state.board[4]).toBe('O');

      // Undo removes both
      const undoneState = gameReducer(state, { type: 'UNDO_MOVE' });
      expect(undoneState.board[0]).toBeNull();
      expect(undoneState.board[4]).toBeNull();
      expect(undoneState.moveHistory).toHaveLength(0);
      expect(undoneState.currentPlayer).toBe('X');
    });

    it('does nothing when move history is empty', () => {
      const state = gameReducer(initialState, { type: 'UNDO_MOVE' });
      expect(state).toBe(initialState);
    });

    it('disables undo after game completion (Option A)', () => {
      // Complete game
      let state = gameReducer(initialState, { type: 'MAKE_MOVE', index: 0 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 3 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 1 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 4 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 2 });
      expect(state.status).toBe('Won');

      const afterUndo = gameReducer(state, { type: 'UNDO_MOVE' });
      expect(afterUndo).toBe(state);
      expect(afterUndo.status).toBe('Won');
      expect(afterUndo.board[2]).toBe('X');
    });
  });

  describe('RESET_GAME', () => {
    it('clears board and move history while preserving scoreboard and mode', () => {
      let state = gameReducer(initialState, { type: 'MAKE_MOVE', index: 0 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 3 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 1 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 4 });
      state = gameReducer(state, { type: 'MAKE_MOVE', index: 2 });
      expect(state.status).toBe('Won');
      expect(state.scoreboard.xWins).toBe(1);

      const resetState = gameReducer(state, { type: 'RESET_GAME' });
      expect(resetState.board.every((c) => c === null)).toBe(true);
      expect(resetState.moveHistory).toHaveLength(0);
      expect(resetState.status).toBe('InProgress');
      expect(resetState.winner).toBeNull();
      expect(resetState.winningCells).toEqual([]);
      expect(resetState.currentPlayer).toBe('X');
      expect(resetState.mode).toBe('twoPlayer');
      expect(resetState.scoreboard.xWins).toBe(1); // Scoreboard preserved!
    });
  });

  describe('SET_MODE', () => {
    it('switches game mode, resets the board, and preserves scoreboard', () => {
      const stateWithScore: GameState = {
        ...initialState,
        scoreboard: { xWins: 3, oWins: 2, draws: 1 },
      };
      const playedState = gameReducer(stateWithScore, { type: 'MAKE_MOVE', index: 0 });
      expect(playedState.board[0]).toBe('X');

      const switchedState = gameReducer(playedState, { type: 'SET_MODE', mode: 'computer' });
      expect(switchedState.mode).toBe('computer');
      expect(switchedState.board.every((c) => c === null)).toBe(true);
      expect(switchedState.currentPlayer).toBe('X');
      expect(switchedState.scoreboard).toEqual({ xWins: 3, oWins: 2, draws: 1 });
    });

    it('does nothing if same mode is selected', () => {
      const state = gameReducer(initialState, { type: 'SET_MODE', mode: 'twoPlayer' });
      expect(state).toBe(initialState);
    });
  });

  describe('RESET_SCOREBOARD', () => {
    it('sets all scores to zero and updates localStorage', () => {
      const stateWithScore: GameState = {
        ...initialState,
        scoreboard: { xWins: 5, oWins: 4, draws: 3 },
      };
      const resetState = gameReducer(stateWithScore, { type: 'RESET_SCOREBOARD' });
      expect(resetState.scoreboard).toEqual({ xWins: 0, oWins: 0, draws: 0 });
    });
  });

  describe('localStorage persistence', () => {
    it('restores scores from localStorage in createInitialState', () => {
      localStorage.setItem(
        SCOREBOARD_STORAGE_KEY,
        JSON.stringify({ xWins: 7, oWins: 3, draws: 2 })
      );

      const loadedState = createInitialState('twoPlayer');
      expect(loadedState.scoreboard).toEqual({ xWins: 7, oWins: 3, draws: 2 });
    });

    it('handles corrupted localStorage data gracefully', () => {
      localStorage.setItem(SCOREBOARD_STORAGE_KEY, '{ invalid json');
      const loadedState = createInitialState('twoPlayer');
      expect(loadedState.scoreboard).toEqual({ xWins: 0, oWins: 0, draws: 0 });
    });
  });
});

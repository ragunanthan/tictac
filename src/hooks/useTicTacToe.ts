import { useCallback, useEffect, useReducer } from 'react';
import { createInitialState, gameReducer } from '../game/gameReducer';
import { getComputerMove } from '../game/computerPlayer';
import type { GameMode, GameState } from '../types/game.types';

export interface UseTicTacToeReturn extends GameState {
  isComputerThinking: boolean;
  canUndo: boolean;
  makeMove: (index: number) => void;
  undoMove: () => void;
  resetGame: () => void;
  setMode: (mode: GameMode) => void;
  resetScoreboard: () => void;
}

export function useTicTacToe(initialMode: GameMode = 'twoPlayer'): UseTicTacToeReturn {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialMode,
    (mode) => createInitialState(mode)
  );

  // In computer mode, computer is thinking whenever it is O's turn and game is InProgress
  const isComputerThinking =
    state.mode === 'computer' &&
    state.status === 'InProgress' &&
    state.currentPlayer === 'O';

  // Schedule computer move with natural delay (400ms)
  useEffect(() => {
    if (isComputerThinking) {
      const timer = setTimeout(() => {
        const nextMove = getComputerMove(state.board);
        if (nextMove !== null) {
          dispatch({ type: 'MAKE_MOVE', index: nextMove });
        }
      }, 400);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isComputerThinking, state.board]);

  const makeMove = useCallback(
    (index: number) => {
      // Disallow moves while computer is processing or if not human turn
      if (isComputerThinking) {
        return;
      }
      if (state.mode === 'computer' && state.currentPlayer !== 'X') {
        return;
      }
      dispatch({ type: 'MAKE_MOVE', index });
    },
    [isComputerThinking, state.mode, state.currentPlayer]
  );

  const undoMove = useCallback(() => {
    if (isComputerThinking) {
      return;
    }
    dispatch({ type: 'UNDO_MOVE' });
  }, [isComputerThinking]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const setMode = useCallback((mode: GameMode) => {
    dispatch({ type: 'SET_MODE', mode });
  }, []);

  const resetScoreboard = useCallback(() => {
    dispatch({ type: 'RESET_SCOREBOARD' });
  }, []);

  const canUndo =
    state.status === 'InProgress' &&
    state.moveHistory.length > 0 &&
    !isComputerThinking;

  return {
    ...state,
    isComputerThinking,
    canUndo,
    makeMove,
    undoMove,
    resetGame,
    setMode,
    resetScoreboard,
  };
}

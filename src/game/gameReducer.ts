import type { Cell, GameAction, GameMode, GameState, Move, Scoreboard } from '../types/game.types';
import { checkDraw, checkWinner, indexToRowCol } from './gameRules';
import { clearScoreboard, loadScoreboard, saveScoreboard } from '../utils/storage';

export const INITIAL_BOARD: readonly Cell[] = Array(9).fill(null);

export function createInitialState(
  mode: GameMode = 'twoPlayer',
  scoreboard?: Scoreboard
): GameState {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    mode,
    status: 'InProgress',
    winner: null,
    winningCells: [],
    moveHistory: [],
    scoreboard: scoreboard ?? loadScoreboard(),
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MAKE_MOVE': {
      const { index } = action;

      // Reject invalid index
      if (index < 0 || index > 8) {
        return state;
      }

      // Reject move if game is already over
      if (state.status !== 'InProgress') {
        return state;
      }

      // Reject move if cell is already occupied
      if (state.board[index] !== null) {
        return state;
      }

      const newBoard: Cell[] = [...state.board];
      newBoard[index] = state.currentPlayer;

      const { row, column } = indexToRowCol(index);
      const newMove: Move = {
        moveNumber: state.moveHistory.length + 1,
        player: state.currentPlayer,
        row,
        column,
        cellIndex: index,
      };
      const newMoveHistory = [...state.moveHistory, newMove];

      // Check win condition
      const winResult = checkWinner(newBoard);
      if (winResult) {
        const updatedScoreboard: Scoreboard = {
          ...state.scoreboard,
          xWins: winResult.winner === 'X' ? state.scoreboard.xWins + 1 : state.scoreboard.xWins,
          oWins: winResult.winner === 'O' ? state.scoreboard.oWins + 1 : state.scoreboard.oWins,
        };
        saveScoreboard(updatedScoreboard);

        return {
          ...state,
          board: newBoard,
          moveHistory: newMoveHistory,
          status: 'Won',
          winner: winResult.winner,
          winningCells: winResult.line,
          scoreboard: updatedScoreboard,
        };
      }

      // Check draw condition
      if (checkDraw(newBoard)) {
        const updatedScoreboard: Scoreboard = {
          ...state.scoreboard,
          draws: state.scoreboard.draws + 1,
        };
        saveScoreboard(updatedScoreboard);

        return {
          ...state,
          board: newBoard,
          moveHistory: newMoveHistory,
          status: 'Draw',
          winner: null,
          winningCells: [],
          scoreboard: updatedScoreboard,
        };
      }

      // Turn switches to next player
      return {
        ...state,
        board: newBoard,
        moveHistory: newMoveHistory,
        currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
      };
    }

    case 'UNDO_MOVE': {
      // Option A: Undo is disabled once game is completed (Won or Draw)
      if (state.status !== 'InProgress') {
        return state;
      }

      if (state.moveHistory.length === 0) {
        return state;
      }

      if (state.mode === 'twoPlayer') {
        // Revert 1 move
        const lastMove = state.moveHistory[state.moveHistory.length - 1];
        const newBoard = [...state.board];
        newBoard[lastMove.cellIndex] = null;

        return {
          ...state,
          board: newBoard,
          moveHistory: state.moveHistory.slice(0, -1),
          currentPlayer: lastMove.player,
        };
      }

      // Computer mode: revert full round (human X + computer O)
      const lastMove = state.moveHistory[state.moveHistory.length - 1];
      const newBoard = [...state.board];

      if (lastMove.player === 'O' && state.moveHistory.length >= 2) {
        const secondLastMove = state.moveHistory[state.moveHistory.length - 2];
        newBoard[lastMove.cellIndex] = null;
        newBoard[secondLastMove.cellIndex] = null;

        return {
          ...state,
          board: newBoard,
          moveHistory: state.moveHistory.slice(0, -2),
          currentPlayer: 'X',
        };
      }

      // Only human had moved (or single move)
      newBoard[lastMove.cellIndex] = null;
      return {
        ...state,
        board: newBoard,
        moveHistory: state.moveHistory.slice(0, -1),
        currentPlayer: 'X',
      };
    }

    case 'RESET_GAME': {
      return {
        ...state,
        board: Array(9).fill(null),
        currentPlayer: 'X',
        status: 'InProgress',
        winner: null,
        winningCells: [],
        moveHistory: [],
        // Preserves mode & scoreboard!
      };
    }

    case 'SET_MODE': {
      if (state.mode === action.mode) {
        return state;
      }
      return {
        ...state,
        mode: action.mode,
        board: Array(9).fill(null),
        currentPlayer: 'X',
        status: 'InProgress',
        winner: null,
        winningCells: [],
        moveHistory: [],
        // Preserves scoreboard!
      };
    }

    case 'RESET_SCOREBOARD': {
      const resetScore = clearScoreboard();
      return {
        ...state,
        scoreboard: resetScore,
      };
    }

    case 'LOAD_SCOREBOARD': {
      return {
        ...state,
        scoreboard: action.scoreboard,
      };
    }

    default:
      return state;
  }
}

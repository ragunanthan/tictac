import React from 'react';
import type { GameMode, Player } from '../types/game.types';

interface GameStatusProps {
  status: 'InProgress' | 'Won' | 'Draw';
  winner: Player | null;
  currentPlayer: Player;
  isComputerThinking: boolean;
  mode: GameMode;
  onResetGame: () => void;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  status,
  winner,
  currentPlayer,
  isComputerThinking,
  mode,
  onResetGame,
}) => {
  // Centered status text displayed directly below the score cards (e.g. "Game Over" or "Player X's turn")
  const statusText =
    status === 'Won' || status === 'Draw'
      ? 'Game Over'
      : isComputerThinking
      ? 'Computer is thinking...'
      : mode === 'computer'
      ? currentPlayer === 'X'
        ? 'Your turn'
        : "Computer's turn"
      : `Player ${currentPlayer}'s turn`;

  return (
    <div className="w-full text-center my-2">
      <p className="text-xs sm:text-sm font-medium text-slate-400">
        {statusText}
      </p>

      {/* When game is won, celebration overlay banner matching Screenshot 1 */}
      {status === 'Won' && winner && (
        <div className="w-full max-w-[340px] sm:max-w-[380px] mx-auto mt-2.5 rounded-2xl bg-board-bg p-7 text-center shadow-lg animate-fade-in select-none">
          {winner === 'O' ? (
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[12px] sm:border-[14px] border-mark-o mx-auto shadow-sm"
              aria-hidden="true"
            />
          ) : (
            <div
              className="text-7xl sm:text-8xl font-black text-mark-x leading-none mx-auto select-none"
              aria-hidden="true"
            >
              ✕
            </div>
          )}

          <h2 className="text-3xl sm:text-4xl font-black tracking-wider text-mark-x mt-3 uppercase">
            WINNER!
          </h2>
        </div>
      )}

      {/* When game is draw */}
      {status === 'Draw' && (
        <div className="w-full max-w-[340px] sm:max-w-[380px] mx-auto mt-2.5 rounded-2xl bg-board-bg p-7 text-center shadow-lg animate-fade-in select-none">
          <div className="text-5xl select-none" aria-hidden="true">
            🤝
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-wider text-mark-x mt-2 uppercase">
            IT'S A DRAW!
          </h2>
        </div>
      )}

      {/* "Restart game" link below banner when game is finished */}
      {(status === 'Won' || status === 'Draw') && (
        <button
          type="button"
          onClick={onResetGame}
          className="mt-3 text-sm font-bold text-board-bg hover:text-board-hover transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Restart game
        </button>
      )}
    </div>
  );
};

import React from 'react';
import type { GameMode, Player, Scoreboard as ScoreboardType } from '../types/game.types';

interface ScoreboardProps {
  scoreboard: ScoreboardType;
  currentPlayer: Player;
  gameStatus: 'InProgress' | 'Won' | 'Draw';
  winner: Player | null;
  mode: GameMode;
  onResetScoreboard: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  scoreboard,
  currentPlayer,
  gameStatus,
  winner,
  mode,
  onResetScoreboard,
}) => {
  const isXActive = (gameStatus === 'InProgress' && currentPlayer === 'X') || (gameStatus === 'Won' && winner === 'X');
  const isOActive = (gameStatus === 'InProgress' && currentPlayer === 'O') || (gameStatus === 'Won' && winner === 'O');

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top row with score cards matching reference screenshot */}
      <div className="flex items-center justify-center gap-3 w-full">
        {/* Player X Card */}
        <div
          className={`flex-1 max-w-[150px] flex items-center justify-between px-4 py-2 rounded-xl bg-card-bg border transition-all ${
            isXActive
              ? 'border-card-border border-b-2 border-b-board-bg'
              : 'border-card-border'
          }`}
        >
          <span className="text-lg font-black text-slate-100 flex items-center gap-1.5">
            ✕
            <span className="text-xs font-normal text-slate-400">
              {mode === 'computer' ? 'You' : ''}
            </span>
          </span>
          <span className="text-xl font-bold text-slate-100 tabular-nums">
            {scoreboard.xWins}
          </span>
        </div>

        {/* Player O Card */}
        <div
          className={`flex-1 max-w-[150px] flex items-center justify-between px-4 py-2 rounded-xl bg-card-bg border transition-all ${
            isOActive
              ? 'border-card-border border-b-2 border-b-board-bg'
              : 'border-card-border'
          }`}
        >
          <span className="text-lg font-black text-mark-o flex items-center gap-1.5">
            ◯
            <span className="text-xs font-normal text-slate-400">
              {mode === 'computer' ? 'Bot' : ''}
            </span>
          </span>
          <span className="text-xl font-bold text-slate-100 tabular-nums">
            {scoreboard.oWins}
          </span>
        </div>
      </div>

      {/* Subtitle row: Draws & Reset Button */}
      <div className="flex items-center justify-between w-full max-w-[310px] mt-2 px-1 text-xs text-slate-400">
        <span>Draws: <strong className="text-slate-300 font-mono">{scoreboard.draws}</strong></span>
        <button
          type="button"
          onClick={onResetScoreboard}
          title="Reset Scores to 0"
          className="hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
        >
          <svg
            className="w-3 h-3 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Reset
        </button>
      </div>
    </div>
  );
};

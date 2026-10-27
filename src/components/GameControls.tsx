import React from 'react';

interface GameControlsProps {
  canUndo: boolean;
  onResetGame: () => void;
  onUndoMove: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  canUndo,
  onResetGame,
  onUndoMove,
}) => {
  return (
    <div className="flex items-center justify-center gap-2.5 w-full max-w-[340px] sm:max-w-[380px] mx-auto mt-3.5">
      {/* Undo Button */}
      <button
        type="button"
        onClick={onUndoMove}
        disabled={!canUndo}
        className={`flex-1 flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg font-medium text-xs sm:text-sm border transition-colors ${
          canUndo
            ? 'bg-btn-control hover:bg-btn-control-hover text-slate-200 border-btn-control-border cursor-pointer'
            : 'bg-btn-control-disabled text-slate-600 border-btn-control-disabled-border cursor-not-allowed opacity-50'
        }`}
      >
        <svg
          className="w-3.5 h-3.5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 10h10a5 5 0 015 5v2m0 0l-4-4m4 4l4-4M3 10l4-4m-4 4l4 4"
          />
        </svg>
        <span>Undo Move</span>
      </button>

      {/* Reset Game Button */}
      <button
        type="button"
        onClick={onResetGame}
        className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg font-medium text-xs sm:text-sm bg-board-bg hover:bg-board-hover text-slate-900 font-bold transition-colors cursor-pointer shadow-sm"
      >
        <svg
          className="w-3.5 h-3.5 text-slate-900"
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
        <span>Reset Game</span>
      </button>
    </div>
  );
};

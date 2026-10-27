import React from 'react';
import type { GameMode } from '../types/game.types';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  disabled?: boolean;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  disabled = false,
}) => {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={currentMode}
        onChange={(e) => onSelectMode(e.target.value as GameMode)}
        disabled={disabled}
        aria-label="Select Game Mode"
        className="appearance-none bg-panel-muted hover:bg-panel-hover text-slate-200 text-xs sm:text-sm font-semibold pl-3 pr-8 py-1.5 rounded-lg border border-panel-select-border cursor-pointer focus:outline-none focus:ring-1 focus:ring-board-bg transition-colors"
      >
        <option value="twoPlayer" className="bg-app-bg text-slate-200">
          2 Players
        </option>
        <option value="computer" className="bg-app-bg text-slate-200">
          vs Computer
        </option>
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
        ▾
      </div>
    </div>
  );
};

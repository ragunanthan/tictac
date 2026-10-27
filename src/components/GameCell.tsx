import React from 'react';
import type { Cell } from '../types/game.types';

interface GameCellProps {
  value: Cell;
  index: number;
  row: number;
  column: number;
  isWinningCell: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const GameCell: React.FC<GameCellProps> = ({
  value,
  row,
  column,
  isWinningCell,
  disabled,
  onClick,
}) => {
  const isClickable = !value && !disabled;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      aria-label={`Cell at Row ${row}, Column ${column}${value ? `, marked with ${value}` : ', empty'}${
        isWinningCell ? ', winning cell' : ''
      }`}
      className={`relative w-full h-full flex items-center justify-center transition-transform select-none ${
        isWinningCell
          ? 'scale-105 bg-white/15 rounded-xl'
          : isClickable
          ? 'hover:bg-black/5 active:scale-95 cursor-pointer rounded-xl'
          : ''
      } ${!isClickable && !value ? 'cursor-not-allowed opacity-60' : ''} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white`}
    >
      {value === 'X' && (
        <svg
          className="w-14 h-14 sm:w-16 sm:h-16 text-mark-x"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}

      {value === 'O' && (
        <svg
          className="w-14 h-14 sm:w-16 sm:h-16 text-mark-o"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="7.5" />
        </svg>
      )}
    </button>
  );
};

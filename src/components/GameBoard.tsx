import React from 'react';
import type { Cell } from '../types/game.types';
import { GameCell } from './GameCell';
import { indexToRowCol } from '../game/gameRules';

interface GameBoardProps {
  board: Cell[];
  winningCells: number[];
  disabled: boolean;
  onCellClick: (index: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  winningCells,
  disabled,
  onCellClick,
}) => {
  return (
    <div
      role="grid"
      aria-label="Tic Tac Toe board"
      className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-square rounded-2xl bg-board-bg overflow-hidden p-3 sm:p-4 mx-auto shadow-xl select-none"
    >
      {/* Authentic Tic Tac Toe Grid: 4 crossing lines with rounded ends */}
      {/* Horizontal Line 1 (between row 1 and 2) */}
      <div
        className="absolute left-6 right-6 h-[7px] rounded-full bg-board-grid pointer-events-none z-0"
        style={{ top: 'calc(33.333% - 3.5px)' }}
        aria-hidden="true"
      />
      {/* Horizontal Line 2 (between row 2 and 3) */}
      <div
        className="absolute left-6 right-6 h-[7px] rounded-full bg-board-grid pointer-events-none z-0"
        style={{ top: 'calc(66.666% - 3.5px)' }}
        aria-hidden="true"
      />
      {/* Vertical Line 1 (between col 1 and 2) */}
      <div
        className="absolute top-6 bottom-6 w-[7px] rounded-full bg-board-grid pointer-events-none z-0"
        style={{ left: 'calc(33.333% - 3.5px)' }}
        aria-hidden="true"
      />
      {/* Vertical Line 2 (between col 2 and 3) */}
      <div
        className="absolute top-6 bottom-6 w-[7px] rounded-full bg-board-grid pointer-events-none z-0"
        style={{ left: 'calc(66.666% - 3.5px)' }}
        aria-hidden="true"
      />

      {/* 9 Interactive Cells */}
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full relative z-10">
        {board.map((cellValue, index) => {
          const { row, column } = indexToRowCol(index);
          const isWinningCell = winningCells.includes(index);

          return (
            <GameCell
              key={index}
              index={index}
              row={row}
              column={column}
              value={cellValue}
              isWinningCell={isWinningCell}
              disabled={disabled}
              onClick={() => onCellClick(index)}
            />
          );
        })}
      </div>
    </div>
  );
};

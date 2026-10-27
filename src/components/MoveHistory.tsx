import React from 'react';
import type { Move } from '../types/game.types';

interface MoveHistoryProps {
  moves: Move[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  return (
    <div className="w-full bg-panel-bg border border-panel-border rounded-xl p-4 flex flex-col h-[260px] sm:h-[280px]">
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-subdivider">
        <h2 className="text-sm font-semibold text-slate-300">
          Move History
        </h2>
        <span className="text-xs text-slate-400 tabular-nums">
          {moves.length} {moves.length === 1 ? 'move' : 'moves'}
        </span>
      </div>

      {moves.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-500">
          <svg
            className="w-7 h-7 text-slate-600 mb-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          <p className="text-xs text-slate-400">No moves recorded yet</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Click any cell to start playing</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase text-slate-400 tracking-wider sticky top-0 bg-panel-bg py-1 border-b border-subdivider">
              <tr>
                <th scope="col" className="pb-1.5 pl-1 font-medium">#</th>
                <th scope="col" className="pb-1.5 font-medium">Player</th>
                <th scope="col" className="pb-1.5 text-right pr-1 font-medium">Position</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-row-border">
              {moves.map((move) => {
                const isX = move.player === 'X';
                return (
                  <tr
                    key={move.moveNumber}
                    className="hover:bg-row-hover transition-colors"
                  >
                    <td className="py-1.5 pl-1 text-slate-500 tabular-nums font-mono">
                      {move.moveNumber}
                    </td>
                    <td className="py-1.5">
                      <span
                        className={`inline-block font-semibold px-1.5 py-0.5 rounded text-[11px] ${
                          isX
                            ? 'bg-badge-bg text-slate-100'
                            : 'bg-badge-bg text-mark-o-badge'
                        }`}
                      >
                        {isX ? 'X' : 'O'}
                      </span>
                    </td>
                    <td className="py-1.5 text-right pr-1 text-slate-300 font-medium">
                      Row {move.row}, Col {move.column}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

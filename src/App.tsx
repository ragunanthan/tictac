import React from 'react';
import { useTicTacToe } from './hooks/useTicTacToe';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';
import { GameControls } from './components/GameControls';
import { GameModeSelector } from './components/GameModeSelector';
import { Scoreboard } from './components/Scoreboard';
import { MoveHistory } from './components/MoveHistory';
import './App.css';

export const App: React.FC = () => {
  const {
    board,
    currentPlayer,
    mode,
    status,
    winner,
    winningCells,
    moveHistory,
    scoreboard,
    isComputerThinking,
    canUndo,
    makeMove,
    undoMove,
    resetGame,
    setMode,
    resetScoreboard,
  } = useTicTacToe('twoPlayer');

  return (
    <div className="min-h-screen bg-app-bg text-slate-200 flex flex-col justify-start px-4 py-6 sm:px-6">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <header className="flex items-center justify-between mb-4 pb-3 border-b border-divider">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Tic Tac Toe
          </h1>
          <GameModeSelector
            currentMode={mode}
            onSelectMode={setMode}
            disabled={isComputerThinking}
          />
        </header>

        {/* Main Content Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-2">
          {/* Main Game Area */}
          <section
            aria-label="Game board and controls"
            className="lg:col-span-7 flex flex-col items-center w-full"
          >
            {/* Scoreboard bar directly above board, matching reference UI */}
            <Scoreboard
              scoreboard={scoreboard}
              currentPlayer={currentPlayer}
              gameStatus={status}
              winner={winner}
              mode={mode}
              onResetScoreboard={resetScoreboard}
            />

            {/* Status indicator / Victory Banner */}
            <GameStatus
              status={status}
              winner={winner}
              currentPlayer={currentPlayer}
              isComputerThinking={isComputerThinking}
              mode={mode}
              onResetGame={resetGame}
            />

            {/* 3x3 Turquoise Board (Screenshot 2 theme) */}
            <div className="w-full flex justify-center my-1">
              <GameBoard
                board={board}
                winningCells={winningCells}
                disabled={status !== 'InProgress' || isComputerThinking}
                onCellClick={makeMove}
              />
            </div>

            {/* Controls: Undo & Reset */}
            <GameControls
              canUndo={canUndo}
              onResetGame={resetGame}
              onUndoMove={undoMove}
            />
          </section>

          {/* Side Panel: Move History */}
          <aside
            aria-label="Move history"
            className="lg:col-span-5 flex flex-col gap-4 w-full max-w-[380px] lg:max-w-none mx-auto"
          >
            <MoveHistory moves={moveHistory} />
          </aside>
        </main>
      </div>
    </div>
  );
};

export default App;

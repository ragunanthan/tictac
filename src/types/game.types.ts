export type Player = 'X' | 'O';
export type Cell = Player | null;

export type GameMode = 'twoPlayer' | 'computer';

export type GameStatus = 'InProgress' | 'Won' | 'Draw';

export interface Move {
  moveNumber: number;
  player: Player;
  row: number; // 1-based: 1, 2, or 3
  column: number; // 1-based: 1, 2, or 3
  cellIndex: number; // 0-8
}

export interface Scoreboard {
  xWins: number;
  oWins: number;
  draws: number;
}

export interface GameState {
  board: Cell[];
  currentPlayer: Player;
  mode: GameMode;
  status: GameStatus;
  winner: Player | null;
  winningCells: number[];
  moveHistory: Move[];
  scoreboard: Scoreboard;
}

export type GameAction =
  | { type: 'MAKE_MOVE'; index: number }
  | { type: 'UNDO_MOVE' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_MODE'; mode: GameMode }
  | { type: 'RESET_SCOREBOARD' }
  | { type: 'LOAD_SCOREBOARD'; scoreboard: Scoreboard };

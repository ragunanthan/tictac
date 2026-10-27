# Tic Tac Toe – React.js + TypeScript

A modern, responsive, browser-based Tic Tac Toe application built with React.js, TypeScript, Vite, and Tailwind CSS. The application supports two-player and rule-based computer modes, move history tracking, multi-mode undo, session scoreboard persistence, and victory celebration states.

---

## 1. Project Overview

This project was built as a clean, frontend-only technical interview assignment demonstrating production-grade React architecture.

Key capabilities:
- **Two Player Mode:** Alternate turns locally between Player X and Player O.
- **Play Against Computer:** Challenge a rule-based computer opponent that plays as O with human-like timing.
- **Move History:** Chronological log tracking move number, player, and 1-based board position (Row, Col).
- **Undo Last Move:** Dynamic undo supporting single-move rollback in Two Player mode and full round (Human + Computer) rollback in Computer mode.
- **Persistent Scoreboard:** Tracks X Wins, O Wins, and Draws in `localStorage` across page refreshes.
- **Independent Controls:** Reset the current game without clearing scores, or reset the scoreboard independently.
- **Deterministic Win & Draw Detection:** Automatic win detection highlighting the 3 winning cells and vibrant celebratory state.

> **Zero Backend Dependencies:** Pure clientside execution with no REST APIs, databases, or server-side frameworks.

---

## 2. Technology Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | React.js 19 (Functional Components) |
| **Language** | TypeScript (Strict Mode) |
| **Build Tool & Bundler** | Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **State Management** | React Hooks (`useReducer`, `useCallback`, `useEffect`) |
| **Data Persistence** | Browser `localStorage` with fallback and schema validation |
| **Testing** | Vitest + React Testing Library + `@testing-library/jest-dom` |
| **Package Manager** | npm |

---

## 3. Features

- **Standard 3 × 3 Grid:** 9 interactive cells with SVG marks for X and O, accessible `aria-label` attributes, keyboard navigation (`Enter`/`Space`), and visible focus rings.
- **Interactive States & Hover Effects:** Cells display distinct hover highlights when available, and are disabled when occupied or when the game is finished.
- **Computer Opponent:** Heuristic priority algorithm (Win → Block → Center → Corner → Side) executing with an authentic 400ms thinking delay.
- **Safe Asynchronous Opponent Handling:** Timers are cleanly canceled on game reset, mode change, or component unmount to prevent stale moves on clean boards.
- **Victory & Draw Banners:** Prominent celebration banner featuring the winner's emblem and a quick "Restart game" button.
- **Winning Cell Highlights:** Glowing emerald animation highlights the exact row, column, or diagonal that clinched victory.
- **Fully Responsive Design:** Adapts fluidly between mobile screens and desktop workstations using CSS container/grid layouts.

---

## 4. Local Setup & Scripts

### Prerequisites
- Node.js: 20+ (tested on Node v24)
- npm: 10+

### Installation
```bash
# Clone the repository and install dependencies
git clone https://github.com/your-username/tictac.git
cd tictac
npm install
```

### Running Locally (Development)
```bash
npm run dev
```
Starts the Vite development server with Hot Module Replacement (HMR) at `http://localhost:5173/`.

### Running Tests
```bash
# Run all unit and integration tests once
npm run test

# Run tests in watch mode during development
npm run test:watch
```

### Type Checking & Linting
```bash
npm run lint
```

### Production Build & Preview
```bash
# Compile TypeScript and bundle production assets
npm run build

# Preview the production build locally
npm run preview
```

---

## 5. Architecture

```text
src/
├── components/           # Presentational and interactive UI components
│   ├── GameBoard.tsx     # 3x3 responsive grid container (role="grid")
│   ├── GameCell.tsx      # Individual accessible clickable cell
│   ├── GameStatus.tsx    # Live turn tracker & victory celebration banner
│   ├── GameControls.tsx  # Reset Game and Undo Last Move buttons
│   ├── GameModeSelector.tsx # Segmented 2-player vs computer toggle
│   ├── MoveHistory.tsx   # Chronological move table with empty state
│   └── Scoreboard.tsx    # Session score cards with active turn highlight
│
├── game/                 # Pure domain business logic & state reducer
│   ├── gameRules.ts      # Pure functions for win combinations, draw check, row/col
│   ├── gameReducer.ts    # Reducer handling immutable state transitions
│   └── computerPlayer.ts # Deterministic rule-based priority AI
│
├── hooks/
│   └── useTicTacToe.ts   # Custom hook coordinating state, effects, and timers
│
├── utils/
│   └── storage.ts        # Robust localStorage wrapper with JSON schema validation
│
├── types/
│   └── game.types.ts     # TypeScript interfaces and union types
│
├── tests/                # Automated Vitest test suites
│   ├── gameRules.test.ts
│   ├── computerPlayer.test.ts
│   ├── gameReducer.test.ts
│   ├── GameBoard.test.tsx
│   └── useTicTacToe.test.ts
│
├── App.tsx               # Top-level page layout
├── main.tsx              # Application entrypoint
└── index.css             # Tailwind CSS tokens and scrollbar utilities
```

### 1. Game State Management
All game transitions are orchestrated via `gameReducer` inside `src/game/gameReducer.ts` using `useReducer`. The state structure is strictly typed:
```ts
interface GameState {
  board: Cell[];
  currentPlayer: Player;
  mode: GameMode;
  status: GameStatus;
  winner: Player | null;
  winningCells: number[];
  moveHistory: Move[];
  scoreboard: Scoreboard;
}
```

### 2. Game Rules & Validation (`gameRules.ts`)
Win conditions evaluate all 8 combinations (3 rows, 3 columns, 2 diagonals). Draw condition ensures all 9 cells are occupied while verifying `checkWinner(board) === null`.

### 3. Computer Opponent Algorithm (`computerPlayer.ts`)
The computer opponent plays as `O` and executes a deterministic 5-tier priority hierarchy:
1. **Win:** If `O` can complete 3-in-a-row on this move, take it.
2. **Block:** If `X` has 2-in-a-row, block the winning cell.
3. **Center:** Select index `4` (center) if available.
4. **Corner:** Select first available corner from `[0, 2, 6, 8]`.
5. **Remaining Cell:** Select first available side from `[1, 3, 5, 7]`.

### 4. Move History and Undo
- **Two Player Mode:** Rolls back 1 move, returns turn to the previous player.
- **Computer Mode:** Rolls back the full human + computer round (2 moves) so the human remains `X` without having to manually undo computer moves.

### 5. Scoreboard Persistence (`storage.ts`)
Scores are synced to `localStorage` under `tic_tac_toe_scoreboard`. Corrupted JSON or unexpected field types trigger an automatic fallback to `{ xWins: 0, oWins: 0, draws: 0 }`.

---

## 6. Design Decisions

1. **Why `useReducer` over multiple `useState` calls?**
   Tic Tac Toe involves interrelated state properties (`board`, `currentPlayer`, `status`, `moveHistory`, `scoreboard`). Grouping updates in a single pure reducer guarantees atomic state updates and prevents desynchronization.
2. **Separation of Rules from Components:**
   `gameRules.ts` and `computerPlayer.ts` contain zero React dependencies. They are pure TypeScript functions, making them 100% deterministic and trivial to test in isolation.
3. **Option A: Disable Undo After Game Completion:**
   Once a game reaches `Won` or `Draw`, Undo is disabled and the score is finalized. This eliminates race conditions where users could roll back scores after completion.
4. **Preventing Duplicate Score Updates:**
   Scores are only incremented inside the reducer when a move triggers a transition from `InProgress` to `Won` or `Draw`. Subsequent moves on a completed board are rejected.
5. **Safe Asynchronous Computer Moves:**
   `useTicTacToe` binds the 400ms computer move timer to an effect with a cleanup callback. Resetting the board or switching modes immediately cancels pending timers, guaranteeing that the computer never plays onto a fresh game.

---

## 7. AI-Assisted Development

For a detailed chronicle of prompt interactions, design trade-offs, code validations, and human review steps, refer to [AI_WORKFLOW.md](file:///Users/ragu/Desktop/MyRepo/tictac/AI_WORKFLOW.md).

---

## 8. Known Limitations

- **Clientside Only:** No cloud synchronization or backend database; game runs 100% in the user's browser.
- **Device-Specific Scores:** Scoreboard is stored in the local browser's `localStorage`; clearing browser cookies/storage resets the tally.
- **Rule-Based Opponent:** The computer uses deterministic heuristic priorities rather than an unbeatable minimax algorithm, allowing strategic human victories.
- **Local Multiplayer Only:** Two-player mode is designed for turn-taking on a single shared screen.

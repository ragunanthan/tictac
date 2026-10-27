# Tic Tac Toe – React.js Frontend Interview Assignment

## 1. Project Overview

Build a modern, responsive, browser-based **Tic Tac Toe application using React.js and TypeScript**.

The application should allow users to:

- Play Tic Tac Toe in Two Player Mode.
- Play against a basic computer opponent.
- Track moves and view move history.
- Undo previous moves.
- Maintain a scoreboard.
- Reset the current game.
- Reset the scoreboard separately.
- Detect wins and draws automatically.

**Important:** This is a frontend-only application. Do not create or integrate any backend services, REST APIs, databases, or server-side logic.

All game logic, state management, validation, move history, and scoreboard functionality must be implemented in React using TypeScript.

The solution should be clean, maintainable, easy to test, and suitable for a technical interview demonstration.

---

## 2. Technology Stack

Use the following technologies:

| Category | Technology |
|---|---|
| Frontend | React.js |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| State Management | React Hooks (`useState`, `useReducer`) |
| Persistence | Browser localStorage |
| Testing | Vitest + React Testing Library |
| Source Control | GitHub |
| Package Manager | npm |

### Technical Constraints

- Use functional React components only.
- Use TypeScript with strict type checking.
- Do not use a backend.
- Do not create REST APIs.
- Do not use a database.
- Do not use Next.js or server-side rendering.
- Do not use Redux unless absolutely necessary.
- Avoid unnecessary external dependencies.
- Keep game rules separate from UI components.
- Follow clean code principles and reusable component patterns.

---

## 3. Functional Requirements

### 3.1 Game Board

Create a standard 3 × 3 Tic Tac Toe board.

Requirements:

- Display nine clickable cells in a 3 × 3 grid.
- Each empty cell can be selected.
- When selected, the cell displays X or O.
- Occupied cells cannot be selected again.
- Invalid selections must not change the game state.
- Disable board interaction when the game is completed.
- Highlight winning cells.
- Provide hover effects for available cells.
- Make the board responsive for laptop and mobile screens.

### 3.2 Player Turns

Support two players:

- Player X
- Player O

Rules:

- Player X always starts a new game.
- Players alternate turns after every valid move.
- Clearly display the current player's turn.
- Invalid moves must not change the current player.
- Once the game ends, no additional moves are allowed.

### 3.3 Win Detection

Detect a winner when a player completes any of the following:

- One complete row.
- One complete column.
- One diagonal.

There are eight possible winning combinations.

When a player wins:

- Display the winning player.
- Highlight the three winning cells.
- Disable further moves.
- Update the scoreboard exactly once.
- Display a clear victory message.

### 3.4 Draw Detection

If all nine cells are occupied and neither player has won, declare a draw.

When the game ends in a draw:

- Display a draw message.
- Disable further moves.
- Update the draw count exactly once.
- Keep the completed board visible until reset.

### 3.5 Reset Game

Provide a **Reset Game** button.

Reset Game must:

- Clear all nine cells.
- Clear move history.
- Clear winner and draw status.
- Set the current player to X.
- Start a new game using the currently selected mode.
- Preserve the scoreboard.

### 3.6 Move History

Display the move history for the current game.

Each move should contain:

- Move number.
- Player (X or O).
- Row number.
- Column number.

Example:

| Move | Player | Position |
|---|---|---|
| 1 | X | Row 1, Column 1 |
| 2 | O | Row 2, Column 2 |
| 3 | X | Row 1, Column 2 |

Requirements:

- Update history after every valid move.
- Display moves in chronological order.
- Clear history when the game resets.
- Remove undone moves from history.
- Show a friendly empty state when no moves exist.

### 3.7 Undo Last Move

Provide an **Undo Last Move** button.

Undo should restore the previous valid game state.

#### Two Player Mode

- Remove only the most recent move.
- Restore the previous board state.
- Restore the correct player's turn.
- Update move history.
- Disable Undo when no moves exist.

Example:

1. X makes a move.
2. O makes a move.
3. User clicks Undo.
4. O's move is removed.
5. It becomes O's turn again.

#### Computer Mode

- Human plays as X.
- Computer plays as O.
- Undo should remove the latest human/computer turn together.
- Restore the board to the state before the human move.
- Restore the turn to X.
- Update move history correctly.
- Prevent Undo while the computer is processing its move.

If the human move ends the game before the computer responds, Undo should remove that human move.

### 3.8 Scoreboard

Maintain a session-level scoreboard.

Track:

- X Wins
- O Wins
- Draws

Requirements:

- Update scores when a game is completed.
- Increment the appropriate score exactly once.
- Reset Game must preserve the scoreboard.
- Provide a separate Reset Scoreboard button.
- Reset Scoreboard must set all counts to zero.
- Persist scoreboard values in localStorage.
- Restore saved scores when the browser refreshes.
- Handle missing or corrupted localStorage data gracefully.

#### Undo and Scoreboard Decision

Use **Option A: Disable Undo After Game Completion**.

Once a game is won or drawn:

- Disable Undo.
- Finalize the scoreboard result.
- Allow users to start another game through Reset Game.

This approach simplifies scoreboard consistency and makes the implementation easier to explain during an interview.

### 3.9 Game Modes

Provide two modes:

1. Two Player Mode
2. Play Against Computer

Use a segmented control, tabs, or toggle to switch between modes.

Changing the game mode must start a fresh game while preserving the scoreboard.

#### Two Player Mode

- Both X and O are controlled by users.
- Turns alternate after valid moves.
- All game rules apply normally.

#### Play Against Computer

- Human player is X.
- Computer player is O.
- Human always plays first.
- After a valid human move, the computer automatically selects an available cell.
- The computer must never select an occupied cell.
- The computer must not play after the game is completed.
- The user must not make another move while the computer is processing.

### 3.10 Computer Move Algorithm

Implement a basic rule-based computer opponent.

The computer must follow this priority:

1. **Win:** If O can win in the next move, select that cell.
2. **Block:** If X can win in the next move, block that cell.
3. **Center:** Select the center cell if available.
4. **Corner:** Select an available corner.
5. **Remaining Cell:** Select any other available cell.

Additional requirements:

- Keep the computer move algorithm in a separate utility function.
- Use deterministic selection for equally preferred moves.
- Do not use external AI APIs.
- Do not use machine learning.
- Ensure the algorithm always returns a valid available position when a move is possible.

Optionally, introduce a short delay of 300–500 ms to make the computer move feel natural. Ensure pending moves are cancelled when the game resets, the mode changes, or the component unmounts.

---

## 4. State Management

Use React Hooks and TypeScript for game state management.

Prefer `useReducer` for managing related game state transitions.

Suggested state structure:

```ts
type Player = "X" | "O";
type Cell = Player | null;

type GameMode = "twoPlayer" | "computer";

type GameStatus = "InProgress" | "Won" | "Draw";

interface Move {
  moveNumber: number;
  player: Player;
  row: number;
  column: number;
}

interface Scoreboard {
  xWins: number;
  oWins: number;
  draws: number;
}

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

### State Management Requirements

- Use a single predictable source of truth.
- Avoid duplicate or conflicting state.
- Keep state updates immutable.
- Keep game rules independent of React rendering.
- Use pure functions for win detection, draw detection, and computer move selection.
- Prevent duplicate score updates.
- Avoid stale closures and unnecessary effects.
- Make state transitions easy to test.

---

## 5. Suggested Project Structure

```text
tic-tac-toe/
├── public/
├── src/
│   ├── components/
│   │   ├── GameBoard.tsx
│   │   ├── GameCell.tsx
│   │   ├── GameStatus.tsx
│   │   ├── GameControls.tsx
│   │   ├── GameModeSelector.tsx
│   │   ├── MoveHistory.tsx
│   │   └── Scoreboard.tsx
│   │
│   ├── hooks/
│   │   └── useTicTacToe.ts
│   │
│   ├── game/
│   │   ├── gameReducer.ts
│   │   ├── gameRules.ts
│   │   └── computerPlayer.ts
│   │
│   ├── utils/
│   │   └── storage.ts
│   │
│   ├── types/
│   │   └── game.types.ts
│   │
│   ├── tests/
│   │   ├── gameRules.test.ts
│   │   ├── gameReducer.test.ts
│   │   ├── computerPlayer.test.ts
│   │   └── GameBoard.test.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

Keep the structure simple. Do not introduce unnecessary abstraction or overengineering.

---

## 6. UI/UX Requirements

Create a polished, modern interface suitable for an interview demonstration.

### Layout

The main screen should contain:

**Header**
- Application title: Tic Tac Toe
- Short subtitle
- Game mode selector

**Main Game Area**
- Current player indicator
- 3 × 3 game board
- Winner or draw message
- Reset Game button
- Undo Last Move button

**Side Panel**
- Scoreboard
- Reset Scoreboard button
- Move history

### Visual Design

- Use Tailwind CSS.
- Use a clean, modern visual style.
- Provide visually distinct X and O symbols.
- Highlight winning cells using a noticeable success color.
- Display disabled buttons clearly.
- Add subtle hover and transition effects.
- Provide an indicator when the computer is thinking.
- Use responsive layout with the board and side panel stacked on smaller screens.
- Maintain accessible color contrast.
- Support keyboard interaction and visible focus states.
- Provide accessible labels for board cells and game controls.

Avoid unnecessary animation libraries.

---

## 7. Testing Requirements

Use Vitest and React Testing Library.

Implement unit tests for the following scenarios:

| Test Case | Expected Result |
|---|---|
| Valid move | Cell updated |
| Occupied cell | Move rejected |
| Invalid cell index | Move rejected |
| Turn switching | X and O alternate |
| Row win | Winner detected |
| Column win | Winner detected |
| Diagonal win | Winner detected |
| Draw | Draw status returned |
| Reset Game | Board cleared |
| Undo Two Player | Latest move removed |
| Undo Computer | Human/computer turn removed |
| Scoreboard update | Correct result counted once |
| Reset Scoreboard | All scores reset |
| Computer winning move | Computer selects winning cell |
| Computer blocking move | Computer blocks X |
| Computer center priority | Center selected |
| Computer corner priority | Corner selected |
| Move after completion | Move rejected |
| Undo after completion | Undo disabled |
| Mode switching | Game resets, scores preserved |
| localStorage persistence | Scores restored |

Additional tests should verify that a pending computer move cannot modify a reset game.

Tests should focus on game behavior rather than implementation details.

---

## 8. README Requirements

Create a professional README.md containing:

### Project Overview
Explain the Tic Tac Toe application and its purpose.

### Technology Stack
List React, TypeScript, Vite, Tailwind CSS, Vitest, and React Testing Library.

### Features
Describe the implemented functionality.

### Local Setup

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Run Tests

```bash
npm run test
```

### Architecture

Explain:

- Component architecture.
- Game state management.
- Game rules and validation.
- Computer opponent algorithm.
- Move history and Undo implementation.
- Scoreboard persistence.

### Design Decisions

Document:

- Why React Hooks and `useReducer` were chosen.
- Why game logic is separated from UI components.
- Why localStorage is used.
- Why Undo is disabled after game completion.
- How scoreboard duplication is prevented.
- How asynchronous computer moves are handled safely.

### AI-Assisted Development

Include an `AI_WORKFLOW.md` file documenting:

- The requirement-to-specification process.
- Prompts used during development.
- Code initially generated with AI assistance.
- Areas reviewed or modified manually.
- Testing and validation performed.
- Assumptions and trade-offs.

Do not claim manual modifications or test results that have not actually occurred.

### Known Limitations

Document that:

- The application runs entirely in the browser.
- There is no backend or database.
- The scoreboard is browser-specific.
- Clearing browser storage removes saved scores.
- The computer uses rule-based logic rather than an unbeatable minimax algorithm.
- There is no online multiplayer functionality.

---

## 9. Acceptance Criteria

The implementation is considered complete when:

- [ ] React application runs locally.
- [ ] 3 × 3 board renders correctly.
- [ ] Two Player Mode works.
- [ ] Computer Mode works.
- [ ] Turns alternate correctly.
- [ ] Invalid moves are prevented.
- [ ] Win detection works.
- [ ] Draw detection works.
- [ ] Winning cells are highlighted.
- [ ] Move history is displayed.
- [ ] Undo works in Two Player Mode.
- [ ] Undo works in Computer Mode.
- [ ] Scoreboard updates correctly.
- [ ] Reset Game preserves the scoreboard.
- [ ] Reset Scoreboard clears the scores.
- [ ] Scoreboard persists across browser refreshes.
- [ ] Mode switching resets the board correctly.
- [ ] Core game logic tests pass.
- [ ] UI is responsive.
- [ ] README contains setup and testing instructions.
- [ ] No backend, REST API, or database is required.

---

## 10. Instructions for Google Antigravity

Act as a senior React.js engineer.

Implement this application using React.js, TypeScript, Vite, and Tailwind CSS.

Follow these implementation guidelines:

1. First review the complete requirements and create a short implementation plan.
2. Set up the React + TypeScript + Vite project.
3. Create reusable UI components.
4. Implement pure functions for game rules.
5. Implement game state management using `useReducer`.
6. Implement Two Player Mode.
7. Implement Computer Mode with the specified move priorities.
8. Implement Move History and Undo.
9. Implement the scoreboard with localStorage persistence.
10. Implement the responsive UI.
11. Write automated tests for core logic and UI behavior.
12. Run type checking, tests, and production build.
13. Fix errors discovered during validation.
14. Generate README.md and AI_WORKFLOW.md.

### Important Engineering Guidelines

- Do not generate any backend code.
- Do not create mock REST APIs.
- Do not create Express, Node.js server, or .NET projects.
- Do not introduce a database.
- Keep all game logic within the React frontend project.
- Do not use external APIs for computer moves.
- Do not add features outside the assignment scope.
- Prefer readable code over clever abstractions.
- Ensure the implementation is easy to explain during an interview.
- Do not mark requirements complete until they have been implemented and verified.
- Keep the application fully functional without an internet connection after its dependencies have been installed.

### Expected Final Deliverables

A complete, working React.js project containing:

- React components
- TypeScript types
- Game rules and computer opponent logic
- State management
- Move history and Undo functionality
- Scoreboard persistence
- Responsive UI
- Automated tests
- README.md
- AI_WORKFLOW.md

**Final Goal:** Deliver a clean, production-quality frontend-only Tic Tac Toe application that demonstrates strong React.js fundamentals, TypeScript knowledge, state management, component design, testing, and problem-solving skills during a technical interview.
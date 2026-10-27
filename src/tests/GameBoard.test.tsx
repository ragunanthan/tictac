import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameBoard } from '../components/GameBoard';
import type { Cell } from '../types/game.types';

describe('GameBoard Component', () => {
  it('renders 9 clickable cells with accessible labels', () => {
    const board: Cell[] = Array(9).fill(null);
    const handleCellClick = vi.fn();

    render(
      <GameBoard
        board={board}
        winningCells={[]}
        disabled={false}
        onCellClick={handleCellClick}
      />
    );

    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(9);

    // Click first cell
    fireEvent.click(cells[0]);
    expect(handleCellClick).toHaveBeenCalledWith(0);
  });

  it('renders marks X and O correctly', () => {
    const board: Cell[] = [
      'X', 'O', null,
      null, null, null,
      null, null, null,
    ];

    render(
      <GameBoard
        board={board}
        winningCells={[]}
        disabled={false}
        onCellClick={vi.fn()}
      />
    );

    const cells = screen.getAllByRole('button');
    expect(cells[0]).toHaveAttribute('aria-label', expect.stringContaining('marked with X'));
    expect(cells[1]).toHaveAttribute('aria-label', expect.stringContaining('marked with O'));
    expect(cells[2]).toHaveAttribute('aria-label', expect.stringContaining('empty'));
  });

  it('highlights winning cells', () => {
    const board: Cell[] = [
      'X', 'X', 'X',
      null, null, null,
      null, null, null,
    ];

    render(
      <GameBoard
        board={board}
        winningCells={[0, 1, 2]}
        disabled={true}
        onCellClick={vi.fn()}
      />
    );

    const cells = screen.getAllByRole('button');
    expect(cells[0]).toHaveAttribute('aria-label', expect.stringContaining('winning cell'));
    expect(cells[1]).toHaveAttribute('aria-label', expect.stringContaining('winning cell'));
    expect(cells[2]).toHaveAttribute('aria-label', expect.stringContaining('winning cell'));
    expect(cells[3]).not.toHaveAttribute('aria-label', expect.stringContaining('winning cell'));
  });

  it('disables interaction when disabled prop is true', () => {
    const board: Cell[] = Array(9).fill(null);
    const handleCellClick = vi.fn();

    render(
      <GameBoard
        board={board}
        winningCells={[]}
        disabled={true}
        onCellClick={handleCellClick}
      />
    );

    const cells = screen.getAllByRole('button');
    fireEvent.click(cells[0]);
    expect(handleCellClick).not.toHaveBeenCalled();
    expect(cells[0]).toBeDisabled();
  });
});

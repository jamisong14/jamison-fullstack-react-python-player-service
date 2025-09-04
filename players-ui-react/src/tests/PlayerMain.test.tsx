import { render, screen } from '@testing-library/react';
import { describe, it, expect } from "vitest";
import PlayerMain from '../components/PlayerMain';

describe('renders main header', () => {
  it('should render main header', () => {
    render(<PlayerMain />);
    const element = screen.getByText("Hello Players");
    expect(element).toBeDefined();
  });
});

describe('renders search buttons', () => {
  it('should render search buttons', () => {
    render(<PlayerMain />);
    const element = screen.getByRole("button");
    expect(element.innerHTML).toContain("Player id");
    const element2 = screen.getByRole("button");
    expect(element2.innerHTML).toContain("Player Country Code");
  });
});

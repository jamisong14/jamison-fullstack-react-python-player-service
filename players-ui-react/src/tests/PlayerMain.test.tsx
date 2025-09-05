import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import PlayerMain from '../components/PlayerMain';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { store } from '../utils/store';

const playersMockData = [
  {
    playerId: '1',
    name: 'John Doe',
    age: 30,
    team: 'Team A',
  },
  
  {
    playerId: '2',
    name: 'Jane Smith',
    age: 25,
    team: 'Team B',
  },
];

const createHandlers = () => {
  return [
    http.get('/v1/players', () => {
      return HttpResponse.json({ players: playersMockData });
    }),
  ];
};
const server = setupServer(...createHandlers());

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup(); // Clean up DOM after each test
});
afterAll(() => server.close());

describe('renders main header', () => {
  it('should render main header', () => {
    renderWithProvider(<PlayerMain />);
    const element = screen.getByText("Hello Players");
    expect(element).toBeDefined();
  });
});

describe('renders search buttons', () => {
  it('should render search buttons', () => {
    renderWithProvider(<PlayerMain />);
    const elements = screen.getAllByRole("button");
    expect(elements).toHaveLength(2);
    expect(elements[0].innerHTML).toContain("Submit");
    expect(elements[1].innerHTML).toContain("Submit");
  });
});

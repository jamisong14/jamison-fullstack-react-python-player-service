import React from 'react';
import ReactDOM from 'react-dom/client';
import './styling/index.css';
import PlayerMain from './components/PlayerMain';
import { store } from './utils/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PlayerMain />
    </Provider>
  </React.StrictMode>
);

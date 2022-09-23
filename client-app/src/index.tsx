import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/index.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './app/api/stores/store';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <StoreContext.Provider value={store}>
    <Router history={history}>
      <App />
    </Router>
  </StoreContext.Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



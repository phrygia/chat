import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './redux/_reducers';
import './assets/styles/common.scss';

const createStoreWidthMiddleware = applyMiddleware(
  promiseMiddleware,
  ReduxThunk,
)(createStore);

ReactDOM.render(
  <Provider
    store={createStoreWidthMiddleware(
      Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__(),
    )}
  >
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root'),
);

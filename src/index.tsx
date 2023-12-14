import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Home from './pages/home';
import Assistant from './pages/assistant';
import App from './App';

import { store } from './store';
import { Provider } from 'react-redux';

const router = createBrowserRouter(
  [
    { path: '/', element: <Home />, errorElement: <Home /> },
    { path: '/assistant', element: <Assistant /> },
  ],
  { basename: '/' }
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App>
      <RouterProvider router={router} />
    </App>
  </Provider>
  // </React.StrictMode>
);

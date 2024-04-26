import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ThemeColorModeProvider from './layouts';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeColorModeProvider />
);

reportWebVitals();

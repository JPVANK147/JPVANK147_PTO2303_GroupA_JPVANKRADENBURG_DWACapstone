import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "../src/App"

// Creating a root instance for rendering the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the App component within StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


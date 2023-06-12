import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ReviewContextProvider } from './context/ReviewContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
    <ReviewContextProvider>
    <App />
    </ReviewContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

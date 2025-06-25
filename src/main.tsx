import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure dark mode is applied before rendering to prevent flash
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark' || 
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  root.classList.add('dark');
} else {
  root.classList.add('light');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
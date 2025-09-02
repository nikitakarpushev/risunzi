import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// @ts-ignore
const tg = (window as any).Telegram?.WebApp;
try { tg?.expand?.(); tg?.ready?.(); } catch {}

createRoot(document.getElementById('root')!).render(<App />);

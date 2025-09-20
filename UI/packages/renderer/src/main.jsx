import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const resizeObserver = new ResizeObserver(() => {
  const rect = document.body.getBoundingClientRect();
  window.electronAPI.resize(rect.width, rect.height);
});

resizeObserver.observe(document.body);



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

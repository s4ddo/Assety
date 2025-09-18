import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const observer = new MutationObserver(() => {
const rect = document.body.getBoundingClientRect();
window.electronAPI.resize(rect.width, rect.height);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { StrictMode } from 'react'
import reactDoM from 'react-dom/client'
import App from './App.jsx'
import './output.css'

reactDoM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

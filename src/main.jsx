import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Styles from './Styles.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Styles />
    <App />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserProvider.jsx'
import { FileProvider } from './context/FileContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <FileProvider>
      <App />
      </FileProvider>
    </UserProvider>
  </StrictMode>,
)

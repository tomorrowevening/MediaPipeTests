import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const IS_DEV = import.meta.env.MODE === 'development';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    {IS_DEV ? (
      <App />
    ) : (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )}
  </>,
)

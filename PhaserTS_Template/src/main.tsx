import React from 'react'
import ReactDOM from 'react-dom/client'
import GameApp from './GameApp'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GameApp/>
  </React.StrictMode>,
)

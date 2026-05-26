import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import UserApp from './UserApp.jsx'
import './index.css'

const params = new URLSearchParams(window.location.search)
const Root = params.get('view') === 'user' ? UserApp : App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { App } from './App.jsx' // esta line es para importar el componente App
import 'antd/dist/reset.css'
const root = ReactDOM.createRoot(document.getElementById('root')) // esta line es para crear el root de la aplicacion
root.render(<React.StrictMode>
  <App />
</React.StrictMode>) // esta line es para renderizar la aplicacion en el root creado anteriormente
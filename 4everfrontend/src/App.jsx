import React, { useState } from 'react'
import NavBar from './components/navbar-component'
import MainLogo from './components/mainlogo'
import './App.css'
import Start from './components/start'

function App() {

  const [isconnected, setIsConnected] = useState(localStorage.getItem('connected'));

  return (
    <div className='main'>
      <NavBar setIsConnected={setIsConnected}/>
      <MainLogo />
      <Start isconnected={isconnected} setIsConnected={setIsConnected} />
    </div>
  )
}

export default App

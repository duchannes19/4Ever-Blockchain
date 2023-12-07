import React, { useState } from 'react'
import NavBar from './components/navbar-component'
import MainLogo from './components/mainlogo'
import './App.css'
import Start from './components/start'

function App() {

  const [isconnected, setIsConnected] = useState(localStorage.getItem('connected'));
  const [step1, setStep1] = useState(localStorage.getItem('accounts') ? true : false);

  return (
    <div className='main'>
      <NavBar setIsConnected={setIsConnected} setStep1={setStep1}/>
      <MainLogo />
      <Start isconnected={isconnected} setIsConnected={setIsConnected} 
      step1={step1} setStep1={setStep1}
      />
    </div>
  )
}

export default App

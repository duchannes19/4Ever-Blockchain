import React, { useState } from 'react'
import NavBar from './components/Navbar'
import MainLogo from './components/MainLogo'
import './App.css'
import './CSS/images.css'
import Start from './components/Start'
import SideFigures from './components/SideFigures'

function App() {

    const [isConnected, setIsConnected] = useState(localStorage.getItem('connected'));
    const [step1, setStep1] = useState(localStorage.getItem('accounts') ? true : false);

    return (
        <div className='main'>
            <NavBar setIsConnected={setIsConnected} setStep1={setStep1} />
            <MainLogo />
            <SideFigures />
            <Start isconnected={isConnected} setIsConnected={setIsConnected}
                step1={step1} setStep1={setStep1}
            />
        </div>
    )
}

export default App

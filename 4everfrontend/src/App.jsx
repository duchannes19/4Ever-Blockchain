import { useState } from 'react';

import NavBar from './components/Navbar';
import MainLogo from './components/MainLogo';
import Start from './components/Start';
import SideFigures from './components/SideFigures';
import { ToastContainer } from 'react-toastify';

import './CSS/App.css';
import './CSS/images.css';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {

    const [isConnected, setIsConnected] = useState(localStorage.getItem('connected') && localStorage.getItem('accounts'));
    const [step1, setStep1] = useState(localStorage.getItem('accounts') ? true : false);

    return (
        <div className='main'>
            <ToastContainer />
            <NavBar setIsConnected={setIsConnected} setStep1={setStep1} />
            <MainLogo />
            <SideFigures />
            <Start isConnected={isConnected} setIsConnected={setIsConnected}
                step1={step1} setStep1={setStep1}
            />
        </div>
    )
}

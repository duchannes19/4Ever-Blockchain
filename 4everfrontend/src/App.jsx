import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import NavBar from './components/Navbar';
import MainLogo from './components/MainLogo';
import Start from './components/Start';
import SideFigures from './components/SideFigures';

import './CSS/App.css';
import './CSS/images.css';
import './CSS/components.css'
import 'react-toastify/dist/ReactToastify.css';

export default function App() {

    const [isConnected, setIsConnected] = useState(localStorage.getItem('connected') && localStorage.getItem('accounts'));
    const [isJoined, setIsJoined] = useState(localStorage.getItem('isjoined'));
    const [step1, setStep1] = useState(localStorage.getItem('accounts') ? true : false);
    const [step2, setStep2] = useState(localStorage.getItem('isjoined') && localStorage.getItem('balance') && localStorage.getItem('nfts'));

    
    useEffect(() => {
        setIsJoined(localStorage.getItem('isjoined'));
    }, [isConnected, step1, step2]);

    //Chek your localstorage
    console.log(localStorage);

    return (
        <div className='main'>
            <ToastContainer />
            <NavBar setIsConnected={setIsConnected} setStep1={setStep1} setStep2={setStep2} isJoined={isJoined}/>
            <MainLogo resize={step2} />
            <SideFigures fadeout={step2} />
            <Start isConnected={isConnected} setIsConnected={setIsConnected}
                step1={step1} setStep1={setStep1}
                step2={step2} setStep2={setStep2}
            />
        </div>
    )
}

import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from "@chakra-ui/react";

import App from './App.jsx';

import './CSS/index.css';

const theme = extendTheme({
    styles: {
        global: {
            body: {
                bg: "#242424",
            },
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>,
);

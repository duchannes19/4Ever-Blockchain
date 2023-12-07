import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#242424",
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>,
)

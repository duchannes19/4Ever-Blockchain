import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import Notify from "./Notify";
import { SpinnerCircular } from 'spinners-react';

// Andrea: This component is for testing only 

const GenerateButton = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {

        setIsLoading(true);
        const address = localStorage.getItem("accounts");
        try {
            const response = await axios.post("http://localhost:3000/api/create-item", { address: address });
            console.log(response.data.message);
            Notify("success", response.data.message);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button fontFamily={'mephistoregular'} mr={2} onClick={handleClick} disabled={isLoading}>
            {isLoading ? <SpinnerCircular style={{width: '30px'}} /> : "Generate Item"}
        </Button>
    );
};

export default GenerateButton;

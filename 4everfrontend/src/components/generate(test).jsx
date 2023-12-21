import { Button } from "@chakra-ui/react";
import axios from "axios";
import Notify from "./Notify";

const GenerateButton = () => {
    const handleClick = async () => {

        const address = localStorage.getItem("accounts");
        try {
            const response = await axios.post("http://localhost:3000/api/create-item", { address: address });
            console.log(response.data.message);
            Notify("success", response.data.message);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Button fontFamily={'mephistoregular'} mr={2} onClick={handleClick}>
            Generate
        </Button>
    );
};

export default GenerateButton;

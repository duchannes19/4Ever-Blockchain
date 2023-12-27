import { Button } from "@chakra-ui/react";
import axios from "axios";
import Notify from "../components/Notify";

const AssignQuest = () => {
    const handleClick = async () => {

        const address = localStorage.getItem("accounts");
        try {
            const response = await axios.post("http://localhost:3000/api/assign-quest", { address: address });
            console.log(response.data.quest);
            Notify("success", response.data.message);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Button fontFamily={'mephistoregular'} mr={2} onClick={handleClick}>
            Get a Quest
        </Button>
    );
};

export default AssignQuest;

import { Box, Typography } from "@mui/material"
import { useContext } from "react";
import { UserContext } from "../App";

export const PlayerInfoPanel = () => {
    const {user} = useContext(UserContext);
    return (
    <Box>
            {user ?
            <>
                <Box>
                    <Typography>{user.displayName}</Typography>
                    <img src={`${user.photoURL}`}></img>
                </Box>
            </> 
            : 
            <Box>
                <Typography>ゆーざじょうほう</Typography>
            </Box>}
    </Box>
    )
}
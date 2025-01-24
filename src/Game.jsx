import { useContext } from "react"
import { UserContext } from "./App"
import { Box, Typography } from "@mui/material";

export const Game = () =>{
    const {user} = useContext(UserContext);
    // 人数が揃ったらゲームを開始する.
    // ターンごとに全員が回答を待機,そろったら表示
    return (
        <Box>
            {user ? 
            <Box>
                <Typography>{user.displayName}</Typography>
                <img src={`${user.photoURL}`}></img>
            </Box> : 
            <Box>
                <Typography>まずは右上のボタンよりログインしてください</Typography>
            </Box>}
        </Box>
    )
}
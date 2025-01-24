import { useContext } from "react"
import { UserContext } from "./App"
import { Box, Typography } from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export const Game = () =>{
    const {user} = useContext(UserContext);

    const opponentUser1 = onSnapshot(doc(db,"MatchingRoom","HostUserId"),(doc) =>{
        console.log(doc.data);
    })
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
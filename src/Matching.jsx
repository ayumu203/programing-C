import { useContext, useState } from "react";
import { PageContext, UserContext } from "./App";
import { Box, Button, Typography } from "@mui/material";
import { collection, deleteDoc, getDocs,doc, updateDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function Matching(){
    const {user} = useContext(UserContext);
    const {page,setPage} = useContext(PageContext);
    const [isMatching,setIsMatching] = useState(false);
    const [isMatched,setIsMatched] = useState(false);

    window.addEventListener("onunload",async () =>{
        setIsMatching(false);
        setIsMatched(false);
    });

    const handleRoomMatching = async () => {
        setIsMatching(true);
        // await deleteRoom();
        // const isJoined = await searchRoom();
        await makeRoom();
    }
    
    // roomに参加できた場合にはfirebase上のroomのデータに自身のデータを書き込んでtrueを返す,できなかった場合にfalseを返す
    const searchRoom = async () => {
    }
    const makeRoom = async () =>{
        console.log("ルーム作成開始");
        try {
            console.log(null);
        } catch(e){
            console.log("error:",e);
        }
    }



    return (
        <Box 
            mt={"50px"}
            sx={{
                display:"flex",
                justifyContent:"center",
            }}
        >  
            {!user 
                ? 
                <Typography
                    sx={{
                        color:"whitesmoke",
                        bgcolor:"silver",
                        width:"100%",
                        textAlign:"center"
                    }}
                >
                    まずは右上のボタンよりログインしてください.
                </Typography> 
                :isMatching 
                    ? 
                        !isMatched 
                        ? 
                            <Typography
                                sx={{
                                    color:"whitesmoke",
                                    bgcolor:"silver",
                                    width:"100%",
                                    textAlign:"center"
                                }}        
                            >現在マッチング中です.しばらくお待ち下さい...</Typography> 
                        :
                            <Typography
                                sx={{
                                    color:"whitesmoke",
                                    bgcolor:"silver",
                                    width:"100%",
                                    textAlign:"center"
                                }}        
                            >マッチング完了</Typography>
                    :
                    <Button
                        variant="contained"
                        sx={{
                            color:"white",
                        }}
                        onClick={()=>handleRoomMatching()}
                    >
                        マッチング開始
                    </Button>
            }
        </Box>
    )
};

export default Matching;
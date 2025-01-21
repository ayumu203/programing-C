import { useContext, useState } from "react";
import { PageContext, UserContext } from "./App";
import { Box, Button, Typography } from "@mui/material";

function Matching(){
    const {user} = useContext(UserContext);
    const {page,setPage} = useContext(PageContext);
    const [isMatching,setIsMatching] = useState(false);
    const [isMatched,setIsMatched] = useState(false);

    const handleRoomMatching = () => {
        setIsMatching(true);
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
                            >対戦中</Typography>
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
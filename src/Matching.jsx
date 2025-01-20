import { useContext, useState } from "react";
import { PageContext } from "./App";
import { Box, Button, Typography } from "@mui/material";

function Matching(){
    const {page,setPage} = useContext(PageContext);
    const [isMatching,setIsMatching] = useState(false);
    return (
        <Box mt={"50px"}>  
            {page !== "Matching" ? <Typography>まずは右上のボタンよりログインしてください.</Typography> : <></>}
            {isMatching ? <Typography>現在マッチング中ですしばらくお待ち下さい...</Typography> :
                <Button
                    variant="contained"
                    color="white"
                    sx={{
                        border:"solid",
                        borderColor:"silver",
                    }}
                    onClick={setIsMatching(true)}
                >マッチング開始
                </Button>
            }
        </Box>
    )
};

export default Matching;
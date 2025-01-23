import { useContext, useState } from "react";
import { PageContext, UserContext } from "./App";
import { Box, Button, Typography } from "@mui/material";
import { addDoc, collection, deleteDoc, getDocs,doc } from "firebase/firestore";
import { db } from "./firebase";

function Matching(){
    const {user} = useContext(UserContext);
    const {page,setPage} = useContext(PageContext);
    const [isMatching,setIsMatching] = useState(false);
    const [isMatched,setIsMatched] = useState(false);

    const handleRoomMatching = async () => {
        setIsMatching(true);
        await deleteRoom();
        const isJoined = await searchRoom();
        if(!isJoined)await makeRoom();
    }
    
    // roomに参加できた場合にはfirebase上のroomのデータに自身のデータを書き込んでtrueを返す,できなかった場合にfalseを返す
    const searchRoom = async () => {
        let flag = false;
        const querySnapshot = await getDocs(collection(db, "rooms"));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id}:${doc.data().RoomId}`);
            if(doc.data().RoomId !== "DammyHostId"){
                if(doc.data().HeadCount < 3){
                    console.log(`ホスト:${doc.data().PL1Name}のルームに参加`);  
                    const orderNumber = doc.data().HeadCount;
                    switch(orderNumber){
                        case 1:
                            // 参加者がホストのみの場合
                            doc.data().PL2Name = user.displayName;
                            doc.data().PL2PhotoURL = user.photoURL; 
                            break;
                        case 2:
                            // 参加者が二人の場合
                            doc.data().PL3Name = user.displayName;
                            doc.data().PL3PhotoURL = user.photoURL; 
                            break;
                    }
                    console.log("ルームへ参加");
                    flag = true;
                }
            }
            else {
                console.log("ルーム作成へ移行");
            }
        });  
        return flag;
    }
    const makeRoom = async () =>{
        console.log("ルーム作成開始");
        try {
            const docRef = await addDoc(collection(db,"rooms"),{
                RoomId:user.uid,
                Turn:0,
                HeadCount:1,
                PL1Name:user.displayName,
                PL1Ans:[],
                PL1MaxStr:[],
                PL1Score:[],
                PL2Name:"no name",
                PL2Ans:[],
                PL2MaxStr:[],
                PL2Score:[],
                PL3Name:"no name",
                PL3Ans:[],
                PL3MaxStr:[],
                PL3Score:[],
            });
            console.log("Doccument added withId:",docRef.id);
        } catch(e){
            console.log("error:",e);
        }
    }

    const deleteRoom = async () =>{
        console.log("roomの削除を開始");
        const querySnapshot = await getDocs(collection(db, "rooms"));
        querySnapshot.forEach(async (docs) => {
            console.log(docs.data().RoomId,"vs",user.uid);
            if(docs.data().RoomId === user.uid){
                await deleteDoc(doc(db, "rooms",docs.id));
            }
        })
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
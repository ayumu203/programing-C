import { useContext, useEffect, useState } from "react";
import { RoomContext, UserContext } from "./App";
import { Box, Button, Typography } from "@mui/material";
import { collection, getDocs,doc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { MAX_ROOM_HEADCOUNT } from "./ConstValue";


function Matching(){
    const { user } = useContext(UserContext);
    const { roomNumber,setRoomNumber } = useContext(RoomContext);
    const [ nowMathing, setNowMatching ] = useState(false);
    
    useEffect(()=>{
        const handleRoomDisconnect = async () =>{
            console.log(roomNumber);
            if(roomNumber){
                const roomRef = doc(db, 'MatchingRoom', `Room${roomNumber}`);
                setDoc(roomRef, {
                    "RoomNumber":roomNumber,
                    "HeadCount":0,
                    "HostUserId":"",
                    "SubUser1Id":"",
                    "SubUser2Id":""
                });
            }
        }

        window.addEventListener('beforeunload',handleRoomDisconnect);
        
        return () => {
            window.removeEventListener('beforeunload',handleRoomDisconnect);
        };
    },[roomNumber]);

    
    
    const handleRoomMatching = async () => {
        storeUserData();
        const joinableRoom = await searchRoom();
        joinRoom(joinableRoom);
        setNowMatching(true);
    }

    const storeUserData = async () =>{
        await setDoc(doc(db,"User",user.uid),{
            "UserName" : user.displayName,
            "PhotoURL" : user.photoURL 
        })
    }
    
    // 参加可能なルームの番号を返す
    const searchRoom = async () => {
        console.log("空いているルームを検索");
        const joinableRoom = [];
        // 空いているルームを順に検索していく
        const querySnapshot = await getDocs(collection(db, "MatchingRoom"));
        querySnapshot.forEach(async (room) => {
            const roomData = room.data();
            if(roomData.HeadCount < MAX_ROOM_HEADCOUNT){
                // ルームが空いていた場合は,そのルームに自身のUserIdを書き込み,ルームの人数が上限になるまで待機する.
                console.log(`Room${roomData.RoomNumber}は空きがあります.`);
                switch(roomData.HeadCount){
                    case 0:
                        joinableRoom.push(["Host",roomData.RoomNumber]);
                        break;
                    case 1:
                        joinableRoom.push(["Sub1",roomData.RoomNumber]);
                        break;
                    case 2:
                        joinableRoom.push(["Sub2",roomData.RoomNumber]);
                        break;
                    default:
                        break ;
                }
            }
        });  
        return joinableRoom;
    }
    
    
    const joinRoom = async (joinableRoom) =>{
        for(let i = 0; i < joinableRoom.length; i++){
            const roomRef = doc(db, 'MatchingRoom', `Room${joinableRoom[i][1]}`);
            switch(joinableRoom[i][0]){
                case "Host":
                    updateDoc(roomRef, { "HostUserId" : user.uid });
                    updateDoc(roomRef, { "HeadCount" : 1 });
                    setRoomNumber(joinableRoom[i][1]);
                    return ;
                case "Sub1":
                    updateDoc(roomRef, { "SubUser1Id" : user.uid });
                    updateDoc(roomRef, { "HeadCount" : 2 });
                    setRoomNumber(joinableRoom[i][1]);
                    return ;
                case "Sub2":
                    updateDoc(roomRef, { "SubUser2Id" : user.uid });
                    updateDoc(roomRef, { "HeadCount" : 3 });
                    setRoomNumber(joinableRoom[i][1]);
                    return;
                }
        }
    }
    
    const roomRef = doc(db,"MatchingRoom",`Room${roomNumber}`);
    const roomDisconnectObserver = onSnapshot(roomRef,async (document) =>{
        if(document.data().HeadCount === 0){
            window.location.reload();
        }
    });
    
    // コメントアウトしてあるコードはもう消したHooksを使ってるので参考程度に、三項演算子使うと便利ってな、がはは
    return (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px', // 画面全体を高さで埋める
            width: '100%', // 画面全体を横幅で埋める                   
        }}>
        {user ? 
            <Typography>
                {!nowMathing ? (
                    <Button onClick={handleRoomMatching}>
                        <Typography variant="h5">
                            マッチング開始
                        </Typography>
                    </Button>
                ) : (
                    <Typography variant="h5">
                        マッチング中
                    </Typography>                    
                )}
            </Typography> 
        : 
            <Typography variant="h5">
                まずは右上のボタンよりログインしてください
            </Typography>
        }
    </Box>
        // <Box 
        //     mt={"50px"}
        //     sx={{
        //         display:"flex",
        //         justifyContent:"center",
        //     }}
        // >  
        //     {!user 
        //         ? 
        //         <Typography
        //             sx={{
        //                 color:"whitesmoke",
        //                 bgcolor:"silver",
        //                 width:"100%",
        //                 textAlign:"center"
        //             }}
        //         >
        //             まずは右上のボタンよりログインしてください.
        //         </Typography> 
        //         :isMatching 
        //             ? 
        //                 !isMatched 
        //                 ? 
        //                     <Typography
        //                         sx={{
        //                             color:"whitesmoke",
        //                             bgcolor:"silver",
        //                             width:"100%",
        //                             textAlign:"center"
        //                         }}        
        //                     >現在マッチング中です.しばらくお待ち下さい...</Typography> 
        //                 :
        //                     <Typography
        //                         sx={{
        //                             color:"whitesmoke",
        //                             bgcolor:"silver",
        //                             width:"100%",
        //                             textAlign:"center"
        //                         }}        
        //                     >マッチング完了</Typography>
        //             :
        //             <Button
        //                 variant="contained"
        //                 sx={{
            //                     color:"white",
            //                 }}
            //                 onClick={()=>handleRoomMatching()}
            //             >
            //                 マッチング開始
            //             </Button>
            //     }
            // </Box>
        )
    };

    
export default Matching;
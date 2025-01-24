import { useContext,  } from "react";
import { PageContext, UserContext } from "./App";
import { Button, Typography } from "@mui/material";
import { collection, getDocs,doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { MAX_ROOM_HEADCOUNT } from "./ConstValue";
import { rewriteFirestoreData } from "./ResetDatabase";

function Matching(){
    const {user} = useContext(UserContext);
    const {page,setPage} = useContext(PageContext);

    const handleRoomMatching = async () => {
        storeUserData();
        const joinableRoom = await searchRoom();
        joinRoom(joinableRoom);
        rewriteFirestoreData();
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

    const joinRoom = (joinableRoom) =>{
        for(let i = 0; i < joinableRoom.length; i++){
            const roomRef = doc(db, 'MatchingRoom', `Room${joinableRoom[i][1]}`);
            switch(joinableRoom[i][0]){
                case "Host":
                    updateDoc(roomRef, { "HostUserId" : user.uid });
                    return ;
                case "Sub1":
                    updateDoc(roomRef, { "SubUser1Id" : user.uid });
                    return ;
                case "Sub2":
                    updateDoc(roomRef, { "SubUser2Id" : user.uid });
                    return;
            }
        }
    }


    // 実装ヨロヨロ、、、
    // コメントアウトしてあるコードはもう消したHooksを使ってるので参考程度に、三項演算子使うと便利ってな、がはは
    return (
    <>
        {user ? <Typography><Button onClick={handleRoomMatching}>マッチング開始</Button></Typography> : <Typography>まずは右上のボタンよりログインしてください</Typography>}
    </>
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
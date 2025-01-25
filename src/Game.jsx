import { useContext, useState } from "react"
import { RoomContext, UserContext } from "./App"
import { Box, Button, Typography } from "@mui/material";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { PlayerInfoPanel } from "./GameComponents/PlayerInfoPanel";
import makeRandomRegText from "./Gametools/makeText";

export const Game = () =>{
    const { user } = useContext(UserContext);
    const { roomNumber } = useContext(RoomContext);
    const [ opponent1,setOpponent1 ] = useState(null);
    const [ opponent2,setOpponent2 ] = useState(null);
    
    // 各プレイヤーの情報を管理する部分
    const userRef = doc(db,"MatchingRoom",`Room${roomNumber}`);
    const userDataObserver = onSnapshot(userRef,async (document) =>{
        if(user && document.exists()){
            if(user.uid === document.data().HostUserId){
                setIsHost(true);
                if(user.uid !== document.data().SubUser1Id){
                    const oppRef = doc(db,"User",`${document.data().SubUser1Id}`);
                    const opp = await getDoc(oppRef);
                    if(opp.exists()){
                        setOpponent1(opp.data());
                    }
                }
                if(user.uid !== document.data().SubUser2Id){
                    const oppRef = doc(db,"User",`${document.data().SubUser2Id}`);
                    const opp = await getDoc(oppRef);
                    if(opp.exists()){
                        setOpponent2(opp.data());
                    }    
                }
    
            }
            
            if(user.uid !== document.data().HostUserId){
                const oppRef = doc(db,"User",`${document.data().HostUserId}`);
                const opp = await  getDoc(oppRef);
                if(opp.exists()){
                    if(opponent1 === null){
                        setOpponent1(opp.data());
                    }
                }
            }
            if(user.uid !== document.data().SubUser1Id){
                const oppRef = doc(db,"User",`${document.data().SubUser1Id}`);
                const opp = await getDoc(oppRef);
                if(opp.exists()){
                    if(opponent1 !== null && opponent1.UserName !== opp.data().UserName && opponent2 === null){
                        setOpponent2(opp.data());
                    }
                    else if(opponent1 === null){
                        console.log(opponent1.UserName,":",opp.data().UserName);
                        setOpponent1(opp.data());
                    }
                }
            }
            if(user.uid !== document.data().SubUser2Id){
                const oppRef = doc(db,"User",`${document.data().SubUser2Id}`);
                const opp = await getDoc(oppRef);
                if(opp.exists()){
                    if(opponent2 === null){
                        setOpponent2(opp.data());
                    }
                }    
            }
        }
    })  

    // ゲームの処理を行う部分
    const [ isHost,setIsHost ] = useState(false);
    const [ turn,setTurn ] = useState(false);
    const [ isStart,setIsStart ] = useState(false);
    const roomRef = doc(db,"MatchingRoom",`Room${roomNumber}`);
    // ルームの人数が規定人数になった時ゲームを開始する
    // const roomHeadCountObserver = onSnapshot(roomRef,async (document) =>{
    //     if(document.data().)
    // });

    // ホストの場合
    // サブの場合
    

    return(
        <Box>
            <Box>
                {/* プレイヤーの情報を表示するBox */}
                {/* コンポーネント化+UIなんとかしてほしい */}
                <PlayerInfoPanel></PlayerInfoPanel>
                {/* {!opponent1 ? <CompetitorInfoPanel></CompetitorInfoPanel> : <CompetitorInfoPanel opponent={opponent1}></CompetitorInfoPanel>} */}
                <Typography>{!opponent1 ? <>マッチング中</> : <>{opponent1.UserName}</>}</Typography>
                {!opponent1 ? <>no img</>: <img src={`${opponent1.PhotoURL}`}></img>}        
                <Typography>{!opponent2 ? <>マッチング中</> : <>{opponent2.UserName}</>}</Typography>
                {!opponent2 ? <>no img</>: <img src={`${opponent2.PhotoURL}`}></img>}        
            </Box>
            <Box>
                {/* ちょっとコンポーネント化に手間がかかるのでベタ書きする */}
            </Box>
        </Box>
    )
}
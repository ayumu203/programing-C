import { useContext, useState } from "react"
import { RoomContext, UserContext } from "./App"
import { Box, Typography } from "@mui/material";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { PlayerInfoPanel } from "./GameComponents/PlayerInfoPanel";
import makeRandomRegText from "./Gametools/makeText";

export const Game = () =>{
    const {user} = useContext(UserContext);
    const {roomNumber} = useContext(RoomContext);
    const [ opponent1,setOpponent1 ] = useState(null);
    const [ opponent2,setOpponent2 ] = useState(null);

    // 各プレイヤーの情報を管理する部分
    const userRef = doc(db,"MatchingRoom",`Room${roomNumber}`);
    const userDataObserver = onSnapshot(userRef,async (document) =>{
        if(user && document.exists()){
            if(user.uid !== document.data().HostUserId){
                const oppRef = doc(db,"User",`${document.data().HostUserId}`);
                const opp = await  getDoc(oppRef);
                if(opp.exists()){
                    if(opponent1 === null)setOpponent1(opp.data());
                }
            }
            if(user.uid !== document.data().SubUser1Id){
                const oppRef = doc(db,"User",`${document.data().SubUser1Id}`);
                const opp = await getDoc(oppRef);
                if(opp.exists()){
                    if(opponent1 === null){
                        setOpponent1(opp.data());
                    }
                    if(opponent1.UserName !== opp.data().UserName && opponent2 === null){
                        setOpponent2(opp.data());
                    }
                }
            }
            if(user.uid !== document.data().SubUser2Id){
                const oppRef = doc(db,"User",`${document.data().SubUser2Id}`);
                const opp = await getDoc(oppRef);
                if(opp.exists()){
                    if(opponent2 === null)setOpponent2(opp.data());
                }    
            }
        }
    })  

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
            </Box>
                {makeRandomRegText()}
            <Box>

            </Box>
        </Box>
    )
}
import { useContext, useState, useEffect} from "react"
import { RoomContext, UserContext } from "./App"
import { Box, Button, Typography, Paper, Grid, useRadioGroup} from "@mui/material";
import { doc, getDoc, onSnapshot, snapshotEqual, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import PlayerInfoPanel from "./GameComponents/PlayerInfoPanel";
import {makeRandomRegText, makeHiraganaList, makeNumberList }from "./Gametools/makeText";
import { MAX_ROOM_HEADCOUNT } from "./ConstValue";
import { getMatchingMaxLengthWord } from "./searchWords.js";

export const Game = () =>{
    const { user } = useContext(UserContext);
    const { roomNumber } = useContext(RoomContext);
    const [ opponent1,setOpponent1 ] = useState(null);
    const [ opponent2,setOpponent2 ] = useState(null);
    const [ isHost,setIsHost ] = useState(false);
    const [ isGaming, setIsGaming ] = useState(false);
    const [ subUserNumber,setSubUserNumber ] = useState(0);

    const hiragana = ['あ', 'い', 'う', 'え', 'お', 'か'];
    const number = ['1', '2', '3', '4', '5', '6'];

    // ゲームの処理を行う部分
    const [ turn,setTurn ] = useState(0);
    const [ themeText,setThemeText ] = useState("");
    const [answerString,setAnswerString] = useState("");    
    const [score,setScore] = useState(false);
    const [opponent1AnswerString,setOpponent1AnswerString] = useState("");
    const [opponent2AnswerString,setOpponent2AnswerString] = useState("");
    const [opponent1Score,setOpponent1Score] = useState(false);
    const [opponent2Score,setOpponent2Score] = useState(false);
    
    // ルームの人数が規定人数になった時ゲームを開始する
    useEffect(() => {
        const userRef = doc(db,"MatchingRoom",`Room${roomNumber}`);
        const userDataObserver = onSnapshot(userRef, async(document) =>{
            if(user && document.exists()){
                if(user.uid === document.data().HostUserId){
                    setIsHost(true);
                    if(user.uid !== document.data().SubUser1Id){
                        const oppRef = doc(db,"User",document.data().SubUser1Id);
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
                            setTurn(turn+1);
                            userDataObserver();
                        }    
                    }

                } else {
                    const oppRef = doc(db,"User",`${document.data().HostUserId}`);
                    const opp = await getDoc(oppRef);
                    if(opp.exists()){
                        if(opponent1 === null){
                            setOpponent1(opp.data());
                        }
                    }

                    if(user.uid !== document.data().SubUser1Id){
                        setSubUserNumber(2);
                        const oppRef = doc(db,"User",`${document.data().SubUser1Id}`);
                        const opp = await getDoc(oppRef);
                        if(opp.exists()){
                            if(opponent2 === null){
                                setOpponent2(opp.data());
                                setTurn(turn+1);
                                userDataObserver();
                            }
                        }
                    }
                    if(user.uid !== document.data().SubUser2Id){
                        setSubUserNumber(1);
                        const oppRef = doc(db,"User",`${document.data().SubUser2Id}`);
                        const opp = await getDoc(oppRef);
                        if(opp.exists()){
                            if(opponent2 === null){
                                setOpponent2(opp.data());
                                setTurn(turn+1);
                                userDataObserver();
                            }
                        }    
                    }
                }

            }
        });
        return () => { userDataObserver(); };
    }, [user, roomNumber]);
    
    useEffect(() => {
        if(isHost){
            // DB上のTurnと上記のHooksのターンを比較し、同値の場合にゲーム開始処理を行う
            const gameRoomRef = doc(db,"GameRoom",`Room${roomNumber}`);
            const gameRoom = getDoc(gameRoomRef);
            updateDoc(gameRoomRef,{Turn: turn});
            // 文章の生成および送信そして、表示かなあ
            const tmp_text = makeRandomRegText();
            updateDoc(gameRoomRef,{ThemeString:tmp_text});
            setThemeText(tmp_text);
            console.log(tmp_text);
        }
    }, [roomNumber, turn]);

    // すべてのユーザ
    const groomRef = doc(db,"GameRoom",`Room${roomNumber}`);
    const groomThemeTextObserver = onSnapshot(groomRef,async (document) =>{
        if(document.exists()){
            setThemeText(document.data().ThemeString);
            return ;
        }
    });

    const handleSendGameData = async(answerPattern) =>{
        const answerString = (getMatchingMaxLengthWord(answerPattern) ?? "");
        const score = answerString.length;
        const gameRoomRef = doc(db,"GameRoom",`Room${roomNumber}`);
        if(isHost){ 
            await updateDoc(gameRoomRef,{HostUserAnswerString:answerString});
            await updateDoc(gameRoomRef,{HostUserScore:score});
        }
        if(subUserNumber === 1){ 
            await updateDoc(gameRoomRef,{SubUser1AnswerString:answerString});
            await updateDoc(gameRoomRef,{SubUser1Score:score});
        }
        if(subUserNumber === 2){ 
            await updateDoc(gameRoomRef,{SubUser2AnswerString:answerString});
            await updateDoc(gameRoomRef,{SubUser2Score:score});
        }
    }    

    const resultObserver = onSnapshot(groomRef,async (document) =>{
        if(document.exists()){
            if(isHost){
                setOpponent1AnswerString(document.data().SubUser1AnswerString);
                setOpponent2AnswerString(document.data().SubUser2AnswerString);
                setOpponent1Score(document.data().SubUser1Score);
                setOpponent2Score(document.data().SubUser2Score);
            }
            if(subUserNumber === 1){
                setOpponent1AnswerString(document.data().HostUserString);   
                setOpponent2AnswerString(document.data().SubUser2AnswerString);
                setOpponent1Score(document.data().HostUserScore);
                setOpponent2Score(document.data().SubUser2Score);
            }
            if(subUserNumber === 2){
                setOpponent1AnswerString(document.data().HostUserString);
                setOpponent2AnswerString(document.data().SubUser1AnswerString);
                setOpponent1Score(document.data().HostUserScore);
                setOpponent2Score(document.data().SubUser1Score);
            }
        }
    });


    return(
        <Grid container spacing={2} sx={{height:'77vh', overflow:'hidden'}}>
            <Grid item xs={4}>
                <Box sx={{ height: '100%', width: '100%', border: '2px solid black', borderRadius: '10px', boxSizing: 'border-box', padding: 2 }}>
                    {user ? 
                        <PlayerInfoPanel photo={user.photoURL} playername={user.displayName} pattern={themeText} hiragana={hiragana} number={number} sendGameData={handleSendGameData}>
                        </PlayerInfoPanel>
                    :
                        <></>
                    }
                </Box>
            </Grid>
            <Grid item xs={4}>
                <Box sx={{ height: '100%', width: '100%', border: '2px solid black', borderRadius: '10px', boxSizing: 'border-box', padding: 2 }}>

                    {opponent1 ? 
                        <PlayerInfoPanel photo={opponent1.PhotoURL} playername={opponent1.UserName}>
                        </PlayerInfoPanel>                        
                    :
                        <></>
                    }
                </Box>
            </Grid>
            <Grid item xs={4}>
                <Box sx={{ height: '100%', width: '100%', border: '2px solid black', borderRadius: '10px', boxSizing: 'border-box', padding: 2 }}>

                    {opponent2 ? 
                        <PlayerInfoPanel photo={opponent2.PhotoURL} playername={opponent2.UserName}>
                        </PlayerInfoPanel>                        
                    :
                        <></>
                    }
                </Box>
            </Grid>
        </Grid>
    )
}
/*
<Grid container spacing={2} sx={{height:'50vh', overflow:'hidden'}}>
<Button onClick={handleSendGameData}>回答</Button>
{themeText}
{opponent1AnswerString}
{opponent1Score}
*/
/*
<Box>
<Box sx={{
    display:"flex"
}}>
    {/* UIに使う気力なかった }

    <Typography>{!opponent1 ? <>マッチング中</> : <>{opponent1.UserName}</>}</Typography>
    {!opponent1 ? <>no img</>: <img src={`${opponent1.PhotoURL}`}></img>}        
    <Typography>{!opponent2 ? <>マッチング中</> : <>{opponent2.UserName}</>}</Typography>
    {!opponent2 ? <>no img</>: <img src={`${opponent2.PhotoURL}`}></img>}        
</Box>
<Box>
    {/* ちょっとコンポーネント化に手間がかかるのでベタ書きする }
    {themeText}
</Box>
</Box>*/
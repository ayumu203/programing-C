import { useContext, useState, useEffect} from "react"
import { RoomContext, UserContext } from "./App"
import { Box, Button, Typography, Paper, Grid, useRadioGroup} from "@mui/material";
import { doc, getDoc, onSnapshot, snapshotEqual, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import PlayerInfoPanel from "./GameComponents/PlayerInfoPanel";
import {makeRandomRegText, makeHiraganaList, makeNumberList }from "./Gametools/makeText";
import { MAX_ROOM_HEADCOUNT } from "./ConstValue";
import { InvertColorsOff } from "@mui/icons-material";
import { getMatchingMaxLengthWord } from "./searchWords.js";

export const Game = () =>{
    const { user } = useContext(UserContext);
    const { roomNumber } = useContext(RoomContext);
    const [ opponent1,setOpponent1 ] = useState(null);
    const [ opponent2,setOpponent2 ] = useState(null);
    const [ isHost,setIsHost ] = useState(false);
    const [ isGaming, setIsGaming ] = useState(false);
    const [ nowState, setNowState ] = useState(false);
    const [ subUserNumber,setSubUserNumber ] = useState(0);

    // ゲームの処理を行う部分
    const [ turn,setTurn ] = useState(0);
    const [ themeText,setThemeText ] = useState("");
    const [ hiragana, setHiragana ] = useState([]);
    const [ number, setNumber ] = useState([]);
    const [answerString,setAnswerString] = useState("");    
    const [opponent1AnswerString,setOpponent1AnswerString] = useState("");
    const [opponent2AnswerString,setOpponent2AnswerString] = useState("");
    const [score,setScore] = useState(false);
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
                            setNowState(0);
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
                                setNowState(0);
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
                                setNowState(0);
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
            updateDoc(gameRoomRef,{ThemeString:makeRandomRegText()});
            updateDoc(gameRoomRef,{ThemaHiraganaList:makeHiraganaList()});
            updateDoc(gameRoomRef,{ThemaNumberList:makeNumberList()});
        }
    }, [roomNumber, turn]);

    // すべてのユーザ
    useEffect(() => {
        const groomThemeTextObserver = onSnapshot(doc(db,"GameRoom",`Room${roomNumber}`),async (document) =>{
            if(document.exists()){
                setThemeText(document.data().ThemeString);
                setHiragana(document.data().ThemaHiraganaList);
                setNumber(document.data().ThemaNumberList);
                return groomThemeTextObserver();
            }
        });
        return () => groomThemeTextObserver();
    }, [roomNumber, themeText, hiragana, number]);

    const handleSendGameData = async(answerPattern) =>{
        const answerString = (getMatchingMaxLengthWord(answerPattern) ?? "");
        //const answerString = "あいうえお";
        const my_score = answerString.length;
        const gameRoomRef = doc(db,"GameRoom",`Room${roomNumber}`);
        if(isHost){ 
            await updateDoc(gameRoomRef,{HostUserAnswerString:answerString});
            await updateDoc(gameRoomRef,{HostUserScore:my_score});
        }
        if(subUserNumber === 1){ 
            await updateDoc(gameRoomRef,{SubUser1AnswerString:answerString});
            await updateDoc(gameRoomRef,{SubUser1Score:my_score});
        }
        if(subUserNumber === 2){ 
            await updateDoc(gameRoomRef,{SubUser2AnswerString:answerString});
            await updateDoc(gameRoomRef,{SubUser2Score:my_score});
        }
        setAnswerString(answerString);
        setScore(my_score);
    }    

    useEffect(() => {
        const resultObserver = onSnapshot(doc(db,"GameRoom",`Room${roomNumber}`),async (document) =>{
            if(document.exists()){
                if(isHost){                
                    setOpponent1AnswerString(document.data().SubUser1AnswerString);
                    setOpponent2AnswerString(document.data().SubUser2AnswerString);
                    setOpponent1Score(document.data().SubUser1Score);
                    setOpponent2Score(document.data().SubUser2Score);
                }
                if(subUserNumber === 1){
                    setOpponent1AnswerString(document.data().HostUserAnswerString);   
                    setOpponent2AnswerString(document.data().SubUser2AnswerString);
                    setOpponent1Score(document.data().HostUserScore);
                    setOpponent2Score(document.data().SubUser2Score);
                }
                if(subUserNumber === 2){
                    setOpponent1AnswerString(document.data().HostUserAnswerString);
                    setOpponent2AnswerString(document.data().SubUser1AnswerString);
                    setOpponent1Score(document.data().HostUserScore);
                    setOpponent2Score(document.data().SubUser1Score);
                }
            }
            return () => resultObserver();
        });
    }, [roomNumber, isHost, subUserNumber]);
    
    useEffect(() => {
        if(score !== false && opponent1Score !== false && opponent2Score !== false){
            setNowState(1);
        }
    }, [score, opponent1Score, opponent2Score]);

    const isWinorLose = (num) => {
        let my_score, o1_score, o2_score;
        if(num == 1){
            my_score=score; o1_score=opponent1Score; o2_score=opponent2Score;
        } else if(num == 2){
            my_score=opponent1Score; o1_score=score; o2_score=opponent2Score;
        } else if(num == 3){
            my_score=opponent2Score; o1_score=score; o2_score=opponent1Score;           
        }
        if(my_score!=0){
            if(my_score >= o1_score && my_score >= o2_score){
                return"Win!!";
            }else{
                return"Lose..";
            }
        }else{
            return"Lose..";
        }
    }
    return(
        <Grid container spacing={2} sx={{height:'77vh', overflow:'hidden'}}>
            <Grid item xs={4}>
                <Box sx={{ height: '100%', width: '100%', border: '2px solid black', borderRadius: '10px', boxSizing: 'border-box', padding: 2 }}>
                    {(() => {
                        if(user && nowState != 1){ 
                            return(<PlayerInfoPanel state={nowState} photo={user.photoURL} playername={user.displayName} pattern={themeText} hiragana={hiragana} number={number} sendGameData={handleSendGameData}>
                            </PlayerInfoPanel>);
                        } else if(user && nowState == 1){
                           return( <PlayerInfoPanel state={nowState} win={isWinorLose(1)}photo={user.photoURL} playername={user.displayName} point={score} pattern={answerString} hiragana={hiragana} number={number} sendGameData={handleSendGameData}>
                            </PlayerInfoPanel>);                           
                        }
                    })()}
                </Box>
            </Grid>
            <Grid item xs={4}>
                <Box sx={{ height: '100%', width: '100%', border: '2px solid black', borderRadius: '10px', boxSizing: 'border-box', padding: 2 }}>
                    {(() => {
                        if(opponent1 && nowState != 1){ 
                            return(<PlayerInfoPanel state={nowState} photo={opponent1.PhotoURL} playername={opponent1.UserName}>
                            </PlayerInfoPanel>);
                        } else if(opponent1 && nowState == 1){
                            return(<PlayerInfoPanel state={nowState} win={isWinorLose(2)}photo={opponent1.PhotoURL} playername={opponent1.UserName} point={opponent1Score} pattern={opponent1AnswerString}>
                            </PlayerInfoPanel>);                  
                        }
                    })()}
                </Box>
            </Grid>
            <Grid item xs={4}>
                <Box sx={{ height: '100%', width: '100%', border: '2px solid black', borderRadius: '10px', boxSizing: 'border-box', padding: 2 }}>
                    {(() => {
                        if(opponent2 && nowState != 1){ 
                            return(<PlayerInfoPanel state={nowState} photo={opponent2.PhotoURL} playername={opponent2.UserName} >
                            </PlayerInfoPanel>);
                        } else if(opponent2 && nowState == 1){
                            return(<PlayerInfoPanel state={nowState} win={isWinorLose(3)} photo={opponent2.PhotoURL} playername={opponent2.UserName} point={opponent2Score} pattern={opponent2AnswerString}>
                            </PlayerInfoPanel>);              
                        }
                    })()}
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
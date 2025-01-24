import { setDoc,doc } from "firebase/firestore";
import { db } from "./firebase";
// 複数個のドキュメントを一括で変更したい場合に使用する:やらかしたときのリカバー
export const rewriteFirestoreData = () =>{
    // MatchingRoomテーブルを初期化

    // for(let i=1; i<= 5; i++){
    //     const roomRef = doc(db, 'MatchingRoom', `Room${i}`);
    //     setDoc(roomRef, {
    //         "RoomNumber":i,
    //         "HeadCount":0,
    //         "HostUserId":"",
    //         "SubUser1Id":"",
    //         "SubUser2Id":""
    //     });
    // }

    // GameRoomテーブルを初期化
    // for(let i=1; i<= 5; i++){
    //     const roomRef = doc(db, 'GameRoom', `Room${i}`);
    //     setDoc(roomRef, {
    //         "Turn" : 1,
    //         "ThemeString":[],
    //         "HostUserScore":[],
    //         "SubUser1Score":[],
    //         "SubUser2Score":[],
    //         "HostUserAnswerString":[],
    //         "SubUser1AnswerString":[],
    //         "SubUser2AnswerString":[]
    //     });
    // }
}

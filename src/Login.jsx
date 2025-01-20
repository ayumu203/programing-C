import { signInWithPopup, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";
import { Button } from "@mui/material";
import { UserContext } from "./App";
import { useEffect, useState } from "react";

function Login(){
    const provider = new GoogleAuthProvider();
    const [user,setUser] = useState(UserContext[0]);
    const [userData,setUserData] = useState(UserContext[1]);
    const [page,setPage] = useState(UserContext[2]);

    useEffect(()=>{
        const unsubscribe=auth.onAuthStateChanged((authUser)=>{
            if(authUser){
                setUser(authUser);
                setPage("Match");
                console.log('user set\n',user);
            }
            else {
                setUser(null);
                console.log('user unset');
            }
        });
        return ()=>{
            unsubscribe();
        };
    },[]);
    
    const handleSignIn = async () =>{
        try {
            const result = await signInWithPopup(auth,provider);
            console.log("ログイン完了:",result.user);
            console.log("user:",user);
            console.log("page:",page);
        } catch(error){
            console.log("エラーが発生:",error);
        }
    }

    const handleSignOut = async () =>{
        try {
            await signOut(auth);
            console.log("ログアウトしました");
        } catch(error){
            console.log("エラー発生:",error);
        }
    }

    return(
        <>
        {user ? <Button color="black" onClick={handleSignIn}>Googleでログイン</Button> : <Button onClick={handleSignOut}>ログアウト</Button>}
        </>
    )
}

export default Login;
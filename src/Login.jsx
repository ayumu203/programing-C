import { signInWithPopup, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";
import { Box,Button } from "@mui/material";
import { UserContext } from "./App";
import { useEffect, useState } from "react";
import LoginIcon from '@mui/icons-material/Login';

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
        <Box
            sx={{
                display:'flex',
                justifyContent:'inherit'
            }}
        >
            {user ? <Button variant="contained" color="black" onClick={handleSignIn}><LoginIcon></LoginIcon>Googleでログイン</Button> : <Button onClick={handleSignOut}>ログアウト</Button>}
        </Box>
        </>
    )
}

export default Login;
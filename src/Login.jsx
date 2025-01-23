import { signInWithPopup, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";
import { Box,Button, Typography } from "@mui/material";
import { UserContext,PageContext } from "./App";
import { useContext, useEffect, useState } from "react";
import LoginIcon from '@mui/icons-material/Login';

function Login(){
    const provider = new GoogleAuthProvider();
    const {user,setUser} = useContext(UserContext);
    const {page,setPage} = useContext(PageContext);
    const [isLogin,setIslogin] = useState(false);

    useEffect(()=>{
        window.addEventListener('beforeunload',handleSignOut);

        return () => {
            window.removeEventListener('beforeunload',handleSignOut);
        };
    },[]);

    useEffect(()=>{
        const unsubscribe=auth.onAuthStateChanged((authUser)=>{
            if(authUser){
                // コンテクストの変更
                setUser(authUser);
            }
            else {
                setUser(null);
            }
        });
        return ()=>{
            unsubscribe();
        };
    },[]);
    
    const handleSignIn = async () =>{
        try {
            const result = await signInWithPopup(auth,provider);
            setIslogin(true);
            setPage("Matching");
            console.log("ログイン完了:",user);
            console.log("現在のページ:",page);
            setIsSecondButtonVisible(false);
        } catch(error){
            console.log("エラーが発生:",error);
        }
    }

    const handleSignOut = async () =>{
        try {
            await signOut(auth);
            console.log("ログアウトしました");
            setPage("Login");
            setIslogin(false);
        } catch(error){
            console.log("エラー発生:",error);
        }
    }

  // 2つ目のボタンの表示状態を管理するためのuseStateフック
  const [isSecondButtonVisible, setIsSecondButtonVisible] = useState(false);

  // 2つ目のボタンの表示/非表示を切り替える関数
  const handleClick = () => {
    setIsSecondButtonVisible(true);  // 2つ目のボタンを表示
  };

    return(
        <>
        <Box
            sx={{
                display:'flex',
                justifyContent:'inherit',
                alignItems: 'flex-end',
            }}
        >
            {
            !isLogin
            ? 
                <Button variant="contained" onClick={handleSignIn}>
                    <LoginIcon></LoginIcon>
                    <Typography fontSize={"h6.fontSize"}>ログイン</Typography>
                </Button> 
            : 
                <>
                <Button onClick={handleClick}
                    sx={{
                        minWidth: 'auto',
                        padding: 0,
                        borderRadius: '50%',
                        textAlign: 'center'
                    }}
                >
                    <img src={user.photoURL} style={{borderRadius: '50%'}}></img>
                </Button>
                
                {isSecondButtonVisible && (               
                    <Button variant="contained" onClick={handleSignOut} 
                        sx={{
                            height: '40px',
                            width: '140px',
                            marginLeft: 2,
                        }}>
                        <Typography fontSize={"h6.fontSize"}>ログアウト</Typography>
                    </Button>
                )}
                
                </>
            }
        </Box>
        </>
    )
}

export default Login;
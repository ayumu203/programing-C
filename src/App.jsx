import { createContext, useState } from 'react';
import './App.css'
import Login from './Login';
import { Box, Typography } from '@mui/material';

export const UserContext = createContext(null);

function App() {
  const [user,setUser] = useState(null);
  const [userData,setUserData] = useState(null);
  const [page,setPage] = useState("Login");
  
  if(page === "Login"){
    return(<>
      <UserContext.Provider value={[[user,setUser],[page,setPage],[userData,setUserData]]}>
        <header>
          <Box
           sx={{
              display:'flex',
              justifyContent: 'space-between',
              borderBottom:3,
              borderColor:'gray',
              paddingBottom:"10px"
            }}>
            <Typography
              fontSize={'h3.fontSize'}
            >Regelook</Typography>
            <Login></Login>
          </Box>
        </header>
      </UserContext.Provider>
    </>)
  }
  return (
    <>
      Error cannot show page.
    </>
  )
}

export default App

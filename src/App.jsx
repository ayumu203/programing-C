import { createContext, useState } from 'react';
import './App.css'
import { Header } from './Header';
import Matching from './Matching';
import { Game } from './Game';
import { rewriteFirestoreData } from './ResetDatabase';

export const UserContext = createContext(null);
export const PageContext = createContext(null);
export const RoomContext = createContext(null);

function App() {
  // rewriteFirestoreData();        
  const [user,setUser] = useState(null);
  const [page,setPage] = useState(null);
  const [roomNumber,setRoomNumber] = useState(null);
    return(<>
      <UserContext.Provider value={{user,setUser}}>
        <PageContext.Provider value={{page,setPage}}>
          <RoomContext.Provider value={{roomNumber,setRoomNumber}}>
            <Header></Header>
            <Matching></Matching>
            <Game></Game>
          </RoomContext.Provider>
        </PageContext.Provider>
      </UserContext.Provider>
    </>)
}

export default App

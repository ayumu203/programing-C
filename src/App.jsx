import { createContext, useState } from 'react';
import './App.css'
import { Header } from './Header';
import Matching from './Matching';

export const UserContext = createContext(null);
export const PageContext = createContext(null);
// export const 

function App() {
  const [user,setUser] = useState(null);
  const [page,setPage] = useState(null);
    return(<>
      <UserContext.Provider value={{user,setUser}}>
        <PageContext.Provider value={{page,setPage}}>
          <header>
            <Header></Header>
          </header>
          <Matching></Matching>
        </PageContext.Provider>
      </UserContext.Provider>
    </>)
}

export default App

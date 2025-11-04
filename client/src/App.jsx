import './App.css'
import {Route, Routes } from 'react-router-dom'
import { Layout } from './Layout'
import { IndexPage } from './IndexPage'
import { Login } from './Login'
import { Register } from './Register'
import { UserContextProvider } from './UserContext'
import Create from './Create'
import { Postpage } from './Postpage'
import Editpost from './Editpost'
import LandingPage from './LandingPage'
function App() {
  return (
    <>
      <UserContextProvider>
        <Routes>
          
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/home" element={<IndexPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path = "/create" element = {<Create/>}/>
            <Route path = "/post/:id" element = {<Postpage/>}/>
            <Route path = "/edit/:id" element = {<Editpost/>}/>
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  );
}
export default App

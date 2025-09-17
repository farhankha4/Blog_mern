import './App.css'
import {Route, Routes } from 'react-router-dom'
import { Layout } from './Layout'
import { IndexPage } from './IndexPage'
import { Login } from './Login'
import { Register } from './Register'
import { UserContextProvider } from './UserContext'
import Create from './Create'

function App() {
  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path = "/create" element = {<Create/>}/>
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  );
}
export default App

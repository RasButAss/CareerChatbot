import { Route, Routes } from 'react-router'
import './App.css'
import HomePage from './Home/Home'
import Login from './Login/Login'
import Chat from './Chat/Chat'
import { Button, Flex, Grid, IconButton } from '@radix-ui/themes'


function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  )
}

export default App

import { Route, Routes } from 'react-router'
import './App.css'
import Home from './Home/Home'
import Login from './Login/Login'
import Chat from './Chat/Chat'

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
    </>
  )
}

export default App

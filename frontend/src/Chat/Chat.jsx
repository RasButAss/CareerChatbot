import { Grid, TextField, Container, IconButton, TextArea, Flex, ScrollArea } from '@radix-ui/themes'
import React, {useEffect, useRef, useState} from 'react'
import { PaperPlaneIcon, PlusIcon, FileTextIcon  } from '@radix-ui/react-icons'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { LayoutDashboard, Home, SquareMenu, CirclePlusIcon, HistoryIcon } from "lucide-react";
import axios from 'axios'
import Message from './Message'
import Cookies from 'js-cookie'
import { useParams, useNavigate } from 'react-router';

const Chat = () => {
  const { id } = useParams()
  const [collapsed, setCollapsed] = useState(false)
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState('');
  const [history, setHistory] = useState([])
  const [chats, setChats] = useState([])
  const [socket, setSocket] = useState(null);
  const [currentId, setCurrentId] = useState(id)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const infoString = Cookies.get('user_info')
        let fixedString = infoString.replace(/\\054/g, ',')
        fixedString = fixedString.replace(/'/g, '"'); // Replace single quotes with double quotes
        fixedString = fixedString.replace(/True/g, 'true'); // Fix boolean values
        fixedString = fixedString.replace(/False/g, 'false');
        const info = JSON.parse(fixedString)
        console.log(info.email)
        const response = await axios.get("http://localhost:8000/chat/", {
          params: {
            email: info.email
          }
        })
        console.log(response.data.chats)
        setHistory(response.data.chats)
      } catch(error) {
        console.error(error)
      }
    }
    const handleChatHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/chat/${currentId}`)
        let id_messages = []
        for(const id_message of response.data.messages) {
          id_messages.push(id_message.content)
        }
        setChats(id_messages)
        console.log(id_messages)
      } catch(error) {
        console.error(error)
      }
    }
    fetchData();
    handleChatHistory()
  }, [currentId])
  
  useEffect(() => {
    if(socket) {
      socket.onopen = () => {
        console.log("Connected to WebSocket")
        setChats([...chats,inputText])
        const message = {
          "id" : currentId,
          "prompt" : inputText,
          "model" : "mistral"
        }
        const string_message = JSON.stringify(message)
        socket.send(string_message);
      };
      socket.onerror = (error) => console.error("Websocket Error")
      socket.onmessage = (event) => {
        if (event.data === "**||END||**") {
          socket.close(); // Close connection after response completion
          setChats((prev) => [...prev, messages]);
          setMessages('');
        } else {
          setMessages((prev) => prev + event.data);
        }
      }
      socket.onclose = () => console.log("Websocket closed")
    }
  }, [socket, messages])

  const connectWebsocket = () => {
    const newSocket = new WebSocket("ws://localhost:8000/model/generate");
    setSocket(newSocket)
  }

  // useEffect(() => {}, [messages, chats])
  const sendMessage = () => {
    connectWebsocket();
  };

  const handleNavigate = (new_id) => {
    setCurrentId(new_id)
    navigate(`/chat/${new_id}`)
  } 

  const handleNewChat = async () => {
    try {
      const infoString = Cookies.get('user_info')
      let fixedString = infoString.replace(/\\054/g, ',')
      fixedString = fixedString.replace(/'/g, '"'); // Replace single quotes with double quotes
      fixedString = fixedString.replace(/True/g, 'true'); // Fix boolean values
      fixedString = fixedString.replace(/False/g, 'false');
      const info = JSON.parse(fixedString)
      console.log(info.email)
      const response = await axios.post('http://localhost:8000/chat/',{}, {
        params : {
          email : info.email
        }
      })
      setHistory((prev) => [...prev, response.data])
      console.log(response.data)
      handleNavigate(response.data._id)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Flex direction="row">
    <Flex height="100vh">
        <Sidebar collapsed={collapsed} collapsedWidth='75px'>
          <Menu>
            <MenuItem icon={<SquareMenu />} onClick={(e) => {setCollapsed(!collapsed)}}>
              {
                !collapsed ?
                  "Menu"
                 : null
              }
            </MenuItem>
            <MenuItem className='items-center justify-center' icon={<CirclePlusIcon />} onClick={(e) => {handleNewChat()}}> 
            <Flex gap="3">
              {
                !collapsed ?
                  "New Chat"
                 : null
              }
            </Flex>
            </MenuItem>
            <SubMenu label="History" icon={<HistoryIcon />}>
              {history.map((element, index) => (
                <MenuItem key={index} onClick={(e) => {handleNavigate(element.id)}}>{element.topic}</MenuItem>
              ))}
            </SubMenu>
          </Menu>
        </Sidebar>
    </Flex>
    <Flex direction="column" gap="3" width="100%" flexGrow="1" style={{padding : "2.1%"}}>
      <ScrollArea>
        <Flex width="90%" height="80vh" gap="3" direction="column">
          {chats.map((msg, index) => (
            <Message content={msg} key={index} />
          ))}
          <Message content={messages} />
        </Flex>
      </ScrollArea>
      <Flex width="90%" justify="center" align="center">
        <Flex gap="2" justify="center" align="center" width="90%">
          <TextArea placeholder='Ask anything' radius='full' style={{width : "100%"}} size="3" onChange={(e) => {setInputText(e.target.value)}} />
          <IconButton radius="full" size="3" onClick={(e) => {sendMessage()}}>
            <PaperPlaneIcon />
          </IconButton>
          <IconButton radius="full" size="3">
            <FileTextIcon />
          </IconButton>
        </Flex>
      </Flex>
    </Flex>
    </Flex>
  )
}

export default Chat
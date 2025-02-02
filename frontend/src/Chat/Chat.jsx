import { Grid, TextField, Container, IconButton, TextArea, Flex, ScrollArea } from '@radix-ui/themes'
import React, {useEffect, useRef, useState} from 'react'
import { PaperPlaneIcon, PlusIcon, FileTextIcon  } from '@radix-ui/react-icons'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { LayoutDashboard, Home, SquareMenu, CirclePlusIcon } from "lucide-react";
import Message from './Message'

const Chat = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState('');
  const [chats, setChats] = useState([])
  const [socket, setSocket] = useState(null);
  // const [temp, setTemp] = useState([])
  
  useEffect(() => {
    if(socket) {
      socket.onopen = () => {
        console.log("Connected to WebSocket")
        setChats([...chats,inputText])
        const message = {
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

  return (
    <Flex direction="row">
    <Flex height="100vh">
        <Sidebar collapsed={collapsed} collapsedWidth='65px'>
          <Menu>
            <MenuItem >
              <div onClick={(e) => {setCollapsed(!collapsed)}} className='w-min'>
                <SquareMenu />
              </div>
            </MenuItem>
            <MenuItem className='items-center justify-center'> 
            <Flex gap="3">
              <CirclePlusIcon />
              {
                !collapsed ?
                  "New Chat"
                 : null
              }
            </Flex>
            </MenuItem>
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
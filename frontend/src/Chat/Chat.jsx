import { Grid, TextField, Container, IconButton, TextArea, Flex, ScrollArea } from '@radix-ui/themes'
import React, {useState} from 'react'
import { PaperPlaneIcon, PlusIcon, FileTextIcon  } from '@radix-ui/react-icons'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { LayoutDashboard, Home, SquareMenu, CirclePlusIcon } from "lucide-react";
import Message from './Message'

const Chat = () => {
  const [collapsed, setCollapsed] = useState(false)
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
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
          <Message />
        </Flex>
      </ScrollArea>
      <Flex width="90%" justify="center" align="center">
        <Flex gap="2" justify="center" align="center" width="90%">
          <TextArea placeholder='Ask anything' radius='full' style={{width : "100%"}} size="3" />
          <IconButton radius="full" size="3">
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
import React from 'react'
import axios from 'axios'
import { Flex, Text, Button, Grid, Box, TextField, Heading } from "@radix-ui/themes";
import signin from './signin.jpg'

async function handleGoogleLogin(event) {
  window.location.replace('http://localhost:8000/auth/login')
}

const Login = () => {
  return (
    <Grid columns="2" height="100vh">
      <Flex align="center" justify="center" style={{
        height: "100vh",
        backgroundImage: `url(${signin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        }}>
        <Heading size="9" style={{color : "white"}}>
          Signup with google
        </Heading>
      </Flex>
      <Flex direction="column" gap="2" align="center" justify="center">
        <Button onClick={handleGoogleLogin}>Google Login</Button>
      </Flex>
    </Grid>
  )
}

export default Login
import React from 'react'
import axios from 'axios'
import { Flex, Text, Button, Grid, Box, TextField } from "@radix-ui/themes";

async function handleGoogleLogin(event) {
  window.location.replace('http://localhost:8000/auth/login')
}

const Login = () => {
  return (
    <Grid columns="2" height="100vh">
      <Flex align="center" justify="center">
        Signin image
      </Flex>
      <Flex direction="column" gap="2" align="center" justify="center">
        <Button onClick={handleGoogleLogin}>Google Login</Button>
        <Button>Linkedin Login</Button>
      </Flex>
    </Grid>
  )
}

export default Login
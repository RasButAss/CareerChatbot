import React from 'react'
import axios from 'axios'

async function handleGoogleLogin(event) {
  window.location.replace('http://localhost:8000/auth/login')
}

const Login = () => {
  return (
    <div> 
      <button onClick={handleGoogleLogin}>
        Google Login
      </button>
    </div>
  )
}

export default Login
import React from 'react'
import { useNavigate } from 'react-router';
import { Container, Flex, Box, Heading, Text, Button } from "@radix-ui/themes";

const HomePage = () => {
  const navigate = useNavigate()
  const handleGetStarted = () => {
    navigate('/login')
  }
  return (
    <Container size="3" className="min-h-screen" gap="3">
    {/* Hero Section */}
    <Flex direction="column" align="center" justify="center" className="h-screen text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white" gap="4">
      <Heading size="9">Your AI Career Assistant</Heading>
      <Text size="5" className="max-w-2xl mt-4">Let our AI-powered chatbot guide you through career choices, resume building, and job applications.</Text>
      <Button className="mt-6 bg-white text-blue-600 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition" onClick={handleGetStarted}>Get Started</Button>
    </Flex>
    
    {/* About Us Section */}
    <Box py="9" px="6" className="text-center bg-white">
      <Heading size="7" className="text-gray-900 mb-6">About Us</Heading>
      <Text size="5" className="max-w-3xl mx-auto text-gray-700">We are a team of career experts and AI enthusiasts dedicated to helping job seekers navigate their career paths with ease. Our chatbot provides real-time career advice, interview tips, and resume feedback to empower you in your job search.</Text>
    </Box>
    
    {/* Footer Section */}
    <Box py="6" className="bg-gray-800 text-gray-300 text-center">
      <Text>&copy; 2025 CareerBot. All rights reserved.</Text>
    </Box>
  </Container>
    );
}


export default HomePage
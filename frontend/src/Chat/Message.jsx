import React from 'react'
import { Flex, Avatar, Text } from '@radix-ui/themes'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

const Message = ({content, type}) => {
  // console.log(content)
  return (
    <Flex direction="column" gap="4">
    <Flex gap="5">
        <Flex gap="3">
        <Avatar
            src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
            fallback="A"
	    />
        </Flex>
        <Flex flexGrow="1" wrap="wrap">
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className='flex flex-col' >
            {content}
          </Markdown>
        </Flex>
    </Flex>
    <hr />
    </Flex>
  )
}

export default Message
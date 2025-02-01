import React from 'react'
import { Flex, Avatar } from '@radix-ui/themes'

const Message = ({content, type}) => {
  return (
    <Flex direction="column" gap="4">
    <Flex gap="5">
        <Flex gap="3">
        <Avatar
            src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
            fallback="A"
	    />
        </Flex>
        <Flex flexGrow="1">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatum, eius quam iusto iste nam reprehenderit maxime molestiae repellendus! Ullam eaque quae quia vel sint aut ipsam? Veniam dolores ducimus sint.
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat doloribus accusamus mollitia optio veritatis eum nisi quia odio placeat quos omnis molestias minus voluptatum in cumque esse doloremque, fuga totam.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores eum ab quibusdam possimus veniam ipsum beatae nemo enim ut? Vitae amet minus harum voluptas! Ex enim in suscipit praesentium excepturi?
        </Flex>
    </Flex>
    <hr />
    </Flex>
  )
}

export default Message
import { Box } from '@chakra-ui/react';
import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
	const { selectedChat } = ChatState();
	return (
		<Box
			d={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
			bg='white'
			m='0.5rem'
			p='0.5rem'
			borderRadius='lg'
			borderWidth='1px'
			w={{ base: '100%', md: '70%' }}
			fontWeight='bold'
			fontFamily='Work sans'
			flexDirection='column'
			h='90vh'
		>
			<SingleChat
				fetchAgain={fetchAgain}
				setFetchAgain={setFetchAgain}
			></SingleChat>
		</Box>
	);
};

export default ChatBox;

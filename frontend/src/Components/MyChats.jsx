import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({ fetchAgain }) => {
	const [loggedUser, setLoggedUser] = useState();
	const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

	const toast = useToast();

	const fetchChats = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get('/api/chat', config);
			setChats(data);
		} catch (error) {
			toast({
				title: 'Error Occured!',
				description: 'Failed to Load the chats',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
		}
	};
	useEffect(() => {
		setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
		fetchChats();
	}, [fetchAgain]);

	return (
		<Box
			d={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
			flexDir='column'
			alignItems='center'
			p='0.5rem'
			bg='white'
			w={{ base: '100%', md: '31%' }}
			h='90vh'
			borderRadius='lg'
			borderWidth='1px'
			m='0.5rem'
		>
			<Box
				pb={3}
				px={3}
				fontSize={{ base: '28px', md: '30px' }}
				fontFamily='Work sans'
				d='flex'
				w='100%'
				justifyContent='space-between'
				alignItems='center'
			>
				<Text>My chats</Text>
				<GroupChatModal>
					<Button
						d='flex'
						fontSize={{ base: '17px', md: '10px', lg: '17px' }}
						rightIcon={<AddIcon />}
					>
						New Group Chat
					</Button>
				</GroupChatModal>
			</Box>
			<Box w='100%'>
				{chats ? (
					<Stack overflowY='auto'>
						{chats.map((chat) => (
							<Box
								key={chat._id}
								onClick={() => setSelectedChat(chat)}
								cursor='pointer'
								bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
								color={selectedChat === chat ? 'white' : 'black'}
								px={3}
								py={2}
								borderRadius='lg'
							>
								<Text>
									{!chat.isGroupChat
										? getSender(loggedUser, chat.users)
										: chat.chatName}
								</Text>
							</Box>
						))}
					</Stack>
				) : (
					<ChatLoading />
				)}
			</Box>
		</Box>
	);
};

export default MyChats;

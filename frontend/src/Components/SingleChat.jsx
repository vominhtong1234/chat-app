import { ArrowBackIcon } from '@chakra-ui/icons';
import {
	Box,
	FormControl,
	FormHelperText,
	FormLabel,
	IconButton,
	Input,
	Spinner,
	Text,
	toast,
	useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getSender, getSenderFull } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import '../styles.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../animations/typing.json';

const ENDPOINT = 'https://chat-app-demo-vmt.herokuapp.com/';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState();
	const [newMessage, setNewMessage] = useState('');
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const toast = useToast();

	const { user, selectedChat, setSelectedChat, notification, setNotification } =
		ChatState();

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	};

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit('setup', user);
		socket.on('connected', () => setSocketConnected(true));
		socket.on('typing', () => setIsTyping(true));
		socket.on('stop typing', () => setIsTyping(false));
	}, []);
	useEffect(() => {
		socket.on('message recieved', (newMessageRecieved) => {
			if (
				!selectedChatCompare ||
				selectedChatCompare._id !== newMessageRecieved.chat._id
			) {
				if (!notification.includes(newMessageRecieved))
					setNotification([newMessageRecieved, ...notification]);
				setFetchAgain(!fetchAgain);
			} else {
				setMessages([...messages, newMessageRecieved]);
			}
		});
	});
	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedChat;
	}, [selectedChat]);
	const fetchMessages = async () => {
		if (!selectedChat) return;
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			setLoading(true);
			const { data } = await axios.get(
				`/api/message/${selectedChat._id}`,
				config
			);
			setMessages([...data]);
			setLoading(false);
			socket.emit('join chat', selectedChat._id);
		} catch (error) {
			toast({
				title: 'Error Occured!',
				description: 'Failed to Load the Messages',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'bottom',
			});
		}
	};
	const sendMessage = async (event) => {
		if (event.key === 'Enter' && newMessage) {
			socket.emit('stop typing', selectedChat._id);
			try {
				const config = {
					headers: {
						'Content-type': 'application/json',
						Authorization: `Bearer ${user.token}`,
					},
				};
				const { data } = await axios.post(
					'/api/message',
					{
						content: newMessage,
						chatId: selectedChat._id,
					},
					config
				);
				socket.emit('new message', data);
				setNewMessage('');
				setMessages([...messages, data]);
			} catch (error) {
				toast({
					title: 'Error Occured!',
					status: 'error',
					duration: 3000,
					isClosable: true,
					position: 'top',
				});
			}
		}
	};
	const typingHandler = (e) => {
		setNewMessage(e.target.value);
		if (!socketConnected) return;
		if (!typing) {
			setTyping(true);
			socket.emit('typing', selectedChat._id);
		}
		let lastTypingTime = new Date().getTime();
		var timerLength = 3000;
		setTimeout(() => {
			var timeNow = new Date().getTime();
			var timeDiff = timeNow - lastTypingTime;
			if (timeDiff >= timerLength && typing) {
				socket.emit('stop typing', selectedChat._id);
				setTyping(false);
			}
		}, timerLength);
	};
	console.log('SingleChat');
	return (
		<>
			{selectedChat ? (
				<>
					<Box
						d='flex'
						justifyContent='space-between'
						w='100%'
						h='10vh'
						fontSize='2rem'
					>
						<IconButton
							d={{ base: 'flex', md: 'none' }}
							icon={<ArrowBackIcon></ArrowBackIcon>}
							onClick={() => setSelectedChat('')}
						></IconButton>
						{!selectedChat.isGroupChat ? (
							<>
								{getSender(user, selectedChat.users)}
								<ProfileModal
									user={getSenderFull(user, selectedChat.users)}
								></ProfileModal>
							</>
						) : (
							<>
								{selectedChat.chatName.toUpperCase()}
								<UpdateGroupChatModal
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
									fetchMessages={fetchMessages}
								></UpdateGroupChatModal>
							</>
						)}
					</Box>
					<Box
						bg='rgb(209, 224, 224)'
						borderRadius='lg'
						h='100%'
						d='flex'
						flexDirection='column'
						justifyContent='flex-end'
					>
						{loading ? (
							<Spinner size='xl' alignSelf='center' margin='auto'></Spinner>
						) : (
							<div className='messages'>
								<ScrollableChat messages={messages}></ScrollableChat>
							</div>
						)}
						<FormControl
							onKeyDown={sendMessage}
							isRequired
							mt='0.5rem'
							px='1rem'
						>
							{isTyping ? (
								<div>
									<Lottie
										options={defaultOptions}
										width='70px'
										style={{ marginBottom: 15, marginLeft: 15 }}
									></Lottie>
								</div>
							) : (
								<></>
							)}
							<Input
								variant='filled'
								bg='#E0E0E0'
								placeholder='Enter a message..'
								value={newMessage}
								onChange={(e) => typingHandler(e)}
							></Input>
						</FormControl>
					</Box>
				</>
			) : (
				<Box
					d='flex'
					flexDirection='column'
					h='100%'
					alignItems='center'
					justifyContent='center'
				>
					Select one chat to message
				</Box>
			)}
		</>
	);
};

export default SingleChat;

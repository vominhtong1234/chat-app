import {
	Avatar,
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	Input,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Spinner,
	Text,
	Tooltip,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React from 'react';
import { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

const SideDrawer = () => {
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);

	const {
		user,
		setSelectedChat,
		chats,
		setChats,
		notification,
		setNotification,
	} = ChatState();
	const history = useHistory();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef();

	const logoutHandler = () => {
		localStorage.removeItem('userInfo');
		setSelectedChat('');
		history.push('/');
	};
	const handleSearch = async () => {
		if (!search) {
			toast({
				title: 'Please Enter something in search',
				status: 'warning',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.get(`/api/user?search=${search}`, config);
			setLoading(false);
			setSearchResult(data);
			setSearch('');
		} catch (error) {
			toast({
				title: 'Error Occured!',
				description: 'Failed to Load the Search Results',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
		}
	};
	const accessChat = async (userId) => {
		try {
			setLoadingChat(true);
			const config = {
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.post(`/api/chat`, { userId }, config);

			if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
			setSelectedChat(data);
			setLoadingChat(false);
			onClose();
		} catch (error) {
			toast({
				title: 'Error fetching the chat',
				description: error.message,
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
		}
	};
	console.log('SideDrawer');
	return (
		<div>
			<Box
				d='flex'
				justifyContent='space-between'
				alignItems='center'
				bg='white'
				w='100%'
				p='5px 10px 5px 10px'
				borderWidth='5px'
			>
				<Tooltip label='search user to chat' hasArrow placement='bottom-end'>
					<Button variant='outline' onClick={onOpen}>
						<i className='fas fa-search'></i>
						<Text d={{ base: 'none', md: 'flex' }} px='0.5rem'>
							Search user
						</Text>
					</Button>
				</Tooltip>
				<Text fontSize='2xl' fontFamily='Work Sans'>
					Talk-A-Tive
				</Text>
				<div>
					<Menu>
						<MenuButton p='1px' mr='0.5rem'>
							<NotificationBadge
								count={notification.length}
								effect={Effect.SCALE}
							></NotificationBadge>
							<BellIcon w='2rem' h='2rem'></BellIcon>
						</MenuButton>
						<MenuList>
							{!notification.length && 'No a new Message'}
							{notification.map((no) => (
								<MenuItem
									key={no._id}
									onClick={() => {
										setSelectedChat(no.chat);
										setNotification(
											notification.filter((notif) => notif !== no)
										);
									}}
								>
									{no.chat.isGroupChat
										? `New Message in ${no.chat.chatName}`
										: `New Message from ${getSender(user, no.chat.users)}`}
								</MenuItem>
							))}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar size='sm' cursor='pointer' name={user.pic}></Avatar>
						</MenuButton>
						<MenuList>
							<ProfileModal user={user}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModal>
							<MenuDivider></MenuDivider>
							<MenuItem onClick={logoutHandler}>Log out</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>
			<Drawer
				isOpen={isOpen}
				placement='left'
				onClose={onClose}
				finalFocusRef={btnRef}
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Search users</DrawerHeader>

					<DrawerBody>
						<Box d='flex' mb='1rem'>
							<Input
								placeholder='search user'
								mr='1rem'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							></Input>
							<Button onClick={handleSearch}>Go</Button>
						</Box>
						{loading ? (
							<ChatLoading></ChatLoading>
						) : searchResult.length != 0 ? (
							searchResult.map((user) => (
								<UserListItem
									key={user._id}
									user={user}
									handleFunction={() => accessChat(user._id)}
								/>
							))
						) : (
							<span>No result</span>
						)}
						{loadingChat && <Spinner ml='auto' d='flex'></Spinner>}
					</DrawerBody>

					<DrawerFooter>
						<Button variant='outline' onClick={onClose}>
							Cancel
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
};

export default SideDrawer;

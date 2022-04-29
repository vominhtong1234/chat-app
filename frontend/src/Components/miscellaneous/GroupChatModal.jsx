import {
	Box,
	Button,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const GroupChatModal = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState();
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState();
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);

	const toast = useToast();

	const { user, chats, setChats } = ChatState();

	const handleSearch = async (query) => {
		setSearch(query);
		if (!query) {
			toast({
				title: 'Please fill in input',
				description: "You need write some user's name ",
				status: 'error',
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
			const { data } = await axios.get(`/api/user?search=${query}`, config);
			setSearchResult(data);
			setLoading(false);
		} catch (error) {
			toast({
				title: 'Not founding user',
				description: "user's name is not exist ",
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
		}
	};
	const handleSubmit = async () => {
		if (!selectedUsers || selectedUsers.length < 3 || !groupChatName) {
			toast({
				title: 'Please to select user to create gruop',
				status: 'warning',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.post(
				'/api/chat/group',
				{
					name: groupChatName,
					users: JSON.stringify(selectedUsers.map((user) => user._id)),
				},
				config
			);
			setChats([data, ...chats]);
			onClose();
			toast({
				title: 'New Group Chat ',
				status: 'success',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
		} catch (error) {
			toast({
				title: 'we can not a new group',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
		}
	};
	const handleGroup = (userToAdd) => {
		if (selectedUsers.includes(userToAdd)) {
			toast({
				title: 'User has already been added',
				status: 'warning',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		setSelectedUsers([userToAdd, ...selectedUsers]);
	};
	const handledelete = (userId) => {
		const newSelectedUsers = selectedUsers.filter(
			(user) => user._id !== userId
		);
		setSelectedUsers(newSelectedUsers);
	};
	console.log('GroupChatModal');
	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Create a Group chat</ModalHeader>
					<ModalCloseButton />
					<ModalBody d='flex' flexDir='column' alignItems='center'>
						<FormControl>
							<Input
								placeholder='fill in chatname'
								mb='1rem'
								onChange={(e) => setGroupChatName(e.target.value)}
							></Input>
						</FormControl>
						<FormControl>
							<Input
								placeholder='Add users'
								mb='1rem'
								onChange={(e) => handleSearch(e.target.value)}
							></Input>
						</FormControl>
						<Box w='100%' d='flex' flexWrap='wrap'>
							{selectedUsers.map((user) => (
								<UserBadgeItem
									key={user._id}
									user={user}
									handleFunction={() => handledelete(user._id)}
								></UserBadgeItem>
							))}
						</Box>
						{loading ? (
							<Text>Loading</Text>
						) : (
							searchResult.map((user) => (
								<UserListItem
									key={user._id}
									user={user}
									handleFunction={() => handleGroup(user)}
								></UserListItem>
							))
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='cyan' mr={3} onClick={handleSubmit}>
							Create Chat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModal;

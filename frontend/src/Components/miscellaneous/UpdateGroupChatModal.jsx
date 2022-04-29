import { ViewIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	FormControl,
	IconButton,
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

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState('');
	const [search, setSearch] = useState();
	const [searchResult, setSearchResult] = useState();
	const [loading, setLoading] = useState();
	const [renameLoading, setRenameLoading] = useState();

	const toast = useToast();

	const { user, selectedChat, setSelectedChat } = ChatState();

	const handleRemove = async (userId) => {
		if (user._id !== selectedChat.groupAdmin._id) {
			toast({
				title: 'Only admin is allowed to delete user',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		if (user._id === userId) {
			toast({
				title: 'Do not delete yourself',
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
			const { data } = await axios.put(
				'/api/chat/groupremove',
				{ chatId: selectedChat._id, userId: userId },
				config
			);
			setSelectedChat(data);
			setLoading(false);
			fetchMessages();
			setFetchAgain(!fetchAgain);
		} catch (error) {
			toast({
				title: 'Error can not add',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			setLoading(false);
		}
	};
	const handleRename = async (userId) => {
		if (!groupChatName) {
			toast({
				title: 'Error Occured!',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		try {
			setRenameLoading(true);
			const config = {
				headers: {
					'Content-type': 'Application/json',
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.put(
				'/api/chat/rename',
				{
					chatId: selectedChat._id,
					chatName: groupChatName,
				},
				config
			);
			setSelectedChat(data);
			setRenameLoading(false);
			setGroupChatName('');
			toast({
				title: 'Update Successfully!',
				status: 'success',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			onClose();
			setFetchAgain(!fetchAgain);
		} catch (error) {
			toast({
				title: 'Can not rename!',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
		}
	};
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

			if (data.length !== 0) {
				setSearchResult(data);
			} else setSearchResult('');
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
	const handleAddUser = async (userId) => {
		if (selectedChat.users.find((user) => user._id === userId)) {
			toast({
				title: 'User is allready exists',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		if (selectedChat.groupAdmin._id !== user._id) {
			toast({
				title: 'Only admin can add someone',
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
			const { data } = await axios.put(
				'/api/chat/grouppadd',
				{ chatId: selectedChat._id, userId: userId },
				config
			);
			setSelectedChat(data);
			setLoading(false);
			setFetchAgain(!fetchAgain);
		} catch (error) {
			toast({
				title: 'Error can not add',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			setLoading(false);
		}
	};
	const handleLeave = async () => {
		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.put(
				'/api/chat/groupremove',
				{ chatId: selectedChat._id, userId: user._id },
				config
			);
			setSelectedChat(data);
			setLoading(false);
			setFetchAgain(!fetchAgain);
		} catch (error) {
			toast({
				title: 'Error can not add',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			setLoading(false);
		}
	};
	return (
		<>
			<IconButton icon={<ViewIcon></ViewIcon>} onClick={onOpen}>
				Open Modal
			</IconButton>

			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign='center'>{selectedChat.chatName}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box d='flex' flexWrap='wrap'>
							{selectedChat.users.map((u) => (
								<UserBadgeItem
									key={u._id}
									user={u}
									handleFunction={() => handleRemove(u._id)}
								></UserBadgeItem>
							))}
							<FormControl d='flex'>
								<Input
									placeholder='Chat Name'
									mb={3}
									value={groupChatName}
									onChange={(e) => setGroupChatName(e.target.value)}
								/>
								<Button
									variant='solid'
									colorScheme='teal'
									ml={1}
									isLoading={renameLoading}
									onClick={() => handleRename(onClose)}
								>
									Update
								</Button>
							</FormControl>
							<FormControl>
								<Input
									placeholder='Add User to group'
									mb={1}
									onChange={(e) => handleSearch(e.target.value)}
								/>
							</FormControl>
							<Box w='100%'>
								{searchResult ? (
									searchResult.map((u) => (
										<UserListItem
											key={u._id}
											user={u}
											handleFunction={() => handleAddUser(u._id)}
										></UserListItem>
									))
								) : (
									<Text>No result</Text>
								)}
							</Box>
						</Box>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='red' mr={3} onClick={handleLeave}>
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateGroupChatModal;

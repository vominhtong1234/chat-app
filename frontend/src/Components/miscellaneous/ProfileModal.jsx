import {
	IconButton,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Image,
	Text,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import React from 'react';

const ProfileModal = ({ user, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	console.log('ProfileModal');
	return (
		<>
			{children ? (
				<span onClick={onOpen}>{children}</span>
			) : (
				<IconButton
					d={{ base: 'flex' }}
					icon={<ViewIcon />}
					onClick={onOpen}
				></IconButton>
			)}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent h='400px'>
					<ModalHeader
						fontSize='40px'
						fontFamily='Work sans'
						textAlign='center'
					>
						{user.name}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody d='flex' flexDirection='column' alignItems='center'>
						<Image
							borderRadius='full'
							boxSize='100px'
							src={user.pic}
							alt={user.name}
						></Image>
						<Text>{user.email}</Text>
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme='blue'
							mr='3px'
							onClick={onClose}
							variant='ghost'
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfileModal;

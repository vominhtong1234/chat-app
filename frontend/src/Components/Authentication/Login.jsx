import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	VStack,
	useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';

export const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const toast = useToast();

	const { setUser } = ChatState();

	const handleSubmit = async () => {
		setLoading(true);
		if (!email || !password) {
			toast({
				title: 'Please Fill all the Feilds',
				status: 'warning',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			setLoading(false);
			return;
		}
		try {
			const config = {
				headers: {
					'Content-type': 'application/json',
				},
			};
			const { data } = await axios.post(
				'/api/user/login',
				{ email, password },
				config
			);
			toast({
				title: 'Login Successful',
				status: 'success',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			localStorage.setItem('userInfo', JSON.stringify(data));
			setUser(data);
			setLoading(false);
			history.push('/chat');
		} catch (error) {
			toast({
				title: 'Error Occured!',
				description: error.response.data.message,
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			setLoading(false);
		}
	};
	console.log('Login');
	return (
		<VStack spacing='5px'>
			<FormControl isRequired id='email'>
				<FormLabel>Email</FormLabel>
				<Input
					placeholder='Enter your email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type='email'
				></Input>
			</FormControl>
			<FormControl isRequired id='password'>
				<FormLabel>PassWord</FormLabel>
				<InputGroup>
					<Input
						placeholder='Enter your password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						type={show ? 'text' : 'password'}
					></Input>
					<InputRightElement width='4.5rem'>
						<Button h='1.75rem' size='sm' onClick={(e) => setShow(!show)}>
							{!show ? 'Show' : 'Hidden'}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<Button
				colorScheme='blue'
				width='100%'
				style={{ marginTop: '15px' }}
				onClick={handleSubmit}
				isLoading={loading}
			>
				Login
			</Button>
			{/* <Button
				variant='solid'
				colorScheme='red'
				width='100%'
				style={{ marginTop: '15px' }}
				onClick={() => {
					setEmail('vominhtong.tn@gmail.com');
					setPassword('12345789');
				}}
			>
				Get user'credential
			</Button> */}
		</VStack>
	);
};

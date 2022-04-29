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
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export const SignUp = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [pic, setPic] = useState('');
	const [show, setShow] = useState(false);
	const [picLoading, setPicLoading] = useState(false);
	const toast = useToast();
	const history = useHistory();

	const axios = require('axios');
	const postDetails = (pics) => {
		setPicLoading(true);
		if (pics === undefined) {
			toast({
				title: 'Please Select an Image!',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		console.log(pics);
		if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
			const data = new FormData();
			data.append('file', pics);
			data.append('upload_preset', 'chat-app');
			data.append('cloud_name', 'dfuebaxfp');
			fetch('https://api.cloudinary.com/v1_1/dfuebaxfp/image/upload', {
				method: 'post',
				body: data,
			})
				.then((res) => res.json())
				.then((data) => {
					setPic(data.url.toString());
					console.log(data.url.toString());
					setPicLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setPicLoading(false);
				});
		} else {
			toast({
				title: 'Please Select an Image!',
				status: 'warning',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			setPicLoading(false);
			return;
		}
	};
	const handleSubmit = async () => {
		setPicLoading(true);
		if (!name || !email || !password || !confirmPassword) {
			toast({
				title: 'Please Fill all the Feilds',
				status: 'warning',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			setPicLoading(false);
			return;
		}
		if (password !== confirmPassword) {
			toast({
				title: 'Passwords Do Not Match',
				status: 'warning',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		console.log(name, email, password, pic);
		try {
			const config = {
				headers: {
					'Content-type': 'application/json',
				},
			};
			const { data } = await axios.post(
				'/api/user',
				{
					name,
					email,
					password,
					pic,
				},
				config
			);
			toast({
				title: 'Registration Successful',
				status: 'success',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			localStorage.setItem('userInfo', JSON.stringify(data));
			setPicLoading(false);
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
			setPicLoading(false);
		}
	};
	console.log('SignUp');
	return (
		<VStack spacing='5px'>
			<FormControl isRequired id='name'>
				<FormLabel>Name</FormLabel>
				<Input
					placeholder='Enter your name'
					value={name}
					onChange={(e) => setName(e.target.value)}
				></Input>
			</FormControl>
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
			<FormControl isRequired id='confirmpassword'>
				<FormLabel>Confirm PassWord</FormLabel>
				<InputGroup>
					<Input
						placeholder='Enter your confirm password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						type={show ? 'text' : 'password'}
					></Input>
					<InputRightElement width='4.5rem'>
						<Button
							h='1.75rem'
							size='sm'
							onClick={(e) => {
								setShow(!show);
							}}
						>
							{!show ? 'Show' : 'Hidden'}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl>
				<FormLabel>Upload your picture</FormLabel>
				<Input
					type='file'
					p='1.5'
					accept='image/*'
					onChange={(e) => postDetails(e.target.files[0])}
				></Input>
			</FormControl>
			<Button
				colorScheme='blue'
				width='100%'
				style={{ marginTop: '15px' }}
				onClick={handleSubmit}
				isLoading={picLoading}
			>
				Sign up
			</Button>
		</VStack>
	);
};

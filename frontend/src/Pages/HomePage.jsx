import React from 'react';

import { Login } from '../Components/Authentication/Login';
import { SignUp } from '../Components/Authentication/SignUp';
import {
	Container,
	Box,
	Text,
	TabList,
	Tabs,
	Tab,
	TabPanels,
	TabPanel,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
const HomePage = () => {
	const history = useHistory();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('userInfo'));
		if (user) history.push('/chat');
		else history.push('/');
		console.log('HomePageEffect');
	}, [history]);
	console.log('HomePage');
	return (
		<Container maxW='xl' centerContent>
			<Box
				d='flex'
				justifyContent='center'
				p='3'
				bg='white'
				w='100%'
				m='40px 0px 15px 0px'
				borderRadius='lg'
				borderWidth='1px'
			>
				<Text
					fontSize='4xl'
					fontFamily='Work sans'
					color='black'
					fontWeight='bold'
				>
					Chat app
				</Text>
			</Box>
			<Box bg='white' w='100%' p='4px' borderRadius='lg' borderWidth='1px'>
				<Tabs variant='soft-rounded'>
					<TabList>
						<Tab width='50%'>Login</Tab>
						<Tab width='50%'>Sign up</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Login></Login>
						</TabPanel>
						<TabPanel>
							<SignUp></SignUp>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
};

export default HomePage;

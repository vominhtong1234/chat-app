import { useHistory } from 'react-router-dom';
import React, { createContext, useContext, useEffect, useState } from 'react';

const Chatcontext = createContext();
export const ChatState = () => {
	return useContext(Chatcontext);
};

const ChatProvider = ({ children }) => {
	const history = useHistory();
	const [user, setUser] = useState();
	const [selectedChat, setSelectedChat] = useState('');
	const [chats, setChats] = useState([]);
	const [notification, setNotification] = useState([]);

	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem('userInfo'));
		if (userInfo) setUser(userInfo);
		else history.push('/');
		console.log('ChatproviderEffect');
	}, [history]);
	console.log('Chatprovider');
	return (
		<Chatcontext.Provider
			value={{
				user,
				setUser,
				selectedChat,
				setSelectedChat,
				chats,
				setChats,
				notification,
				setNotification,
			}}
		>
			{children}
		</Chatcontext.Provider>
	);
};

export default ChatProvider;

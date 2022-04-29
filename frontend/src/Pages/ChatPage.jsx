import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../Components/miscellaneous/SideDrawer';
import MyChats from '../Components/MyChats';
import ChatBox from '../Components/ChatBox';
import { Box } from '@chakra-ui/react';
import { useState } from 'react';
const ChatPage = () => {
	const { user } = ChatState();
	const [fetchAgain, setFetchAgain] = useState(false);
	console.log('ChatPage');
	return (
		<div style={{ width: '100vw' }}>
			{user && <SideDrawer />}
			<Box d='flex' justifyContent='space-between'>
				{user && <MyChats fetchAgain={fetchAgain} />}
				{user && (
					<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
				)}
			</Box>
		</div>
	);
};
export default ChatPage;

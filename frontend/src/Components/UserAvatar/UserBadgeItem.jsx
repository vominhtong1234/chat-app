import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import React from 'react';

const UserBadgeItem = ({ user, handleFunction }) => {
	return (
		<Box
			m='2px'
			borderRadius='lg'
			p='2px'
			fontSize='13px'
			fontWeight='bold'
			cursor='pointer'
			bg='cadetblue'
			fontFamily='Work Sans'
			mb='0.5rem'
			onClick={handleFunction}
		>
			{user.name}
			<CloseIcon ml='0.5rem'></CloseIcon>
		</Box>
	);
};

export default UserBadgeItem;

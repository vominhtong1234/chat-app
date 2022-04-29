const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const { populate } = require('../models/userModel');
const User = require('../models/userModel');

const sendMessage = asyncHandler(async (req, res) => {
	const { chatId, content } = req.body;
	if (!chatId || !content) {
		res.status(400).json('data passed into the request is invalid');
	}
	var newMessage = {
		sender: req.user._id,
		content,
		chat: chatId,
	};
	try {
		var message = await Message.create(newMessage);
		message = await Message.findById(message._id)
			.populate('sender', 'name pic')
			.populate('chat', 'chatName users isGroupChat');
		message = await User.populate(message, {
			path: 'chat.users',
			select: 'name pic email',
		});
		await Chat.findByIdAndUpdate(chatId, {
			latestMessage: message,
		});
		res.json(message);
	} catch (error) {
		throw new Error('can not send message');
	}
});
const allMessages = asyncHandler(async (req, res) => {
	const chatId = req.params.chatId;
	try {
		const mess = await Message.find({ chat: chatId })
			.populate('sender', 'name email')
			.populate('chat', 'chatName users');
		res.status(200).json(mess);
	} catch (error) {
		res.status(400).json(error);
	}
});
module.exports = { sendMessage, allMessages };

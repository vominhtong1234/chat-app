const {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	addToGroup,
	removeFromGroup,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = require('express').Router();

router.route('/').get(protect, fetchChats);
router.route('/').post(protect, accessChat);
router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameGroup);
router.route('/groupremove').put(protect, removeFromGroup);
router.route('/grouppadd').put(protect, addToGroup);

module.exports = router;

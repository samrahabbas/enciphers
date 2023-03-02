const express = require('express');
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require('../controllers/chat');
const router = express.Router();
const {isAuth} = require('../middlewares/auth');

router.post('/chats', isAuth, accessChat);
router.get('/chats', isAuth, fetchChats);
router.post('/group', isAuth, createGroupChat);
router.put('/rename', isAuth, renameGroup);
router.put('/group-add', isAuth, addToGroup);
router.put('/group-remove', isAuth, removeFromGroup);

module.exports = router;

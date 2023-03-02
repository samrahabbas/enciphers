const express = require('express');
const {sendMessage, allMessages} = require('../controllers/message');
const router = express.Router();
const {isAuth} = require('../middlewares/auth');

router.post('/message', isAuth, sendMessage);
router.get('/:chatId', isAuth, allMessages);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getRecentConversation,
  getConversationByRoomId,
  initiate,
  postMessage,
  markConversationReadByRoomId,
  deleteMessageById,
  deleteRoomById,
} = require('../controllers/chatRoom');
const {isAuth} = require('../middlewares/auth');

router.get('/chatRoom', isAuth, getRecentConversation);
router.get('/chatRoom/:roomId', isAuth, getConversationByRoomId);
router.post('/initiate', isAuth, initiate);
router.post('/chatRoom/:roomId/message', isAuth, postMessage);
router.put('/chatRoom/:roomId/mark-read', isAuth, markConversationReadByRoomId);
router.delete('/chatRoom/room/:roomId', isAuth, deleteRoomById);
router.delete('/chatRoom/message/:messageId', isAuth, deleteMessageById);
router.put('/:roomId/mark-read', isAuth, markConversationReadByRoomId);

module.exports = router;

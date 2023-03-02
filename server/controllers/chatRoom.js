const makeValidation = require('@withvoid/make-validation');
const User = require('../models/user');
const ChatRoomModel = require('../models/chatRoom');
const ChatMessageModel = require('../models/chatMessage');
exports.initiate = async (req, res) => {
  try {
    const validation = makeValidation(types => ({
      payload: req.body,
      checks: {
        userIds: {
          type: types.array,
          options: {unique: true, empty: false, stringOnly: true},
        },
        name: {
          type: types.string,
          options: {unique: true, empty: false, stringOnly: true},
        },
        //type: {type: types.enum, options: {enum: CHAT_ROOM_TYPES}},
      },
    }));
    if (!validation.success) return res.status(400).json({...validation});

    const {userIds, name} = req.body;
    // const {userId: chatInitiator} = req;
    const chatInitiator = req.user.username;
    const allUserIds = [...userIds, chatInitiator];
    const chatRoom = await ChatRoomModel.initiateChat(
      allUserIds,
      name,
      chatInitiator,
    );
    return res.status(200).json({success: true, chatRoom});
  } catch (error) {
    return res.status(500).json({success: false, error: error});
  }
};
exports.postMessage = async (req, res) => {
  try {
    const {roomId} = req.params;
    const validation = makeValidation(types => ({
      payload: req.body,
      checks: {
        messageText: {type: types.string},
      },
    }));
    if (!validation.success) return res.status(400).json({...validation});

    const messagePayload = {
      messageText: req.body.messageText,
    };
    const currentLoggedUser = req.user.username;
    const post = await ChatMessageModel.createPostInChatRoom(
      roomId,
      messagePayload,
      currentLoggedUser,
    );
    global.io.sockets.in(roomId).emit('new message', {message: post});
    return res.status(200).json({success: true, post});
  } catch (error) {
    return res.status(500).json({success: false, error: error});
  }
};
exports.getRecentConversation = async (req, res) => {
  try {
    const currentLoggedUser = req.user.username;
    const options = {
      page: parseInt(req.query.page) || 0,
      limit: parseInt(req.query.limit) || 10,
    };
    const rooms = await ChatRoomModel.getChatRoomsByUserId(currentLoggedUser);
    const roomIds = rooms.map(room => room._id);
    const recentConversation = await ChatMessageModel.getRecentConversation(
      roomIds,
      options,
      currentLoggedUser,
    );
    return res
      .status(200)
      .json({success: true, conversation: recentConversation});
  } catch (error) {
    return res.status(500).json({success: false, error: error});
  }
};
exports.getConversationByRoomId = async (req, res) => {
  try {
    const {roomId} = req.params;
    const room = await ChatRoomModel.getChatRoomByRoomId(roomId);
    if (!room) {
      return res.status(400).json({
        success: false,
        message: 'No room exists for this id',
      });
    }
    const users = await User.getUserByIds(room.userIds);
    const options = {
      page: parseInt(req.query.page) || 0,
      limit: parseInt(req.query.limit) || 10,
    };
    const conversation = await ChatMessageModel.getConversationByRoomId(
      roomId,
      options,
    );
    return res.status(200).json({
      success: true,
      conversation,
      users,
    });
  } catch (error) {
    return res.status(500).json({success: false, error});
  }
};
exports.markConversationReadByRoomId = async (req, res) => {
  try {
    const {roomId} = req.params;
    const room = await ChatRoomModel.getChatRoomByRoomId(roomId);
    if (!room) {
      return res.status(400).json({
        success: false,
        message: 'No room exists for this id',
      });
    }

    const currentLoggedUser = req.userId;
    const result = await ChatMessageModel.markMessageRead(
      roomId,
      currentLoggedUser,
    );
    return res.status(200).json({success: true, data: result});
  } catch (error) {
    console.log(error);
    return res.status(500).json({success: false, error});
  }
};
exports.deleteRoomById = async (req, res) => {
  try {
    const {roomId} = req.params;
    const room = await ChatRoomModel.remove({_id: roomId});
    const messages = await ChatMessageModel.remove({chatRoomId: roomId});
    return res.status(200).json({
      success: true,
      message: 'Operation performed successfully',
      deletedRoomsCount: room.deletedCount,
      deletedMessagesCount: messages.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({success: false, error: error});
  }
};
exports.deleteMessageById = async (req, res) => {
  try {
    const {messageId} = req.params;
    const message = await ChatMessageModel.remove({_id: messageId});
    return res.status(200).json({
      success: true,
      deletedMessagesCount: message.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({success: false, error: error});
  }
};

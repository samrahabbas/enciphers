const mongoose = require('mongoose');
const uuid = require('uuid').v4();

const chatRoomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuid.replace(/\-/g, ''),
    },
    userIds: Array,
    name: String,
    chatInitiator: String,
  },
  {
    timestamps: true,
    collection: 'chatrooms',
  },
);

chatRoomSchema.statics.initiateChat = async function (
  userIds,
  name,
  chatInitiator,
) {
  try {
    const availableRoom = await this.findOne({
      userIds: {
        $size: userIds.length,
        $all: [...userIds],
      },
      name,
    });
    if (availableRoom) {
      return {
        isNew: false,
        message: 'retrieving an old chat room',
        chatRoomId: availableRoom._doc._id,
        name: availableRoom._doc.name,
      };
    }

    const newRoom = await this.create({userIds, name, chatInitiator});
    return {
      isNew: true,
      message: 'creating a new chatroom',
      chatRoomId: newRoom._doc._id,
      name: newRoom._doc.name,
    };
  } catch (error) {
    console.log('error on start chat method', error);
    throw error;
  }
};

chatRoomSchema.statics.getChatRoomByRoomId = async function (roomId) {
  try {
    const room = await this.findOne({_id: roomId});
    return room;
  } catch (error) {
    throw error;
  }
};

chatRoomSchema.statics.getChatRoomsByUserId = async function (userId) {
  try {
    const rooms = await this.find({userIds: {$all: [userId]}});
    return rooms;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('ChatRoom', chatRoomSchema);

const mongoose = require('mongoose');
const uuid = require('uuid').v4();

const chatSchema = new mongoose.Schema(
  {
    chatName: {type: String, trim: true},
    isGroupChat: {type: Boolean, default: false},
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    groupAvatar: {
      type: String,
      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
  },
  {
    timestamps: true,
    collection: 'chats',
  },
);

module.exports = mongoose.model('Chat', chatSchema);

// const chatSchema = new mongoose.Schema(
//   {
//     _id: {
//       type: String,
//       default: () => uuid.replace(/\-/g, ''),
//     },
//     sender: Object,
//     receiver: Object,
//     userIds: Array,
//   },
//   {
//     timestamps: true,
//     collection: 'chats',
//   },
// );

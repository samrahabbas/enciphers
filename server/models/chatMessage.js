const mongoose = require('mongoose');
const uuid = require('uuid').v4();

const MESSAGE_TYPES = {
  TYPE_TEXT: 'text',
};

const readByRecipientSchema = new mongoose.Schema(
  {
    _id: false,
    readByUserId: String,
    readAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: false,
  },
);

const chatMessageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuid.replace(/\-/g, ''),
    },
    chatRoomId: String,
    message: mongoose.Schema.Types.Mixed,
    type: {
      type: String,
      default: () => MESSAGE_TYPES.TYPE_TEXT,
    },
    postedByUser: String,
    readByRecipients: [readByRecipientSchema],
  },
  {
    timestamps: true,
    collection: 'chatmessages',
  },
);

chatMessageSchema.statics.createPostInChatRoom = async function (
  chatRoomId,
  message,
  postedByUser,
) {
  try {
    const post = await this.create({
      chatRoomId,
      message,
      postedByUser,
      readByRecipients: {readByUserId: postedByUser},
    });
    const aggregate = await this.aggregate([
      // get post where _id = post._id
      {$match: {_id: post._id}},
      // do a join on another table called users, and
      // get me a user whose _id = postedByUser
      {
        $lookup: {
          from: 'users',
          localField: 'postedByUser',
          foreignField: 'username',
          as: 'postedByUser',
          pipeline: [{$project: {password: 0}}],
        },
      },
      {$unwind: '$postedByUser'},
      // do a join on another table called chatrooms, and
      // get me a chatroom whose _id = chatRoomId
      {
        $lookup: {
          from: 'chatrooms',
          localField: 'chatRoomId',
          foreignField: '_id',
          as: 'chatRoomInfo',
        },
      },
      {$unwind: '$chatRoomInfo'},
      {$unwind: '$chatRoomInfo.userIds'},
      // // do a join on another table called users, and
      // // get me a user whose _id = userIds
      {
        $lookup: {
          from: 'users',
          localField: 'chatRoomInfo.userIds',
          foreignField: 'username',
          as: 'chatRoomInfo.userProfile',
          pipeline: [{$project: {password: 0}}],
        },
      },
      {$unwind: '$chatRoomInfo.userProfile'},
      // // group data
      {
        $group: {
          _id: '$chatRoomInfo._id',
          postId: {$last: '$_id'},
          chatRoomId: {$last: '$chatRoomInfo._id'},
          message: {$last: '$message'},
          type: {$last: '$type'},
          postedByUser: {$last: '$postedByUser'},
          readByRecipients: {$last: '$readByRecipients'},
          chatRoomInfo: {$addToSet: '$chatRoomInfo.userProfile'},
          createdAt: {$last: '$createdAt'},
          updatedAt: {$last: '$updatedAt'},
        },
      },
    ]);
    return aggregate[0];
  } catch (error) {
    throw error;
  }
};

chatMessageSchema.statics.getConversationByRoomId = async function (
  chatRoomId,
  options = {},
) {
  try {
    return this.aggregate([
      {$match: {chatRoomId}},
      {$sort: {createdAt: -1}},
      // do a join on another table called users, and
      // get me a user whose _id = postedByUser
      {
        $lookup: {
          from: 'users',
          localField: 'postedByUser',
          foreignField: 'username',
          as: 'postedByUser',
          pipeline: [{$project: {password: 0}}],
        },
      },
      {$unwind: '$postedByUser'},
      // apply pagination
      {$skip: options.page * options.limit},
      {$limit: options.limit},
      {$sort: {createdAt: 1}},
    ]);
  } catch (error) {
    throw error;
  }
};

chatMessageSchema.statics.markMessageRead = async function (
  chatRoomId,
  currentUserOnlineId,
) {
  try {
    return this.updateMany(
      {
        chatRoomId,
        'readByRecipients.readByUserId': {$ne: currentUserOnlineId},
      },
      {
        $addToSet: {
          readByRecipients: {readByUserId: currentUserOnlineId},
        },
      },
      {
        multi: true,
      },
    );
  } catch (error) {
    throw error;
  }
};

chatMessageSchema.statics.getRecentConversation = async function (
  chatRoomIds,
  options,
  currentUserOnlineId,
) {
  try {
    return this.aggregate([
      {$match: {chatRoomId: {$in: chatRoomIds}}},
      {
        $group: {
          _id: '$chatRoomId',
          messageId: {$last: '$_id'},
          chatRoomId: {$last: '$chatRoomId'},
          message: {$last: '$message'},
          type: {$last: '$type'},
          postedByUser: {$last: '$postedByUser'},
          createdAt: {$last: '$createdAt'},
          readByRecipients: {$last: '$readByRecipients'},
        },
      },
      {$sort: {createdAt: -1}},
      // do a join on another table called users, and
      // get me a user whose _id = postedByUser
      {
        $lookup: {
          from: 'users',
          localField: 'postedByUser',
          foreignField: 'username',
          as: 'postedByUser',
          pipeline: [{$project: {password: 0}}],
        },
      },
      {$unwind: '$postedByUser'},
      // do a join on another table called chatrooms, and
      // get me room details
      {
        $lookup: {
          from: 'chatrooms',
          localField: '_id',
          foreignField: '_id',
          as: 'roomInfo',
        },
      },
      {$unwind: '$roomInfo'},
      {$unwind: '$roomInfo.userIds'},
      // do a join on another table called users
      {
        $lookup: {
          from: 'users',
          localField: 'roomInfo.userIds',
          foreignField: 'username',
          as: 'roomInfo.userProfile',
          pipeline: [{$project: {password: 0}}],
        },
      },
      {$unwind: '$readByRecipients'},
      // do a join on another table called users
      {
        $lookup: {
          from: 'users',
          localField: 'readByRecipients.readByUserId',
          foreignField: 'username',
          as: 'readByRecipients.readByUser',
          pipeline: [{$project: {password: 0}}],
        },
      },

      {
        $group: {
          _id: '$roomInfo._id',
          messageId: {$last: '$messageId'},
          chatRoomId: {$last: '$chatRoomId'},
          message: {$last: '$message'},
          type: {$last: '$type'},
          postedByUser: {$last: '$postedByUser'},
          readByRecipients: {$addToSet: '$readByRecipients'},
          roomInfo: {$addToSet: '$roomInfo.userProfile'},
          createdAt: {$last: '$createdAt'},
        },
      },
      // apply pagination
      {$skip: options.page * options.limit},
      {$limit: options.limit},
    ]);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('ChatMessage', chatMessageSchema);

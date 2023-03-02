const Chat = require('../models/chat');
const User = require('../models/user');

exports.accessChat = async (req, res) => {
  const {userId} = req.body;

  if (!userId) {
    console.log('UserId param not sent with request');
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      {users: {$elemMatch: {$eq: req.user._id}}},
      {users: {$elemMatch: {$eq: userId}}},
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'username avatar',
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({_id: createdChat._id}).populate(
        'users',
        '-password',
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

exports.fetchChats = async (req, res) => {
  try {
    Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({updatedAt: -1})
      .then(async results => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'username avatar',
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

exports.createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({message: 'Please Fill all the fields'});
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send('More than 2 users are required to form a group chat');
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({_id: groupChat._id})
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

exports.renameGroup = async (req, res) => {
  const {chatId, chatName} = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    },
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedChat) {
    res.send(400);
    throw new Error('Chat Not Found');
  } else {
    res.json(updatedChat);
  }
};

exports.addToGroup = async (req, res) => {
  const {chatId, userId} = req.body;
  //const userIds = JSON.parse(userId);  //for postman

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        users: {
          $each: userId,
        },
      },
    },
    {
      new: true,
    },
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!added) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json(added);
  }
};

exports.removeFromGroup = async (req, res) => {
  const {chatId, userId} = req.body;
  //const userIds = JSON.parse(userId); //for postman

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: {users: {$in: userId}},
    },
    {
      new: true,
    },
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json(removed);
  }
};

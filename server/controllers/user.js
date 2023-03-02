const sharp = require('sharp');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const cloudinary = require('../helper/imageUpload');

exports.createUser = async (req, res) => {
  const {username, password, confirmPassword} = req.body;
  const isNewUser = await User.isThisUsernameInUse(username);
  if (!isNewUser)
    return res.json({
      success: false,
      message: 'This username is already in use, try sign-in',
    });
  const user = await User({username, password, confirmPassword});
  await user.save();
  res.json(user);
};

exports.userSignIn = async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({username});

  if (!user)
    return res.json({
      success: false,
      message: 'user not found, with the given username!',
    });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.json({
      success: false,
      message: 'username / password does not match!',
    });

  const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({success: true, user: user, token});
};

exports.uploadProfile = async (req, res) => {
  const {user} = req;
  if (!user)
    return res
      .status(401)
      .json({success: false, message: 'unauthorized access!'});

  try {
    // const profileBuffer = req.file.buffer;
    // const {width, height} = await sharp(profileBuffer).metadata();
    // const avatar = await sharp(profileBuffer)
    //   .resize(Math.round(width * 0.5), Math.round(height * 0.5))
    //   .toBuffer();
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${user._id}_profile`,
      width: 500,
      height: 500,
      crop: 'fill',
    });

    await User.findByIdAndUpdate(user._id, {avatar: result.url});
    res.status(201).json({success: true, message: 'Your profile has updated!'});
  } catch (error) {
    res
      .status(500)
      .json({success: false, message: 'server error, try after some time'});
    console.log('Error while uploading profile image', error.message);
  }
};

exports.onGetAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json({success: true, users});
  } catch (error) {
    return res.status(500).json({success: false, error: error});
  }
};

exports.onGetUserById = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    return res.status(200).json({success: true, user});
  } catch (error) {
    return res.status(500).json({success: false, error: error});
  }
};

exports.onDeleteUserById = async (req, res) => {};

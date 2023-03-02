const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createUser,
  userSignIn,
  uploadProfile,
  onGetAllUsers,
  onGetUserById,
  onDeleteUserById,
} = require('../controllers/user');
const {isAuth} = require('../middlewares/auth');
const {
  validateUserSignup,
  userValidation,
  validateUserSignIn,
} = require('../middlewares/validation/user');
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('invalid image file!', false);
  }
};

const uploads = multer({storage, fileFilter});

router.post('/create-user', validateUserSignup, userValidation, createUser);
router.post('/sign-in', validateUserSignIn, userValidation, userSignIn);
router.post(
  '/upload-profile',
  isAuth,
  uploads.single('profile'),
  uploadProfile,
);
router.get('/users', isAuth, onGetAllUsers);
router.get('/users/:id', isAuth, onGetUserById);
router.delete('/users/:id', isAuth, onDeleteUserById);

module.exports = router;

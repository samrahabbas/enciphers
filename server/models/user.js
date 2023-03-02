const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    nickname: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    about: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {timestamps: true},
);

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  }
});

userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error('Password is missing, can not compare!');

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log('Error while comparing passwords!', error.message);
  }
};

userSchema.statics.isThisUsernameInUse = async function (username) {
  if (!username) throw new Error('Invalid username');
  try {
    const user = await this.findOne({username});
    if (user) return false;
    return true;
  } catch (error) {
    console.log('error in isThisUsernameInUse', error);
    return false;
  }
};

userSchema.statics.getUserById = async function (username) {
  try {
    const user = await this.findOne({username});
    if (!user) throw {error: 'No user with this username found'};
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUsers = async function () {
  try {
    const users = await this.find();
    return users;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUserByIds = async function (ids) {
  try {
    const users = await this.find({username: {$in: ids}});
    return users;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema);

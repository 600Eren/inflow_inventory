const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique:true,
  
  },
});

// static signup method
userSchema.statics.signup = async function (email, password, fullName, phoneNumber) {
  // Validation
  if (!email || !password || !fullName || !phoneNumber) {
    throw Error('All fields must be filled');
  }

  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw Error('Email already in use by a user');
  }

  const phoneExists = await this.findOne({ phoneNumber });
  if (phoneExists) {
    throw Error('Phone number already in use by a user');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, fullName, phoneNumber });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Incorrect email');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);

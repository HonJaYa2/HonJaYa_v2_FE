const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  kakao_nickname: { type: String, required: true },
  kakao_profileImage: { type: String, required: true },
  birthday: {type: Date},
  gender: {type: Boolean},
  height: {type: Number},
  weight: {type: Number},
  mbti: {type: String},
  religion: {type: String},
  drinkAmount: {type: String},
  smoke: {type: Boolean},
  address: {type: String}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

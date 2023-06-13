import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  verificationCode: {
    type: Number,
    expires: 120,
  },
  verificationCodeExpiresAt: { type: Date },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profilePhoto:{
    type:String
  }
});

export const User = mongoose.model('User', schema);

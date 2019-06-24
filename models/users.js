import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String },
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: { type: String },
  email_verified: { type: Boolean, default: false },
  otp: {type: String, default: null },
  deleted: {
    type: String,
    default: 'no'
  },
  dob: {
    type: String,
    default: null
  },
  role: {
    type: String,
    default: 'user'
  },
  created_at: {
    type: String,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  publicKey: {
    type: String,
    default: null
  },
  base58: {
    type: String,
    default: null
  },
  hex: {
    type: String,
    default: null
  }
});

export default mongoose.model('User', userSchema);

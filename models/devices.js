import mongoose from 'mongoose';

const { Schema } = mongoose;

const deviceSchema = new Schema({
  name: { type: String },
  image: { type: String, },
  url: { type: String, },
  description: { type: String, },
  created_at: {
    type: String,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Device', deviceSchema);

import mongoose from 'mongoose';

const { Schema } = mongoose;

const contentSchema = new Schema({
  title: { type: String },
  sub_title: { type: String },
  image: { type: String, },
  image_description: { type: String, },
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

export default mongoose.model('Content', contentSchema);

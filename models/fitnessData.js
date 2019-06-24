import mongoose from 'mongoose';

const { Schema } = mongoose;

const fitnessSchema = new Schema({
  dataset: [],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required:true
  },
  userAge: {
    type: Number,
    required:true
  },
  device_type: {
    type: String,
    enum: ['fitbit', 'custom'],
    required: true
  },
  offset: {
    type: String,
    required: true,
    default: 0
  },
  dataset_type: { // heartrate etc.
    type: String,
    required: true,
  },
  dateTime: {
    type: String,
    required:true
  },
  created: {
    type: String,
    default: Date.now()
  },
  updated: {
    type: String,
    default: Date.now()
  }
});

export default mongoose.model('Fitness', fitnessSchema);

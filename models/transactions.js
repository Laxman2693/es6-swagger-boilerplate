import mongoose from 'mongoose';

const { Schema } = mongoose;

const transactionSchema = new Schema({}, { strict: false });

export default mongoose.model('Transaction', transactionSchema);

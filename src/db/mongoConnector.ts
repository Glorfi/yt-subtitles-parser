import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dbConnect from '../../api/dbConnect.js';
import { log } from 'console';
import transcriptSchema from './models/transcriptSchema.js';

dotenv.config();
const currentDb =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGO_LINK
    : 'mongodb://127.0.0.1:27017/exsdb';

await dbConnect()
  .then(() => console.log('Connected to main MongoDB'))
  .catch(() => console.log('Error occured'));

const Transcripts = mongoose.model('transcript', transcriptSchema);

export { Transcripts };

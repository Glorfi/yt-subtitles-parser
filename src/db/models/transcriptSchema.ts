import { required } from 'joi';
import mongoose from 'mongoose';

const SubtitleSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },

  offset: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    required: true,
  },
});

const transcriptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  subtitleList: [SubtitleSchema],
  rawText: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

transcriptSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default transcriptSchema;

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGO_LINK
    : 'mongodb://127.0.0.1:27017/parser';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('=> using existing database connection');
    return cached.conn;
  }
  if (!cached.promise) {
    console.log('=> creating new database connection');
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }
  try {
    cached.conn = await cached.promise;
    // cached.conn.models.Users = mongoose.models.users || mongoose.model('users', userSchema);
    // cached.conn.models.Exercises = mongoose.models.exercises || mongoose.model('exercises', exerciseSchema);
    // cached.conn.models.Sentences = mongoose.models.sentences || mongoose.model('sentences', sentenceSchema);
    // cached.conn.models.Topics = mongoose.models.topics || mongoose.model('topics', topicSchema);
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;

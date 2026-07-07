// lib/mongodb.ts
// Mongoose singleton for Next.js serverless — prevents multiple connections during hot-reload

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

/* eslint-disable no-var */
declare global {
  var _mongooseConn: typeof mongoose | null;
  var _mongoosePromise: Promise<typeof mongoose> | null;
}
/* eslint-enable no-var */

let cached = global._mongooseConn;
let cachedPromise = global._mongoosePromise;

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in .env.local");
  }

  if (cached) return cached;

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached = await cachedPromise;
  global._mongooseConn = cached;
  global._mongoosePromise = cachedPromise;
  return cached;
}

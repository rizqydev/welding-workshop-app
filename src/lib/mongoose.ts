import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment inside.env")
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development.This prevents connections growing exponentially.
 */
let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } =
  // @ts-ignore
  globalThis._mongooseCache || { conn: null, promise: null }

const dbConnect = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseRes) => mongooseRes)
  }

  cached.conn = await cached.promise

  return cached.conn
}

export default dbConnect

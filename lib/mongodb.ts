import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  // Do not throw during client-side builds; the file should only be used server-side.
  // If you attempt to import this file on the client, it will be empty and not connect.
  throw new Error("MONGODB_URI is not set in environment variables.");
}

let cached: { client?: MongoClient; promise?: Promise<MongoClient> } =
  (global as any).__mongo || {};
if (!cached.client) {
  const client = new MongoClient(uri);
  const promise = client.connect().then(() => client);
  cached = { client, promise };
  (global as any).__mongo = cached;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (cached.client) return cached.client;
  if (cached.promise) return cached.promise;
  // Fallback (should not happen)
  const client = new MongoClient(uri);
  await client.connect();
  cached = { client };
  (global as any).__mongo = cached;
  return client;
}

export async function getDb(dbName?: string) {
  const client = await getMongoClient();
  return client.db(dbName);
}

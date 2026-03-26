import { MongoClient, Db, Collection, Filter, OptionalUnlessRequiredId } from 'mongodb';
import { JsonRepository, Repository } from './db/json-db';

// --- MongoDB Repository ---
class MongoRepository<T extends { id: string }> implements Repository<T> {
  private collection: Collection<T>;

  constructor(collection: Collection<T>) {
    this.collection = collection;
  }

  async findAll(): Promise<T[]> {
    return this.collection.find({}).toArray() as Promise<T[]>;
  }

  async findById(id: string): Promise<T | null> {
    return this.collection.findOne({ id } as Filter<T>) as Promise<T | null>;
  }

  async findBy(predicate: (item: T) => boolean): Promise<T[]> {
    // For complex predicates, fall back to in-memory filter
    const all = await this.findAll();
    return all.filter(predicate);
  }

  async create(item: T): Promise<T> {
    await this.collection.insertOne(item as OptionalUnlessRequiredId<T>);
    return item;
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const result = await this.collection.findOneAndUpdate(
      { id } as Filter<T>,
      { $set: updates } as any,
      { returnDocument: 'after' }
    );
    return result as T | null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ id } as Filter<T>);
    return result.deletedCount > 0;
  }
}

// --- Connection & Factory ---
let client: MongoClient | null = null;
let db: Db | null = null;

async function getMongoDb(): Promise<Db | null> {
  const connectionString = process.env.COSMOS_DB_CONNECTION;
  if (!connectionString) return null;

  if (db) return db;

  try {
    client = new MongoClient(connectionString, {
      retryWrites: false, // CosmosDB doesn't support retryWrites
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    await client.connect();
    db = client.db('pickpick');
    console.log('✅ Connected to CosmosDB');
    return db;
  } catch (error) {
    console.error('❌ Failed to connect to CosmosDB, falling back to JSON:', error);
    return null;
  }
}

// Cached repositories
const repos: Record<string, Repository<any>> = {};

export async function getRepository<T extends { id: string }>(
  collection: 'users' | 'packages' | 'families' | 'notifications'
): Promise<Repository<T>> {
  if (repos[collection]) return repos[collection];

  const mongodb = await getMongoDb();
  if (mongodb) {
    repos[collection] = new MongoRepository<T>(mongodb.collection<T>(collection));
  } else {
    repos[collection] = new JsonRepository<T>(collection);
  }

  return repos[collection];
}

// Convenience getters
export async function getUsersRepo() {
  const { User } = await import('@/models/user');
  return getRepository<import('@/models/user').User>('users');
}

export async function getPackagesRepo() {
  return getRepository<import('@/models/package').PackageModel>('packages');
}

export async function getFamiliesRepo() {
  return getRepository<import('@/models/family').Family>('families');
}

export async function getNotificationsRepo() {
  return getRepository<import('@/models/notification').Notification>('notifications');
}

// Cleanup on shutdown
export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

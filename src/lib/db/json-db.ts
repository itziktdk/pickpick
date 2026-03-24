import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DB_PATH = process.env.DATABASE_PATH || './data';

let writeLock = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const result = writeLock.then(fn, fn);
  writeLock = result.then(() => {}, () => {});
  return result;
}

export interface Repository<T extends { id: string }> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findBy(predicate: (item: T) => boolean): Promise<T[]>;
  create(item: T): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export class JsonRepository<T extends { id: string }> implements Repository<T> {
  private filePath: string;

  constructor(collection: string) {
    this.filePath = path.join(DB_PATH, `${collection}.json`);
  }

  private async readData(): Promise<T[]> {
    try {
      if (!existsSync(this.filePath)) return [];
      const raw = await readFile(this.filePath, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private async writeData(data: T[]): Promise<void> {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async findAll(): Promise<T[]> {
    return this.readData();
  }

  async findById(id: string): Promise<T | null> {
    const data = await this.readData();
    return data.find(item => item.id === id) || null;
  }

  async findBy(predicate: (item: T) => boolean): Promise<T[]> {
    const data = await this.readData();
    return data.filter(predicate);
  }

  async create(item: T): Promise<T> {
    return withLock(async () => {
      const data = await this.readData();
      data.push(item);
      await this.writeData(data);
      return item;
    });
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    return withLock(async () => {
      const data = await this.readData();
      const index = data.findIndex(item => item.id === id);
      if (index === -1) return null;
      data[index] = { ...data[index], ...updates };
      await this.writeData(data);
      return data[index];
    });
  }

  async delete(id: string): Promise<boolean> {
    return withLock(async () => {
      const data = await this.readData();
      const index = data.findIndex(item => item.id === id);
      if (index === -1) return false;
      data.splice(index, 1);
      await this.writeData(data);
      return true;
    });
  }
}

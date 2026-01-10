import { type User, type InsertUser, type SupportRequest, type InsertSupportRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSupportRequest(request: InsertSupportRequest): Promise<SupportRequest>;
  getSupportRequests(): Promise<SupportRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private supportRequests: Map<string, SupportRequest>;

  constructor() {
    this.users = new Map();
    this.supportRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSupportRequest(insertRequest: InsertSupportRequest): Promise<SupportRequest> {
    const id = randomUUID();
    const request: SupportRequest = {
      ...insertRequest,
      id,
      createdAt: new Date(),
    };
    this.supportRequests.set(id, request);
    return request;
  }

  async getSupportRequests(): Promise<SupportRequest[]> {
    return Array.from(this.supportRequests.values());
  }
}

export const storage = new MemStorage();

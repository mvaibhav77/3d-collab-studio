import { PrismaClient } from "@prisma/client";
import type { CollaborativeSession, CustomModel } from "@repo/types";

export class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log("Connected to PostgreSQL database");
    } catch (error) {
      console.error("Failed to connect to database:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  // Create a new session
  async createSession(name: string): Promise<CollaborativeSession> {
    const session = await this.prisma.session.create({
      data: {
        name,
        sceneData: {},
      },
    });

    return {
      id: session.id,
      name: session.name,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      customModels: [], 
      sceneData: session.sceneData as Record<string, any>,
    };
  }

  // Get session by ID
  async getSession(sessionId: string): Promise<CollaborativeSession | null> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { customModels: true },
    });

    if (!session) return null;

    return {
      id: session.id,
      name: session.name,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      customModels: session.customModels as CustomModel[],
      sceneData: session.sceneData as Record<string, any>,
    };
  }

  // Update session scene data
  async updateSession(
    sessionId: string,
    sceneData: Record<string, any>
  ): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        sceneData,
        updatedAt: new Date(),
      },
    });
  }

  // Delete session
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      await this.prisma.session.delete({
        where: { id: sessionId },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Create a new model entry
  async createCustomModel(
    name: string,
    appwriteId: string,
    sessionId: string
  ): Promise<CustomModel> {
    const model = await this.prisma.customModel.create({
      data: {
        name,
        appwriteId,
        sessionId,
      },
    });

    return model;
  }
}

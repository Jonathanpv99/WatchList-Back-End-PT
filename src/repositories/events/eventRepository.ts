import { PrismaClient } from "@prisma/client";

export default class EventRepository {
  static prisma = new PrismaClient();

  static async create(data: {
    message: string;
    summary?: string;
    severity?: string;
    suggestion?: string;
    watchlistId: string;
  }) {
    return await this.prisma.$transaction(async (prisma) => {
      try {
        const event = await prisma.event.create({
          data: {
            message: data.message,
            summary: data.summary,
            severity: data.severity,
            suggestion: data.suggestion,
            watchlistId: data.watchlistId,
          },
          include: {
            watchlist: true,
          },
        });

        return event;
      } catch (error) {
        throw error;
      }
    });
  }

  static async getAll() {
    try {
      const events = await this.prisma.event.findMany({
        include: {
          watchlist: true,
        },
      });

      return events;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id: string) {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: id,
        },
        include: {
          watchlist: true,
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      return event;
    } catch (error) {
      throw error;
    }
  }
}

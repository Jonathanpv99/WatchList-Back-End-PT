import { PrismaClient } from "@prisma/client";
import logger from "../../utils/logger";

export default class EventRepository {
  static prisma = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
    ],
  });

  static async create(data: {
    message: string;
    summary?: string;
    severity?: string;
    suggestion?: string;
    watchlistId: string;
  }) {
    return await this.prisma.$transaction(async (prisma) => {
      try {
        logger.info({ operation: 'create', repository: 'EventRepository', watchlistId: data.watchlistId }, "Creating event in database");
        
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
        
        logger.info({ eventId: event.id, watchlistId: data.watchlistId }, "Event created in database");
        
        return event;
      } catch (error) {
        logger.error({ error: error.message, stack: error.stack, operation: 'create', repository: 'EventRepository', watchlistId: data.watchlistId }, "Database error creating event");
        throw error;
      }
    });
  }

  static async getAll() {
    try {
      logger.info({ operation: 'getAll', repository: 'EventRepository' }, "Getting all events from database");
      
      const events = await this.prisma.event.findMany({
        include: {
          watchlist: true,
        },
      });
      
      logger.info({ count: events.length }, "Events retrieved from database");
      
      return events;
    } catch (error) {
      logger.error({ error: error.message, stack: error.stack, operation: 'getAll', repository: 'EventRepository' }, "Database error retrieving events");
      throw error;
    }
  }

  static async getById(id: string) {
    try {
      logger.info({ operation: 'getById', repository: 'EventRepository', eventId: id }, "Getting event from database");
      
      const event = await this.prisma.event.findUnique({
        where: {
          id: id,
        },
        include: {
          watchlist: true,
        },
      });

      if (!event) {
        logger.warn({ eventId: id }, "Event not found in database");
        throw new Error("Event not found");
      }
      
      logger.info({ eventId: id }, "Event retrieved from database");
      
      return event;
    } catch (error) {
      logger.error({ eventId: id, error: error.message, stack: error.stack, operation: 'getById', repository: 'EventRepository' }, "Database error retrieving event");
      throw error;
    }
  }
}

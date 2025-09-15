import { PrismaClient } from "@prisma/client";
import logger from "../../utils/logger";

export default class WatchListRepository {
  static prisma = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
    ],
  });

  static async create(data: {
    name: string;
    terms: string[];
    events: string[];
  }) {
    return await this.prisma.$transaction(async (prisma) => {
      try {
        logger.info({ operation: 'create', repository: 'WatchListRepository' }, "Creating watchlist in database");
        
        const watchlist = await prisma.watchlist.create({
          data: {
            name: data.name,
            terms: data.terms || [],
            events: data.events || [],
          },
        });
        
        logger.info({ watchlistId: watchlist.id }, "Watchlist created in database");
        
        return watchlist;
      } catch (error) {
        logger.error({ error: error.message, stack: error.stack, operation: 'create', repository: 'WatchListRepository' }, "Database error creating watchlist");
        throw error;
      }
    });
  }

  static async getById(id: string) {
    try {
      logger.info({ operation: 'getById', repository: 'WatchListRepository', watchlistId: id }, "Getting watchlist from database");
      
      const watchlist = await this.prisma.watchlist.findUnique({
        where: {
          id: id,
        },
      });

      if (!watchlist) {
        logger.warn({ watchlistId: id }, "Watchlist not found in database");
        throw new Error("Watchlist not found");
      }
      
      logger.info({ watchlistId: id }, "Watchlist retrieved from database");
      
      return watchlist;
    } catch (error) {
      logger.error({ watchlistId: id, error: error.message, stack: error.stack, operation: 'getById', repository: 'WatchListRepository' }, "Database error retrieving watchlist");
      throw error;
    }
  }
}

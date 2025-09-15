import { PrismaClient } from "@prisma/client";

export default class WatchListRepository {
  static prisma = new PrismaClient();

  static async create(data: {
    name: string;
    terms: string[];
    events: string[];
  }) {
    return await this.prisma.$transaction(async (prisma) => {
      try {
        const watchlist = await prisma.watchlist.create({
          data: {
            name: data.name,
            terms: data.terms || [],
            events: data.events || [],
          },
        });

        return watchlist;
      } catch (error) {
        throw error;
      }
    });
  }

  static async getById(id: string) {
    try {
      const watchlist = await this.prisma.watchlist.findUnique({
        where: {
          id: id,
        },
      });

      if (!watchlist) {
        throw new Error("Watchlist not found");
      }

      return watchlist;
    } catch (error) {
      throw error;
    }
  }
}

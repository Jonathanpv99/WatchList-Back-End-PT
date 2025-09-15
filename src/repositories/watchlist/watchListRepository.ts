import { PrismaClient } from "@prisma/client";

export default class WatchListRepository {
  static prisma = new PrismaClient();

  // Método unificado que siempre usa transacción
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
}

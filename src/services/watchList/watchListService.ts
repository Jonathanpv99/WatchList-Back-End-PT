import WatchListRepository from "../../repositories/watchlist/watchListRepository";
import logger from "../../utils/logger";

class WatchListService {
  options;

  constructor(options) {
    this.options = options;
  }

  // Método unificado que maneja tanto instancia como estático
  static async create(
    data: { name: string; terms: string[]; events: string[] },
    options = {
      req: {
        correlationId: "",
      },
    }
  ) {
    const correlationId = options.req?.correlationId;

    try {
      logger.info(
        { correlationId, operation: "create", service: "WatchListService" },
        "Creating watchlist"
      );

      // Usar el repositorio para crear el watchlist con transacción
      const watchlist = await WatchListRepository.create(data);

      logger.info(
        { correlationId, watchlistId: watchlist.id },
        "Watchlist created in service"
      );

      return watchlist;
    } catch (error: any) {
      //aqui deberia hacer type guard.
      logger.error(
        {
          correlationId,
          error: error.message,
          stack: error.stack,
          operation: "create",
          service: "WatchListService",
        },
        "Error creating watchlist"
      );
      throw error;
    }
  }

  static async getById(
    id: string,
    options = {
      req: {
        correlationId: "",
      },
    }
  ) {
    const correlationId = options.req?.correlationId;

    try {
      logger.info(
        {
          correlationId,
          operation: "getById",
          service: "WatchListService",
          watchlistId: id,
        },
        "Getting watchlist by ID"
      );

      const watchlist = await WatchListRepository.getById(id);

      logger.info(
        { correlationId, watchlistId: id },
        "Watchlist retrieved in service"
      );

      return watchlist;
    } catch (error: any) {
      //aqui deberia hacer type guard.
      logger.error(
        {
          correlationId,
          watchlistId: id,
          error: error.message,
          stack: error.stack,
          operation: "getById",
          service: "WatchListService",
        },
        "Error retrieving watchlist"
      );
      throw error;
    }
  }
}

export default WatchListService;

import WatchListRepository from "../../repositories/watchlist/watchListRepository";

class WatchListService {
  options;

  constructor(options) {
    this.options = options;
  }

  // Método unificado que maneja tanto instancia como estático
  static async create(
    data: { name: string; terms: string[]; events: string[] },
    options = {}
  ) {
    try {
      // Usar el repositorio para crear el watchlist con transacción
      const watchlist = await WatchListRepository.create(data);
      return watchlist;
    } catch (error) {
      throw error;
    }
  }
}

export default WatchListService;

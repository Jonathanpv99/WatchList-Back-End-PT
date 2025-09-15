import WatchListRepository from "../../repositories/watchlist/watchListRepository";

class WatchListService {
  options;

  constructor(options) {
    this.options = options;
  }

  // Método unificado que maneja tanto instancia como estático
  static async create(data: {
    name: string;
    terms: string[];
    events: string[];
  }) {
    try {
      // Método para crear watchList
      const watchlist = await WatchListRepository.create(data);
      return watchlist;
    } catch (error) {
      throw error;
    }
  }

  // Método para obtener un watchlist por su ID
  static async getById(id: string) {
    try {
      const watchlist = await WatchListRepository.getById(id);
      return watchlist;
    } catch (error) {
      throw error;
    }
  }
}

export default WatchListService;

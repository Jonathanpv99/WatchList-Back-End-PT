import EventRepository from "../../repositories/events/eventRepository";

class EventService {
  options;

  constructor(options) {
    this.options = options;
  }
  // Método para crear evento
  static async create(data: {
    message: string;
    summary?: string;
    severity?: string;
    suggestion?: string;
    watchlistId: string;
  }) {
    try {
      const event = await EventRepository.create(data);
      return event;
    } catch (error) {
      throw error;
    }
  }
  // Método para obtener todos los eventos
  static async getAll() {
    try {
      const events = await EventRepository.getAll();
      return events;
    } catch (error) {
      throw error;
    }
  }
  // Método para obtener evento por ID
  static async getById(id: string) {
    try {
      const event = await EventRepository.getById(id);
      return event;
    } catch (error) {
      throw error;
    }
  }
}

export default EventService;

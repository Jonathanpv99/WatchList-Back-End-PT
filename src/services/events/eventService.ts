import EventRepository from "../../repositories/events/eventRepository";
import logger from "../../utils/logger";
import { processEventsWithAI } from "./utils/eventsUtils";
import { Severity } from "../../generated/prisma";

class EventService {
  options;

  constructor(options) {
    this.options = options;
  }

  static async create(
    data: {
      message: string;
      summary?: string;
      severity?: Severity;
      suggestion?: string;
      watchlistId: string;
    },
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
          operation: "create",
          service: "EventService",
          watchlistId: data.watchlistId,
        },
        "Creating event"
      );

      const event = await EventRepository.create(data);

      logger.info(
        { correlationId, eventId: event.id, watchlistId: data.watchlistId },
        "Event created in service"
      );

      return event;
    } catch (error: any) {
      //aqui deberia hacer type guard.
      logger.error(
        {
          correlationId,
          error: error.message,
          stack: error.stack,
          operation: "create",
          service: "EventService",
          watchlistId: data.watchlistId,
        },
        "Error creating event"
      );
      throw error;
    }
  }

  static async createMany(
    data: {
      terms: string[];
      events: string[];
      watchlistId: string;
    },
    options = {
      req: {
        correlationId: "",
      },
    }
  ) {
    const correlationId = options.req?.correlationId;

    const dataArray = processEventsWithAI(
      data.terms,
      data.events,
      data.watchlistId,
      correlationId
    );
    console.log("dataArray ", dataArray);
    try {
      logger.info(
        {
          correlationId,
          operation: "createMany",
          service: "EventService",
          //@ts-ignore
          count: dataArray?.length,
        },
        "Creating multiple events"
      );

      console.log("dataArray", dataArray);
      // @ts-ignore
      const events = await EventRepository.createMany(
        await dataArray,
        correlationId
      );

      logger.info({ correlationId }, "Multiple events created in service");

      return events;
    } catch (error: any) {
      //aqui deberia hacer type guard.
      logger.error(
        {
          correlationId,
          error: error.message,
          stack: error.stack,
          operation: "createMany",
          service: "EventService",
        },
        "Error creating multiple events"
      );
      throw error;
    }
  }

  static async getAll(
    options = {
      req: {
        correlationId: "",
      },
    }
  ) {
    const correlationId = options.req?.correlationId;

    try {
      logger.info(
        { correlationId, operation: "getAll", service: "EventService" },
        "Getting all events"
      );

      const events = await EventRepository.getAll();

      logger.info(
        { correlationId, count: events.length },
        "Events retrieved in service"
      );

      return events;
    } catch (error: any) {
      //aqui deberia hacer type guard.
      logger.error(
        {
          correlationId,
          error: error.message,
          stack: error.stack,
          operation: "getAll",
          service: "EventService",
        },
        "Error retrieving events"
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
          service: "EventService",
          eventId: id,
        },
        "Getting event by ID"
      );

      const event = await EventRepository.getById(id);

      logger.info({ correlationId, eventId: id }, "Event retrieved in service");

      return event;
    } catch (error: any) {
      //aqui deberia hacer type guard.

      logger.error(
        {
          correlationId,
          eventId: id,
          error: error.message,
          stack: error.stack,
          operation: "getById",
          service: "EventService",
        },
        "Error retrieving event"
      );
      throw error;
    }
  }
}

export default EventService;

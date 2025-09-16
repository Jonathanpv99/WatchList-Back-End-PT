import { PrismaClient, Severity } from "../../generated/prisma";
import logger from "../../utils/logger";

export default class EventRepository {
  static prisma = new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "error" },
      { emit: "event", level: "info" },
      { emit: "event", level: "warn" },
    ],
  });

  static async create(data: {
    message: string;
    summary?: string;
    severity?: Severity;
    suggestion?: string;
    watchlistId: string;
  }) {
    return await this.prisma.$transaction(async (prisma) => {
      try {
        logger.info(
          {
            operation: "create",
            repository: "EventRepository",
            watchlistId: data.watchlistId,
          },
          "Creating event in database"
        );

        const event = await prisma.event.create({
          data: {
            message: data.message,
            summary: data.summary,
            severity: data.severity,
            suggestion: data.suggestion,
            watchlistId: data.watchlistId,
          },
        });

        logger.info(
          { eventId: event.id, watchlistId: data.watchlistId },
          "Event created in database"
        );

        return event;
      } catch (error: any) {
        //aqui deberia hacer type guard.
        logger.error(
          {
            error: error.message,
            stack: error.stack,
            operation: "create",
            repository: "EventRepository",
            watchlistId: data.watchlistId,
          },
          "Database error creating event"
        );
        throw error;
      }
    });
  }

  static async getAll() {
    try {
      logger.info(
        { operation: "getAll", repository: "EventRepository" },
        "Getting all events from database"
      );

      const events = await this.prisma.event.findMany({});

      logger.info({ count: events.length }, "Events retrieved from database");

      return events;
    } catch (error: any) {
      //aqui deberia hacer type guard.
      logger.error(
        {
          error: error.message,
          stack: error.stack,
          operation: "getAll",
          repository: "EventRepository",
        },
        "Database error retrieving events"
      );
      throw error;
    }
  }

  static async getById(id: string) {
    try {
      logger.info(
        { operation: "getById", repository: "EventRepository", eventId: id },
        "Getting event from database"
      );

      const event = await this.prisma.event.findUnique({
        where: {
          id: id,
        },
      });

      if (!event) {
        logger.warn({ eventId: id }, "Event not found in database");
        throw new Error("Event not found");
      }

      logger.info({ eventId: id }, "Event retrieved from database");

      return event;
    } catch (error: any) {
      //aqui deberia hacer type guard.
      logger.error(
        {
          eventId: id,
          error: error.message,
          stack: error.stack,
          operation: "getById",
          repository: "EventRepository",
        },
        "Database error retrieving event"
      );
      throw error;
    }
  }

  static async createMany(
    dataArray: Array<{
      message: string;
      summary?: string;
      severity?: Severity;
      suggestion?: string;
      watchlistId: string;
    }>,
    correlationId?: string
  ) {
    return await this.prisma.$transaction(async (prisma) => {
      try {
        logger.info(
          {
            correlationId,
            operation: "createMany",
            repository: "EventRepository",
            count: dataArray.length,
          },
          "Creating multiple events in database"
        );

        // Preparar los datos para createMany
        const data = dataArray.map((item) => ({
          message: item.message,
          summary: item.summary,
          severity: item.severity,
          suggestion: item.suggestion,
          watchlistId: item.watchlistId,
        }));

        // Usar createMany para inserción masiva
        const result = await prisma.event.createMany({
          data: data,
        });

        logger.info(
          { correlationId, count: result.count },
          "Multiple events created in database"
        );

        // Como createMany no devuelve los registros creados, tenemos que buscarlos
        const createdEvents = await prisma.event.findMany({
          where: {
            OR: dataArray.map((item) => ({
              message: item.message,
              watchlistId: item.watchlistId,
            })),
          },
          orderBy: {
            createdAt: "desc",
          },
          take: dataArray.length,
        });

        return createdEvents;
      } catch (error: any) {
        //aqui deberia hacer type guard.
        logger.error(
          {
            correlationId,
            error: error.message,
            stack: error.stack,
            operation: "createMany",
            repository: "EventRepository",
          },
          "Database error creating multiple events"
        );
        throw error;
      }
    });
  }
}

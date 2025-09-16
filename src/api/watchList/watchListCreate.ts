import WatchListService from "../../services/watchList/watchListService";
import EventService from "../../services/events/eventService";
import ApiResponseHandler from "../apiResponseHandler";
import logger from "../../utils/logger";

export default async (req, res) => {
  const correlationId = req.correlationId;

  try {
    logger.info(
      { correlationId, path: req.path, method: req.method, body: req.body },
      "Creating watchlist"
    );

    const record = await WatchListService.create(req.body, { req });

    logger.info(
      { correlationId, watchlistId: record.id },
      "Watchlist created successfully"
    );

    //crear los eventos analizados por ia
    const payload = EventService.createMany(
      {
        terms: record.terms,
        events: record.events,
        watchlistId: record.id,
      },
      { req }
    );

    await ApiResponseHandler.success(req, res, { watchlist: payload });
  } catch (error) {
    logger.error(
      {
        correlationId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      "Error creating watchlist"
    );
    await ApiResponseHandler.error(req, res, error);
  }
};

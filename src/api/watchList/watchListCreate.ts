import WatchListService from "../../services/watchList/watchListService";
import ApiResponseHandler from "../apiResponseHandler";
import logger from "../../utils/logger";

export default async (req, res) => {
  const correlationId = req.correlationId;

  try {
    logger.info(
      { correlationId, path: req.path, method: req.method, body: req.body },
      "Creating watchlist"
    );

    // Usar el método estático para crear el watchlist
    const record = await WatchListService.create(req.body, { req });

    logger.info(
      { correlationId, watchlistId: record.id },
      "Watchlist created successfully"
    );

    await ApiResponseHandler.success(req, res, { watchlist: record });
  } catch (error) {
    logger.error(
      { correlationId, error: error.message, stack: error.stack },
      "Error creating watchlist"
    );
    await ApiResponseHandler.error(req, res, error);
  }
};

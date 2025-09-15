import WatchListService from "../../services/watchList/watchListService";
import ApiResponseHandler from "../apiResponseHandler";
import logger from "../../utils/logger";

export default async (req, res) => {
  const correlationId = req.correlationId;
  const { id } = req.params;
  
  try {
    logger.info({ correlationId, path: req.path, method: req.method, watchlistId: id }, "Getting watchlist by ID");
    
    if (!id) {
      logger.warn({ correlationId }, "Watchlist ID not provided");
      return ApiResponseHandler.error(req, res, new Error('ID is required'));
    }

    const watchlist = await WatchListService.getById(id);
    
    logger.info({ correlationId, watchlistId: id }, "Watchlist retrieved successfully");
    
    await ApiResponseHandler.success(req, res, { watchlist });
  } catch (error) {
    logger.error({ correlationId, watchlistId: id, error: error.message, stack: error.stack }, "Error retrieving watchlist");
    await ApiResponseHandler.error(req, res, error);
  }
};
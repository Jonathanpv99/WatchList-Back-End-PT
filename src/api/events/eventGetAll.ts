import EventService from "../../services/events/eventService";
import ApiResponseHandler from "../apiResponseHandler";
import logger from "../../utils/logger";

export default async (req, res) => {
  const correlationId = req.correlationId;

  try {
    logger.info(
      { correlationId, path: req.path, method: req.method },
      "Getting all events"
    );

    const events = await EventService.getAll({ req });

    logger.info(
      { correlationId, count: events.length },
      "Events retrieved successfully"
    );

    await ApiResponseHandler.success(req, res, { events });
  } catch (error) {
    logger.error(
      { correlationId, error: error.message, stack: error.stack },
      "Error retrieving events"
    );
    await ApiResponseHandler.error(req, res, error);
  }
};

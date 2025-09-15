import EventService from "../../services/events/eventService";
import ApiResponseHandler from "../apiResponseHandler";
import logger from "../../utils/logger";

export default async (req, res) => {
  const correlationId = req.correlationId;
  const { id } = req.params;

  try {
    logger.info(
      { correlationId, path: req.path, method: req.method, eventId: id },
      "Getting event by ID"
    );

    if (!id) {
      logger.warn({ correlationId }, "Event ID not provided");
      return ApiResponseHandler.error(req, res, new Error("ID is required"));
    }

    const event = await EventService.getById(id, { req });

    logger.info({ correlationId, eventId: id }, "Event retrieved successfully");

    await ApiResponseHandler.success(req, res, { event });
  } catch (error) {
    logger.error(
      { correlationId, eventId: id, error: error.message, stack: error.stack },
      "Error retrieving event"
    );
    await ApiResponseHandler.error(req, res, error);
  }
};

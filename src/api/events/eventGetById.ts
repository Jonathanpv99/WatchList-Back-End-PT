import EventService from "../../services/events/eventService";
import ApiResponseHandler from "../apiResponseHandler";

export default async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return ApiResponseHandler.error(req, res, new Error("ID is required"));
    }

    const event = await EventService.getById(id);
    await ApiResponseHandler.success(req, res, { event });
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};

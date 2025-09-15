import EventService from "../../services/events/eventService";
import ApiResponseHandler from "../apiResponseHandler";

export default async (req, res) => {
  try {
    const events = await EventService.getAll();
    await ApiResponseHandler.success(req, res, { events });
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
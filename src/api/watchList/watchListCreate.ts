import WatchListService from "../../services/watchList/watchListService";
import ApiResponseHandler from "../apiResponseHandler";

export default async (req, res) => {
  try {
    // Usar el método estático para crear el watchlist
    const record = await WatchListService.create(req.body);

    console.log("watchlist created :>> ", record);

    await ApiResponseHandler.success(req, res, { watchlist: record });
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};

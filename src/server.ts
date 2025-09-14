import { getConfig } from "./config";
import api from "./api";
import logger from "./utils/logger";

const PORT = getConfig().PORT || 8080;

api.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});

export default class ApiResponseHandler {
  static async download(req, res, path) {
    res.download(path);
  }

  static async downloadBuffer(req, res, buffer) {
    res.send(buffer);
  }

  static async success(req, res, payload) {
    if (payload !== undefined) {
      res.status(200).send(payload);
    } else {
      res.sendStatus(200);
    }
  }

  static async error(req, res, error) {
    console.error("AppError:", error);

    const status = [400, 401, 403, 404, 429, 207].includes(error.statusCode)
      ? error.statusCode
      : 500;

    res.status(status).json({
      message: error.message || "Error inesperado",
      code: error.code || "UNEXPECTED_ERROR",
    });
  }
}

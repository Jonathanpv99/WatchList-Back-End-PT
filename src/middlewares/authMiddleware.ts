import logger from "../utils/logger";

// Lista de IPs bloqueadas
const blockedIPs = ["::ffff:185.224.128.67"];
//rutas publicas
const publicPaths = ["/api/auth/sign-in"];

export async function authMiddleware(req, res, next) {
  logger.info(`Acción: ${req.method} ${req.url}`);
  logger.info(`IP del Cliente: ${req.ip}`);
  logger.info(`User-Agent: ${req.get("User-Agent")}`);

  // Bloquear rutas sospechosas
  if (req.url.startsWith("/GponForm/") || req.url.startsWith("/goform/")) {
    logger.error("Petición bloqueada: /GponForm/ o /goform/");
    return res.status(400).send("Bad Request");
  }

  // Bloquear IPs sospechosas
  if (blockedIPs.includes(req.ip)) {
    logger.error(`Bloqueando solicitud desde IP: ${req.ip}`);
    return res.status(403).send("Forbidden");
  }

  //saltar token si es ruta publica
  if (publicPaths.includes(req.path)) {
    return next();
  }

  //logica para validar token en rutas privadas
}

import rateLimit from "express-rate-limit";

// Middleware de rate limiting preconfigurado
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 solicitudes por IP
  message: {
    message: "Demasiadas solicitudes desde esta IP. Intenta más tarde.",
  },
  standardHeaders: true, // incluye headers RateLimit en respuesta
  legacyHeaders: false, // desactiva headers X-RateLimit obsoletos
  skip: (req) => {
    if (req.method === "OPTIONS") return true;
    if (req.originalUrl.endsWith("/import")) return true;
    return false;
  },
});

export default apiRateLimiter;

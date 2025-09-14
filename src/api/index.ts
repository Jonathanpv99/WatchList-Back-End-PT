import express from "express";
import cors from "cors";
import helmet from "helmet";
import apiRateLimiter from "./apiRateLimiter";

const app = express();

const allowedOrigins = ["*"];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Si el origen está en la lista de permitidos, permite la solicitud
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*"); // Si no hay origin, Asuminos que es localhost
    return next();
  }

  // Si el origen no está permitido, rechaza la solicitud
  return res.status(403).send("Access Denied");
});

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    exposedHeaders: ["Authorization", "X-Total-Count"],
    credentials: true,
  })
);

app.use(express.json());

// Default rate limiter
app.use(apiRateLimiter);

app.use(helmet());

// Configure the Entity routes
const routes = express.Router();

// Add the routes to the /api endpoint
app.use("/api", routes);

export default app;

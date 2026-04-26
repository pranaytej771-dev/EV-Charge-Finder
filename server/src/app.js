import cors from "cors";
import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_request, response) => {
  response.json({
    message: "ElectroMap API is running."
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/stations", stationRoutes);

app.use((error, _request, response, _next) => {
  console.error(error);

  response.status(500).json({
    message: error.message || "Something went wrong on the server."
  });
});

export default app;

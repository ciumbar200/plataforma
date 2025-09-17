import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./env";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import propertiesRoutes from "./routes/properties.routes";
import matchesRoutes from "./routes/matches.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_req, res) => res.json({ message: "Moon Pro API v2.0.0", status: "running" }));
app.get("/api/health", (_req, res) => res.json({ ok: true }));
export default app;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config({
    path: "./.env.local",
});
const app = express();
const allowed_origins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173").split(",");
app.use(cors({
    origin: (origin, cb) => {
        if (!origin) {
            return cb(null, true);
        }
        if (allowed_origins.indexOf(origin) !== -1) {
            return cb(null, true);
        }
        else {
            cb(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin"],
    credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
import userRouter from "./routes/user.routes.js";
import userAssessmentRouter from "./routes/userAssessment.routes.js";
import foodRouter from "./routes/food.routes.js";
import exerciseRouter from "./routes/exercise.routes.js";
import supplementRouter from "./routes/supplement.routes.js";
import customizedPlanRouter from "./routes/customizedPlan.routes.js";
app.use("/api/food", foodRouter);
app.use("/api/exercise", exerciseRouter);
app.use("/api/supplement", supplementRouter);
app.use("/api/user", userRouter);
app.use("/api/userAssessment", userAssessmentRouter);
app.use("/api/customizedPlan", customizedPlanRouter);
import { ErrorResponse } from "./utils/ErrorResponse.utils.js";
app.use(ErrorResponse);
export default app;
//# sourceMappingURL=app.js.map
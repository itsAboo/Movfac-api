import express from "express";
import connect from "./util/connectDB";
import dotenv from "dotenv";
import morgan from "morgan";
import cookirParser from "cookie-parser";
import userRoute from "./routes/userRoute";
import mediaRoute from "./routes/mediaRoute";
import cors from "cors";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const app = express();

app.use(morgan("dev"));
app.use(cookirParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "https://movfac.netlify.app",
  })
);

app.use("/api", userRoute);
app.use("/api", mediaRoute);

connect(() => {
  app.listen(3000, () => {
    console.log("start server on port 3000");
  });
});

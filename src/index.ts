import path from "path";

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import dbConnect from "./config/dbConnect";
import globalError from "./middlewares/globalError";
import ApiError from "./utils/ApiError";

import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

dbConnect();

app.use(cors());
app.options("*", cors());

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("*", (req, res, next) => {
  next(new ApiError("Can't find this route ", 404));
});

app.use(globalError);

const port = parseInt(process.env.PORT || "3000");
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

process.on("uncaughtException", () => {
  console.log("uncaughtException");
  server.close(() => {
    console.log(`APP SHUTTING DOWN... *.* `);
    process.exit(1);
  });
});

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import router from "./routes/routes.js";
import { initDB } from "./data/database.js";
import { limiter } from "./middleware/rate_limit.middleware.js";

const app = express();

const BASE_URL = "http://localhost";
const PORT = 3000;

initDB();

app.set("view engine", "hbs");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(limiter);
app.use(router);

app.listen(PORT, () => {
  console.log(`JITTER ejecutándose en ${BASE_URL}:${PORT}`);
});

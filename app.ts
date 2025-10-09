require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { rateLimit } from "express-rate-limit";
import connectDB from "./utils/db";
import saveData from "./utils/watcher";
import { getAllProducts } from "./controllers/products.controller";
export const app = express();
// cookie parser
app.use(cookieParser());

// serve static files
app.use('/dashboard', express.static('public'));


/*****cors error protection and data parsing*****/

app.use(
  cors({
    origin: ["http://localhost:3000","http://localhost:3000", "https://dev-style.com","https://devstyle-client.vercel.app","https://devstyle-client.vercel.app/"],
    credentials: true,
    exposedHeaders: ["set-cookie"], // Si vous utilisez des cookies, exposez-les pour le navigateur
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Ajoutez les méthodes nécessaires pour votre application
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// api requests limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false
});


// middleware calls
app.use(limiter);

// testing api
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Welcome to the otherside🙂"
  });
});

app.get("/read", async (req: Request, res: Response, next: NextFunction) => {
  return getAllProducts(req, res, next);
});

app.get("/watch", async (req: Request, res: Response, next: NextFunction) => {

    await saveData();
   
  res.status(200).json({
    message: "Sols data watcher started successfully🙂"
  });
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

export default () => connectDB().then(() => app);

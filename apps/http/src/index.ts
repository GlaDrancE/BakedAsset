/// <reference path="./types.d.ts" />
import express from "express";
import cors from 'cors';
import { config } from "dotenv";
import authRoutes from "./routes/auth.routes.ts";
import businessRoutes from "./routes/business.routes.ts";


const app = express();
const port = process.env.PORT || 4000;

config({ path: ".env" });
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}))

app.use("/auth", authRoutes)
app.use("/api", businessRoutes)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
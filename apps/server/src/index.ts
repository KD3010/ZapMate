require("dotenv").config();
import express, { Express } from "express";
import router from "./routes";
import cors from "cors";

const app: Express = express();
app.use(express.json());
app.use(cors());

// Handling all the routes
app.use("/api", router);

app.listen(5000, () => {
    console.log("Server running on port 5000!")
})

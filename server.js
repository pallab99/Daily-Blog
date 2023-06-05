import express from "express";
import "dotenv/config";
import { connectMongoDbDatabase } from "./configs/database/dbConnection.js";

const app = express();

const port = process.env.PORT || 3000;

connectMongoDbDatabase();

app.get("/", (req, res) => {
  res.send("Hello,I am the base endPoint");
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});

// index.js
import express from "express";
import identifyRoute from "./routes/identify.js";

const app = express();
const PORT = 3000;

import cors from "cors";
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("This is the Bitespeed Identity Reconciliation API");
});

app.use("/identify", identifyRoute);

app.post("/api/data", (req, res) => {
  console.log(req.body);
  res.json({ message: "Data received", data: req.body });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

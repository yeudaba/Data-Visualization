require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const { getLeadsByCity } = require("./src/controllers/statsController");
const { getHomeSummary } = require("./src/controllers/homeController");
const { getReport1Comparison } = require("./src/controllers/report1Controller");
const { getReport2Comparison } = require("./src/controllers/report2Controller");
const {
  getReport4Monthly,
  getReport4Outcomes,
} = require("./src/controllers/report4Controller");
const { getReport5Media } = require("./src/controllers/report5Controller");

const app = express();

const PORT = process.env.PORT || 10000;
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  return res.json({
    ok: true,
    message: "Server is running",
  });
});

app.get("/api/home/summary", getHomeSummary);

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.get("/api/stats", (req, res) => {
  return res.json({
    ok: true,
    message: "Stats routes working",
  });
});

app.get("/api/stats/cities", getLeadsByCity);

app.get("/api/report1/comparison", getReport1Comparison);
app.get("/api/report2/comparison", getReport2Comparison);

app.get("/api/report4/monthly", getReport4Monthly);
app.get("/api/report4/outcomes", getReport4Outcomes);

app.get("/api/report5/media", getReport5Media);

app.use((req, res) => {
  return res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend origin: ${FRONTEND_ORIGIN}`);
  console.log("GET /health");
  console.log("GET /api/home/summary");
  console.log("POST /api/auth/login");
  console.log("POST /auth/login");
  console.log("GET /api/stats");
  console.log("GET /api/stats/cities");
  console.log("GET /api/report1/comparison");
  console.log("GET /api/report2/comparison");
  console.log("GET /api/report4/monthly");
  console.log("GET /api/report4/outcomes");
  console.log("GET /api/report5/media");
});
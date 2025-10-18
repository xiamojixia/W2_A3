const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const eventsRoutes = require("./src/routes/events");
const categoriesRoutes = require("./src/routes/categories");
const searchRoutes = require("./src/routes/search");

app.use("/api/events", eventsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/search", searchRoutes);

app.use("/api/admin/events", require("./src/routes/admin/events"));
app.use("/api/admin/categories", require("./src/routes/admin/categories"));
app.use("/api/admin/organisations", require("./src/routes/admin/organisations"));
app.use("/api/admin/registrations", require("./src/routes/admin/registrations"));

app.get("/", (req, res) => {
  res.send("API is running. Try /api/src/events");
});

app.listen(PORT, () => {
  console.log(`API Server is running at http://localhost:${PORT}`);
});

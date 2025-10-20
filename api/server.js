const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3308;

app.use(express.json());

// 导入路由
const eventsRoutes = require("./src/routes/events");
const categoriesRoutes = require("./src/routes/categories");
const searchRoutes = require("./src/routes/search");
const registrationsRoutes = require("./src/routes/registrations");  // 关键修复

// 使用路由
app.use("/api/events", eventsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/registrations", registrationsRoutes);  // 关键修复：使用 registrationsRoutes

// 管理员路由
app.use("/api/admin/events", require("./src/routes/admin/events"));
app.use("/api/admin/categories", require("./src/routes/admin/categories"));
app.use("/api/admin/organisations", require("./src/routes/admin/organisations"));
app.use("/api/admin/registrations", require("./src/routes/admin/registrations"));

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API服务器运行正常',
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  res.send("API is running. Try /api/events");
});

app.listen(PORT, () => {
  console.log(`🚀 API Server is running at http://localhost:${PORT}`);
  console.log(`✅ 使用代理，无需 CORS`);
});
const db = require("../event_db");

const getAllCategories = async (req, res) => {
    const [rows] = await db.query("SELECT * FROM categories ORDER BY id ASC");
    res.json(rows);
};

module.exports = { getAllCategories };

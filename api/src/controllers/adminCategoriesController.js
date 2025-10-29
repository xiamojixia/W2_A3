const db = require('../event_db');


const adminGetCategories = async (req, res) => {
    const [rows] = await db.query(`SELECT * FROM categories ORDER BY id ASC`);
    res.json(rows);
};


const adminCreateCategory = async (req, res) => {
    const { name, description } = req.body;
    const [result] = await db.query(`INSERT INTO categories (name, description) VALUES (?, ?)`, [name, description]);
    const [rows] = await db.query(`SELECT * FROM categories WHERE id = ?`, [result.insertId]);
    res.status(201).json(rows[0]);
};


const adminUpdateCategory = async (req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;
    await db.query(`UPDATE categories SET name = ?, description = ? WHERE id = ?`, [name, description, id]);
    const [rows] = await db.query(`SELECT * FROM categories WHERE id = ?`, [id]);
    res.json(rows[0]);
};


const adminDeleteCategory = async (req, res) => {
    const id = req.params.id;
    const [ev] = await db.query(`SELECT COUNT(*) as cnt FROM events WHERE category_id = ?`, [id]);
    if (ev[0].cnt > 0) {
      return res.status(409).json({ error: 'Cannot delete category with linked events' });
    }
    await db.query(`DELETE FROM categories WHERE id = ?`, [id]);
    res.json({ success: true });
};


module.exports = {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory
};

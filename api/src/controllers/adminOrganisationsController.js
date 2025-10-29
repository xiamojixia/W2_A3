const db = require('../event_db');


const adminGetOrgs = async (req, res) => {
    const [rows] = await db.query(`SELECT * FROM organisations ORDER BY id ASC`);
    res.json(rows);
};


const adminCreateOrg = async (req, res) => {
    const { name, description, contact_email, contact_phone, address, logo_url } = req.body;
    const [result] = await db.query(
      `INSERT INTO organisations (name, description, contact_email, contact_phone, address, logo_url) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, contact_email, contact_phone, address, logo_url]
    );
    const [rows] = await db.query(`SELECT * FROM organisations WHERE id = ?`, [result.insertId]);
    res.status(201).json(rows[0]);
};


const adminUpdateOrg = async (req, res) => {
    const id = req.params.id;
    const { name, description, contact_email, contact_phone, address, logo_url } = req.body;
    await db.query(
      `UPDATE organisations SET name=?, description=?, contact_email=?, contact_phone=?, address=?, logo_url=? WHERE id=?`,
      [name, description, contact_email, contact_phone, address, logo_url, id]
    );
    const [rows] = await db.query(`SELECT * FROM organisations WHERE id = ?`, [id]);
    res.json(rows[0]);
};


const adminDeleteOrg = async (req, res) => {
    const id = req.params.id;
    const [ev] = await db.query(`SELECT COUNT(*) as cnt FROM events WHERE org_id = ?`, [id]);
    if (ev[0].cnt > 0) {
      return res.status(409).json({ error: 'Cannot delete organisation with linked events' });
    }
    await db.query(`DELETE FROM organisations WHERE id = ?`, [id]);
    res.json({ success: true });
};


module.exports = {
  adminGetOrgs,
  adminCreateOrg,
  adminUpdateOrg,
  adminDeleteOrg
};

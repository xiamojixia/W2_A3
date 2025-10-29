const db = require('../event_db');


const adminGetEvents = async (req, res) => {
    const [rows] = await db.query(`
      SELECT e.*, c.name AS category_name, o.name AS org_name
      FROM events e
      JOIN categories c ON e.category_id = c.id
      JOIN organisations o ON e.org_id = o.id
      ORDER BY e.start_datetime DESC
    `);
    res.json(rows);
};


const adminCreateEvent = async (req, res) => {
    const {
      org_id, category_id, name, short_description, full_description,
      location, start_datetime, end_datetime, price = 0.00,
      goal_amount = 0.00, image_url = null, status = 'active'
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO events
       (org_id, category_id, name, short_description, full_description, location, start_datetime, end_datetime, price, goal_amount, current_amount, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0.00, ?, ?)`,
      [org_id, category_id, name, short_description, full_description, location, start_datetime, end_datetime, price, goal_amount, image_url, status]
    );
    const insertedId = result.insertId;
    const [rows] = await db.query(`SELECT * FROM events WHERE id = ?`, [insertedId]);
    res.status(201).json(rows[0]);
};


const adminUpdateEvent = async (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    const allowed = ['org_id','category_id','name','short_description','full_description','location','start_datetime','end_datetime','price','goal_amount','current_amount','image_url','status'];
    const setPairs = [];
    const params = [];
    for (const k of allowed) {
      if (updates[k] !== undefined) {
        setPairs.push(`${k} = ?`);
        params.push(updates[k]);
      }
    }
    if (setPairs.length === 0) return res.status(400).json({ error: 'No fields to update' });
    params.push(id);
    const sql = `UPDATE events SET ${setPairs.join(', ')} WHERE id = ?`;
    await db.query(sql, params);
    const [rows] = await db.query(`SELECT * FROM events WHERE id = ?`, [id]);
    res.json(rows[0]);
};


const adminDeleteEvent = async (req, res) => {
    const id = req.params.id;
    const [regs] = await db.query(`SELECT COUNT(*) as cnt FROM registrations WHERE event_id = ?`, [id]);
    if (regs[0].cnt > 0) {
      return res.status(409).json({ error: 'Cannot delete event with existing registrations' });
    }
    await db.query(`DELETE FROM events WHERE id = ?`, [id]);
    res.json({ success: true });
};


module.exports = {
  adminGetEvents,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent
};

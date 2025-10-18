const db = require('../event_db');


const adminGetRegistrations = async (req, res) => {
    const { event_id } = req.query;
    let sql = `SELECT r.*, e.name AS event_name FROM registrations r JOIN events e ON r.event_id = e.id`;
    const params = [];
    if (event_id) {
      sql += ` WHERE r.event_id = ?`;
      params.push(event_id);
    }
    sql += ` ORDER BY r.registered_at DESC`;
    const [rows] = await db.query(sql, params);
    res.json(rows);
};


const adminCreateRegistration = async (req, res) => {
    const { event_id, registrant_name, registrant_email, registrant_phone, tickets = 1, comments = null } = req.body;

    const [ev] = await db.query(`SELECT id FROM events WHERE id = ?`, [event_id]);
    if (ev.length === 0) return res.status(400).json({ error: 'Event not found' });

    const [result] = await db.query(
      `INSERT INTO registrations (event_id, registrant_name, registrant_email, registrant_phone, tickets, comments)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [event_id, registrant_name, registrant_email, registrant_phone, tickets, comments]
    );

    const [eRows] = await db.query(`SELECT price, current_amount FROM events WHERE id = ?`, [event_id]);
    if (eRows.length) {
      const price = parseFloat(eRows[0].price || 0);
      const added = price * (tickets || 0);
      await db.query(`UPDATE events SET current_amount = current_amount + ? WHERE id = ?`, [added, event_id]);
    }

    const [rows] = await db.query(`SELECT * FROM registrations WHERE id = ?`, [result.insertId]);
    res.status(201).json(rows[0]);
};


const adminUpdateRegistration = async (req, res) => {
    const id = req.params.id;
    const { registrant_name, registrant_email, registrant_phone, tickets, comments } = req.body;
    const setParts = [];
    const params = [];
    if (registrant_name !== undefined) { setParts.push('registrant_name = ?'); params.push(registrant_name); }
    if (registrant_email !== undefined) { setParts.push('registrant_email = ?'); params.push(registrant_email); }
    if (registrant_phone !== undefined) { setParts.push('registrant_phone = ?'); params.push(registrant_phone); }
    if (tickets !== undefined) { setParts.push('tickets = ?'); params.push(tickets); }
    if (comments !== undefined) { setParts.push('comments = ?'); params.push(comments); }
    if (setParts.length === 0) return res.status(400).json({ error: 'No fields to update' });
    params.push(id);
    await db.query(`UPDATE registrations SET ${setParts.join(', ')} WHERE id = ?`, params);
    const [rows] = await db.query(`SELECT * FROM registrations WHERE id = ?`, [id]);
    res.json(rows[0]);
};


const adminDeleteRegistration = async (req, res) => {
    const id = req.params.id;
    await db.query(`DELETE FROM registrations WHERE id = ?`, [id]);
    res.json({ success: true });
};


module.exports = {
  adminGetRegistrations,
  adminCreateRegistration,
  adminUpdateRegistration,
  adminDeleteRegistration
};

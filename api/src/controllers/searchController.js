const db = require("../event_db");

const searchEvents = async (req, res) => {
    const { date, location, category_id } = req.query;

    let sql = `
		SELECT e.*, c.name AS category_name, o.name AS org_name
		FROM events e
		JOIN categories c ON e.category_id = c.id
		JOIN organisations o ON e.org_id = o.id
		WHERE e.status = 'active'
    `;
    let params = [];

    if (date) {
		sql += " AND DATE(e.start_datetime) = ?";
		params.push(date);
    }
    if (location) {
		sql += " AND e.location LIKE ?";
		params.push(`%${location}%`);
    }
    if (category_id) {
		sql += " AND e.category_id = ?";
		params.push(category_id);
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
};

module.exports = { searchEvents };

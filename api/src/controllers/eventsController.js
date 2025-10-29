const db = require("../event_db");

const getAllEvents = async (req, res) => {
    console.log("Incoming query params:", req.query);
    const { date, location, category, org } = req.query;

    let sql = `
        SELECT e.*, c.name AS category_name, o.name AS org_name,
               (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) AS registration_count
        FROM events e
        JOIN categories c ON e.category_id = c.id
        JOIN organisations o ON e.org_id = o.id
        WHERE e.status = 'active'
    `;
    const params = [];

    if (date) {
        sql += " AND e.start_datetime >= ? AND e.start_datetime < DATE_ADD(?, INTERVAL 1 DAY)";
        params.push(date, date);
    }

    if (location) {
        sql += " AND e.location LIKE ?";
        params.push(`%${location}%`);
    }

    if (category) {
        sql += " AND c.name LIKE ?";
        params.push(`%${category}%`);
    }

    if (org) {
        sql += " AND o.name LIKE ?";
        params.push(`%${org}%`);
    }

    sql += " ORDER BY e.start_datetime ASC";

    const [rows] = await db.query(sql, params);

    if (rows.length === 0) {
        return res.status(404).json({ message: "No matching events found" });
    }

    res.json(rows);
};

const getEventById = async (req, res) => {
    const eventId = req.params.id;

    const [events] = await db.query(
        `
        SELECT e.*, c.name AS category_name, o.name AS org_name
        FROM events e
        JOIN categories c ON e.category_id = c.id
        JOIN organisations o ON e.org_id = o.id
        WHERE e.id = ?
        `,
        [eventId]
    );

    if (events.length === 0) return res.status(404).json({ error: "Event not found" });

    const event = events[0];

    const [registrations] = await db.query(
        `
        SELECT registrant_name
        FROM registrations
        WHERE event_id = ?
        ORDER BY registered_at DESC
        `,
        [eventId]
    );

    event.registrations = registrations.map(r => r.registrant_name);

    res.json(event);
};

module.exports = { getAllEvents, getEventById };

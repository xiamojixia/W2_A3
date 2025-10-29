const db = require('../event_db');

const GetRegistrations = async (req, res) => {
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

// 检查注册信息是否已存在
const CheckRegistrationInfo = async (req, res) => {
  console.log("🔍 收到检查信息请求");
  console.log("请求数据:", req.body);
  
  try {
    const { registrant_name, registrant_email, registrant_phone } = req.body;

    console.log("1. 开始检查姓名是否存在...");
    // 检查姓名是否已存在
    const [nameRows] = await db.query(
      'SELECT id FROM registrations WHERE registrant_name = ?',
      [registrant_name]
    );
    console.log("姓名检查结果:", nameRows);

    console.log("2. 开始检查邮箱是否存在...");
    // 检查邮箱是否已存在
    const [emailRows] = await db.query(
      'SELECT id FROM registrations WHERE registrant_email = ?',
      [registrant_email]
    );
    console.log("邮箱检查结果:", emailRows);

    console.log("3. 开始检查电话是否存在...");
    // 检查电话是否已存在
    const [phoneRows] = await db.query(
      'SELECT id FROM registrations WHERE registrant_phone = ?',
      [registrant_phone]
    );
    console.log("电话检查结果:", phoneRows);

    console.log("4. 准备返回响应...");
    res.json({
      success: true,
      data: {
        nameExists: nameRows.length > 0,
        emailExists: emailRows.length > 0,
        phoneExists: phoneRows.length > 0
      }
    });
    console.log("5. 响应已发送");

  } catch (error) {
    console.error('❌ 检查信息时发生错误:');
    console.error('错误信息:', error.message);
    console.error('错误堆栈:', error.stack);
    
    res.status(500).json({
      success: false,
      message: '检查信息失败: ' + error.message,
      error: error.stack
    });
  }
};


// 新的注册函数 - 专为前端注册页面设计
const CreateRegistrationWithVerification = async (req, res) => {
    try {
        const { registrant_name, registrant_email, registrant_phone, verificationCode, confirmCode } = req.body;

        // 验证验证码
        if (verificationCode !== confirmCode) {
            return res.status(400).json({
                success: false,
                message: '验证码错误'
            });
        }

        // 再次检查信息是否已存在（防止并发注册）
        const [existingName] = await db.query(
            'SELECT id FROM registrations WHERE registrant_name = ?',
            [registrant_name]
        );
        const [existingEmail] = await db.query(
            'SELECT id FROM registrations WHERE registrant_email = ?',
            [registrant_email]
        );
        const [existingPhone] = await db.query(
            'SELECT id FROM registrations WHERE registrant_phone = ?',
            [registrant_phone]
        );

        if (existingName.length > 0) {
            return res.status(400).json({
                success: false,
                message: '用户名已被注册'
            });
        }

        if (existingEmail.length > 0) {
            return res.status(400).json({
                success: false,
                message: '邮箱已被注册'
            });
        }

        if (existingPhone.length > 0) {
            return res.status(400).json({
                success: false,
                message: '电话已被注册'
            });
        }

        // 检查事件ID 300是否存在
        // 插入新注册记录，event_id 固定为 300
        const [result] = await db.query(
            `INSERT INTO registrations (event_id, registrant_name, registrant_email, registrant_phone, tickets, comments)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [300, registrant_name, registrant_email, registrant_phone, 1, '通过注册页面注册']
        );

        // 获取新创建的注册记录
        const [newRegistration] = await db.query(
            'SELECT * FROM registrations WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: '注册成功',
            data: newRegistration[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: '注册失败',
            error: error.message
        });
    }
};

// 原有的创建注册函数保持不变（用于其他场景）
const CreateRegistration = async (req, res) => {
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

const UpdateRegistration = async (req, res) => {
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

const DeleteRegistration = async (req, res) => {
    const id = req.params.id;
    await db.query(`DELETE FROM registrations WHERE id = ?`, [id]);
    res.json({ success: true });
};

module.exports = {
  GetRegistrations,
  CreateRegistration,
  UpdateRegistration,
  DeleteRegistration,
  CheckRegistrationInfo,           // 新增：检查注册信息
  CreateRegistrationWithVerification // 新增：带验证码的注册
};
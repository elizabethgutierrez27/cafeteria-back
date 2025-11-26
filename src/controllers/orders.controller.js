import { pool } from '../../db.js';

export const createOrder = async (req, res) => {
  const { items, total_price } = req.body;

  if (!Array.isArray(items) || !items.length)
    return res.status(400).json({ message: 'Items requeridos' });

  const uid = req.user.id;

  const r = await pool.query(
    'INSERT INTO orders (user_id, items, total_price, status) VALUES ($1,$2,$3,$4) RETURNING id;',
    [uid, JSON.stringify(items), total_price, 'pendiente']
  );

  res.json({ id: r.rows[0].id });
};

export const getMyOrders = async (req, res) => {
  const uid = req.user.id;

  const rows = await pool.query(
    'SELECT * FROM orders WHERE user_id=$1 ORDER BY id DESC',
    [uid]
  );

  res.json(rows.rows);
};

export const getAllOrders = async (_req, res) => {
  const rows = await pool.query(
    `SELECT o.*, u.name AS customer_name, u.email
     FROM orders o 
     JOIN users u ON u.id=o.user_id
     ORDER BY o.id DESC`
  );

  res.json(rows.rows);
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  await pool.query(
    'UPDATE orders SET status=$1 WHERE id=$2',
    [status, id]
  );

  res.json({ message: 'Estado actualizado' });
};

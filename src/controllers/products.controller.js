import { pool } from '../../db.js'

export const listProducts = async (_req, res) => {
  const rows = await pool.query(
    'SELECT * FROM products WHERE active=true ORDER BY id DESC'
  );
  res.json(rows.rows);
};

export const createProduct = async (req, res) => {
  const { name, description, price, image_url, active } = req.body;

  const r = await pool.query(
    `INSERT INTO products (name, description, price, image_url, active)
     VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [name, description || null, price, image_url || null, active ?? true]
  );

  res.json({ id: r.rows[0].id });
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, active } = req.body;

  await pool.query(
    `UPDATE products 
     SET name=$1, description=$2, price=$3, image_url=$4, active=$5 
     WHERE id=$6`,
    [name, description || null, price, image_url || null, active ?? true, id]
  );

  res.json({ message: 'Actualizado' });
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  await pool.query('DELETE FROM products WHERE id=$1', [id]);

  res.json({ message: 'Eliminado' });
};

import { pool } from '../../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Datos incompletos' });

    // Buscar usuario por email
    const exists = await pool.query(
      'SELECT id FROM users WHERE email=$1',
      [email]
    );
    if (exists.rows.length)
      return res.status(409).json({ message: 'Email ya registrado' });

    const hash = await bcrypt.hash(password, 10);

    // INSERT con RETURNING
    const r = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id;',
      [name, email, hash]
    );

    res.json({ id: r.rows[0].id, name, email });
  } catch (e) {
    res.status(500).json({ message: 'Error al registrar', error: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const rows = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );

    if (!rows.rows.length)
      return res.status(401).json({ message: 'Credenciales inválidas' });

    const u = rows.rows[0];

    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: u.id, role: u.role, name: u.name },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.json({
      token,
      user: { id: u.id, name: u.name, email: u.email, role: u.role }
    });
  } catch (e) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: e.message });
  }
};

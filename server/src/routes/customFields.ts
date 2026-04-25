import { Router } from 'express';
import { getDb, queryAll, queryOne, run } from '../db';

const router = Router();

router.get('/', async (_req, res) => {
  const db = await getDb();
  const fields = queryAll(db, 'SELECT * FROM custom_fields ORDER BY created_at');
  res.json(fields);
});

router.post('/', async (req, res) => {
  const { label, name, field_type = 'text' } = req.body;
  if (!label || !name) {
    return res.status(400).json({ error: 'label and name are required' });
  }
  try {
    const db = await getDb();
    const existing = queryOne(db, 'SELECT id FROM custom_fields WHERE name = ?', [name]);
    if (existing) return res.status(409).json({ error: 'Field name already exists' });

    const id = run(db, 'INSERT INTO custom_fields (label, name, field_type) VALUES (?, ?, ?)', [label, name, field_type]);
    const field = queryOne(db, 'SELECT * FROM custom_fields WHERE id = ?', [id]);
    return res.status(201).json(field);
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const db = await getDb();
  run(db, 'DELETE FROM custom_fields WHERE id = ?', [Number(req.params.id)]);
  res.status(204).end();
});

export default router;

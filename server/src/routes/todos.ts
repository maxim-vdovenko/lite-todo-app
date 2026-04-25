import { Router } from 'express';
import { Database } from 'sql.js';
import { getDb, queryAll, queryOne, run } from '../db';

const router = Router();

function getCustomValues(db: Database, todoId: number) {
  return queryAll(
    db,
    `SELECT cf.id as field_id, cf.name, cf.label, cf.field_type,
            COALESCE(tcv.value, '') as value
     FROM custom_fields cf
     LEFT JOIN todo_custom_values tcv ON tcv.field_id = cf.id AND tcv.todo_id = ?
     ORDER BY cf.created_at`,
    [todoId]
  );
}

function todoWithCustom(db: Database, id: number) {
  const todo = queryOne<any>(db, 'SELECT * FROM todos WHERE id = ?', [id]);
  if (!todo) return null;
  return { ...todo, completed: Boolean(todo.completed), customValues: getCustomValues(db, id) };
}

router.get('/', async (_req, res) => {
  const db = await getDb();
  const todos = queryAll<any>(db, 'SELECT * FROM todos ORDER BY created_at DESC');
  const result = todos.map((t) => ({
    ...t,
    completed: Boolean(t.completed),
    customValues: getCustomValues(db, t.id as number),
  }));
  res.json(result);
});

router.post('/', async (req, res) => {
  const { full_name, email, phone, address, customValues = {} } = req.body;
  if (!full_name || !email || !phone || !address) {
    return res.status(400).json({ error: 'full_name, email, phone, address are required' });
  }

  const db = await getDb();
  const todoId = run(db, 'INSERT INTO todos (full_name, email, phone, address) VALUES (?, ?, ?, ?)', [
    full_name, email, phone, address,
  ]);

  for (const [fieldId, value] of Object.entries(customValues)) {
    run(db,
      'INSERT OR REPLACE INTO todo_custom_values (todo_id, field_id, value) VALUES (?, ?, ?)',
      [todoId, Number(fieldId), String(value)]
    );
  }

  return res.status(201).json(todoWithCustom(db, todoId));
});

router.put('/:id', async (req, res) => {
  const db = await getDb();
  const id = Number(req.params.id);
  const existing = queryOne(db, 'SELECT id FROM todos WHERE id = ?', [id]);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  const { full_name, email, phone, address, completed, customValues = {} } = req.body;

  if (full_name !== undefined || email !== undefined || phone !== undefined || address !== undefined || completed !== undefined) {
    const current = queryOne<any>(db, 'SELECT * FROM todos WHERE id = ?', [id])!;
    run(db,
      'UPDATE todos SET full_name=?, email=?, phone=?, address=?, completed=? WHERE id=?',
      [
        full_name ?? current.full_name,
        email ?? current.email,
        phone ?? current.phone,
        address ?? current.address,
        completed !== undefined ? (completed ? 1 : 0) : current.completed,
        id,
      ]
    );
  }

  for (const [fieldId, value] of Object.entries(customValues)) {
    run(db,
      'INSERT OR REPLACE INTO todo_custom_values (todo_id, field_id, value) VALUES (?, ?, ?)',
      [id, Number(fieldId), String(value)]
    );
  }

  return res.json(todoWithCustom(db, id));
});

router.delete('/:id', async (req, res) => {
  const db = await getDb();
  run(db, 'DELETE FROM todos WHERE id = ?', [Number(req.params.id)]);
  res.status(204).end();
});

export default router;

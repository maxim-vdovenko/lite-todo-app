import express from 'express';
import cors from 'cors';
import todosRouter from './routes/todos';
import customFieldsRouter from './routes/customFields';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/todos', todosRouter);
app.use('/api/custom-fields', customFieldsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

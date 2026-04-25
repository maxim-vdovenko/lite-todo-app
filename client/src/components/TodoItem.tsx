import React, { useState } from 'react';
import { Todo } from '../types';
import { deleteTodo, updateTodo } from '../api';

interface Props {
  todo: Todo;
  onChanged: () => void;
}

export default function TodoItem({ todo, onChanged }: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggleComplete = async () => {
    await updateTodo(todo.id, { completed: !todo.completed });
    onChanged();
  };

  const handleDelete = async () => {
    if (!confirm('Удалить запись?')) return;
    await deleteTodo(todo.id);
    onChanged();
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-item-header">
        <label className="checkbox-label">
          <input type="checkbox" checked={todo.completed} onChange={toggleComplete} />
          <span className="todo-name">{todo.full_name}</span>
        </label>
        <div className="todo-actions">
          <button className="btn btn-sm btn-secondary" onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Свернуть' : 'Подробнее'}
          </button>
          <button className="btn btn-sm btn-danger" onClick={handleDelete}>
            Удалить
          </button>
        </div>
      </div>

      {expanded && (
        <div className="todo-details">
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span>{todo.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Телефон:</span>
            <span>{todo.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Адрес:</span>
            <span>{todo.address}</span>
          </div>
          {todo.customValues.filter((cv) => cv.value).map((cv) => (
            <div className="detail-row" key={cv.field_id}>
              <span className="detail-label">{cv.label}:</span>
              <span>{cv.value}</span>
            </div>
          ))}
          <p className="todo-date">
            Добавлено: {new Date(todo.created_at).toLocaleString('ru-RU')}
          </p>
        </div>
      )}
    </div>
  );
}

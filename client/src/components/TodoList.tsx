import React, { useState } from 'react';
import { Todo } from '../types';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  onChanged: () => void;
}

export default function TodoList({ todos, onChanged }: Props) {
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const [search, setSearch] = useState('');

  const filtered = todos.filter((t) => {
    const matchesFilter =
      filter === 'all' || (filter === 'active' && !t.completed) || (filter === 'done' && t.completed);
    const matchesSearch =
      !search ||
      t.full_name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.includes(search) ||
      t.address.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="card">
      <div className="card-header">
        <h3>Записи ({todos.length})</h3>
      </div>
      <div className="card-body">
        <div className="list-controls">
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <div className="filter-tabs">
            {(['all', 'active', 'done'] as const).map((f) => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'Все' : f === 'active' ? 'Активные' : 'Выполненные'}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">Записей нет</p>
        ) : (
          <div className="todo-list">
            {filtered.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onChanged={onChanged} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

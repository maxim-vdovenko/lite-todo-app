import React, { useCallback, useEffect, useState } from 'react';
import { CustomField, Todo } from './types';
import { fetchCustomFields, fetchTodos } from './api';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import CustomFieldManager from './components/CustomFieldManager';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAll = useCallback(async () => {
    try {
      const [t, f] = await Promise.all([fetchTodos(), fetchCustomFields()]);
      setTodos(t);
      setCustomFields(f);
      setError('');
    } catch (e: any) {
      setError('Ошибка загрузки данных. Проверьте, что сервер запущен.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo List</h1>
        <p>Управление контактами и задачами</p>
      </header>

      <main className="app-main">
        {error && <div className="error-banner">{error}</div>}

        <div className="layout">
          <div className="sidebar">
            <CustomFieldManager fields={customFields} onFieldsChange={loadAll} />
            <TodoForm customFields={customFields} onCreated={loadAll} />
          </div>
          <div className="content">
            {loading ? (
              <div className="loading">Загрузка...</div>
            ) : (
              <TodoList todos={todos} onChanged={loadAll} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

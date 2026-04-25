import React, { useState } from 'react';
import { CustomField, TodoFormData } from '../types';
import { createTodo } from '../api';

interface Props {
  customFields: CustomField[];
  onCreated: () => void;
}

const empty = (): TodoFormData => ({
  full_name: '',
  email: '',
  phone: '',
  address: '',
  customValues: {},
});

export default function TodoForm({ customFields, onCreated }: Props) {
  const [form, setForm] = useState<TodoFormData>(empty());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof Omit<TodoFormData, 'customValues'>, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const setCustom = (fieldId: number, value: string) =>
    setForm((f) => ({ ...f, customValues: { ...f.customValues, [fieldId]: value } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createTodo(form);
      setForm(empty());
      onCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Новая запись</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="todo-form">
          <div className="form-group">
            <label>ФИО *</label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => set('full_name', e.target.value)}
              placeholder="Иванов Иван Иванович" 
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="example@gmail.com"
            />
          </div>
          <div className="form-group">
            <label>Телефон *</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="+8 (000) 000-00-00"
            />
          </div>
          <div className="form-group">
            <label>Адрес *</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="г. Киев, ул. Грушевского, д. 1"
            />
          </div>

          {customFields.map((f) => (
            <div className="form-group" key={f.id}>
              <label>{f.label}</label>
              <input
                type={f.field_type}
                value={form.customValues[f.id] ?? ''}
                onChange={(e) => setCustom(f.id, e.target.value)}
                placeholder={f.label}
              />
            </div>
          ))}

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Сохранение...' : 'Добавить'}
          </button>
        </form>
      </div>
    </div>
  );
}

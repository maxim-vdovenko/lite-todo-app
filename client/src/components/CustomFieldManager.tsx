import React, { useState } from 'react';
import { CustomField } from '../types';
import { createCustomField, deleteCustomField } from '../api';

interface Props {
  fields: CustomField[];
  onFieldsChange: () => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Текст' },
  { value: 'number', label: 'Число' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Телефон' },
  { value: 'date', label: 'Дата' },
];

export default function CustomFieldManager({ fields, onFieldsChange }: Props) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [error, setError] = useState('');

  const toName = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zа-яё0-9_]/gi, '');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    const name = toName(label);
    if (!name) {
      setError('Введите корректное название');
      return;
    }
    try {
      await createCustomField({ label: label.trim(), name, field_type: fieldType });
      setLabel('');
      setFieldType('text');
      setError('');
      onFieldsChange();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить поле? Все данные по этому полю будут удалены.')) return;
    await deleteCustomField(id);
    onFieldsChange();
  };

  return (
    <div className="card">
      <div className="card-header" onClick={() => setOpen((v) => !v)} style={{ cursor: 'pointer' }}>
        <h3>Настройка полей {open ? '▲' : '▼'}</h3>
      </div>
      {open && (
        <div className="card-body">
          <form onSubmit={handleAdd} className="field-form">
            <input
              type="text"
              placeholder="Название поля (напр. Компания)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <select value={fieldType} onChange={(e) => setFieldType(e.target.value)}>
              {FIELD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary">
              + Добавить поле
            </button>
          </form>
          {error && <p className="error">{error}</p>}
          {fields.length > 0 && (
            <ul className="field-list">
              {fields.map((f) => (
                <li key={f.id}>
                  <span>
                    <strong>{f.label}</strong>{' '}
                    <em>({FIELD_TYPES.find((t) => t.value === f.field_type)?.label || f.field_type})</em>
                  </span>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id)}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

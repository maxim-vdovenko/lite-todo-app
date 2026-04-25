import { CustomField, Todo, TodoFormData } from './types';

const BASE = '/api';

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${BASE}/todos`);
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

export async function createTodo(data: TodoFormData): Promise<Todo> {
  const res = await fetch(`${BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create todo');
  return res.json();
}

export async function updateTodo(id: number, data: Partial<TodoFormData> & { completed?: boolean }): Promise<Todo> {
  const res = await fetch(`${BASE}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update todo');
  return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${BASE}/todos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete todo');
}

export async function fetchCustomFields(): Promise<CustomField[]> {
  const res = await fetch(`${BASE}/custom-fields`);
  if (!res.ok) throw new Error('Failed to fetch custom fields');
  return res.json();
}

export async function createCustomField(data: { label: string; name: string; field_type: string }): Promise<CustomField> {
  const res = await fetch(`${BASE}/custom-fields`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create custom field');
  }
  return res.json();
}

export async function deleteCustomField(id: number): Promise<void> {
  const res = await fetch(`${BASE}/custom-fields/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete custom field');
}

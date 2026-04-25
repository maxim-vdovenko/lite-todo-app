export interface CustomField {
  id: number;
  name: string;
  label: string;
  field_type: 'text' | 'number' | 'email' | 'tel' | 'date';
  created_at: string;
}

export interface CustomValue {
  field_id: number;
  name: string;
  label: string;
  field_type: string;
  value: string;
}

export interface Todo {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  completed: boolean;
  created_at: string;
  customValues: CustomValue[];
}

export interface TodoFormData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  customValues: Record<number, string>;
}

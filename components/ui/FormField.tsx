import React from 'react';
import Input from './Input';
import Select from './Select';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'number';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  className?: string;
  helperText?: string;
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled,
  options,
  className = '',
  helperText,
}: FormFieldProps) {
  const commonProps = {
    value: String(value),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onChange(type === 'number' ? Number(e.target.value) : e.target.value),
    disabled,
    placeholder,
  };

  if (type === 'select') {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
        <Select
          options={options || []}
          {...commonProps}
        />
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
        <textarea
          name={name}
          {...commonProps}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <Input
        name={name}
        type={type}
        {...commonProps}
        error={error}
      />
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
}

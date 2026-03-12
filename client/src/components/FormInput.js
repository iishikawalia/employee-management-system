import React from 'react';

const FormInput = ({ label, type = 'text', value, onChange, placeholder, required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg py-2.5 px-3 border transition-colors shadow-sm outline-none"
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormInput;

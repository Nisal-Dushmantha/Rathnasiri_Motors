import React from 'react';

const Input = ({ label, className = '', error, ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 border ${
          error ? 'border-red-500' : 'border-gray-200'
        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;

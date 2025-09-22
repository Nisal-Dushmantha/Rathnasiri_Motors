import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center rounded-lg font-semibold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  const sizes = 'py-2 px-4';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-200 bg-white text-blue-700 hover:bg-blue-50',
    subtle: 'bg-gray-50 text-blue-900 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const cls = `${base} ${sizes} ${variants[variant] || variants.primary} ${className}`;
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
};

export default Button;

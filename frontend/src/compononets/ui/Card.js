import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-3xl shadow-lg border border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export default Card;

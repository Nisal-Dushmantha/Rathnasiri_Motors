import React from 'react';

const PageHeader = ({ title, subtitle, actions, icon = null, className = '' }) => {
  return (
    <div className={`mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-blue-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;

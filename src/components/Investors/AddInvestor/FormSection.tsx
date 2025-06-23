import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-8 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-100">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default FormSection;
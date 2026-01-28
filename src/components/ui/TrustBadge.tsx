import React from 'react';

export interface TrustBadgeProps {
  icon: React.ReactNode;
  text: string;
  variant?: 'default' | 'success';
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ icon, text, variant = 'default' }) => {
  const bgClasses = {
    default: 'bg-gray-50',
    success: 'bg-green-100',
  };
  
  const iconColorClasses = {
    default: 'text-gray-700',
    success: 'text-green-600',
  };
  
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 ${bgClasses[variant]} rounded-full`}>
      <span className={`flex-shrink-0 w-4 h-4 ${iconColorClasses[variant]}`}>
        {icon}
      </span>
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
        {text}
      </span>
    </div>
  );
};

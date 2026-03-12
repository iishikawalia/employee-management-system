import React from 'react';

const StatusBadge = ({ status }) => {
  let colorClass = 'bg-gray-100 text-gray-800 border-gray-200';

  switch (status?.toLowerCase()) {
    case 'approved':
    case 'present':
      colorClass = 'bg-green-100 text-green-800 border-green-200';
      break;
    case 'pending':
    case 'half-day':
      colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      break;
    case 'rejected':
    case 'absent':
      colorClass = 'bg-red-100 text-red-800 border-red-200';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

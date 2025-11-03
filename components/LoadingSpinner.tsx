
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="w-16 h-16">
      <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-full">
        <span className="w-full h-full border-4 border-t-indigo-500 border-r-indigo-500 rounded-full animate-spin"></span>
        <span className="w-full h-full border-4 border-t-indigo-500 border-r-indigo-500 rounded-full animate-[spin_1.5s_linear_infinite]"></span>
        <span className="w-full h-full border-4 border-t-indigo-500 border-r-indigo-500 rounded-full animate-[spin_2s_linear_infinite]"></span>
        <span className="w-full h-full border-4 border-t-indigo-500 border-r-indigo-500 rounded-full animate-[spin_2.5s_linear_infinite]"></span>
      </div>
    </div>
  );
};

export default LoadingSpinner;

import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
        <p className="mt-4 text-gray-600 font-medium">Đang tải...</p>
      </div>
    </div>
  );
};

export default Loading;
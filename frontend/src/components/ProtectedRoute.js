import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🚫</p>
          <h2 className="text-3xl font-bold text-red-600 mb-2">Không có quyền truy cập</h2>
          <p className="text-gray-600 mb-6">Bạn không có quyền truy cập trang này.</p>
          <a href="/" className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">
            ← Về trang chủ
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
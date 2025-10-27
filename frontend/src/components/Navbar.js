import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ cartCount }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🎮</span>
            <span className="text-white text-xl font-bold">Genshin Shop</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-white hover:text-yellow-400 transition font-medium"
            >
              Trang chủ
            </Link>
            <Link 
              to="/accounts" 
              className="text-white hover:text-yellow-400 transition font-medium"
            >
              Tài khoản
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-yellow-400 hover:text-yellow-300 transition font-medium"
                  >
                    👑 Admin
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="text-white hover:text-yellow-400 transition font-medium"
                >
                  👤 {user?.username}
                </Link>
                <Link 
                  to="/cart" 
                  className="relative bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition font-semibold"
                >
                  🛒 Giỏ hàng
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                >
                  🚪 Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-yellow-400 transition font-medium"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register" 
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition font-semibold"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-400 text-center py-2">
        <p className="text-black text-sm font-semibold">
          ⚠️ Website demo cho mục đích học tập
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
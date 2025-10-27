import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">🎮</h1>
          <h2 className="text-3xl font-bold text-white mb-2">Đăng nhập</h2>
          <p className="text-gray-300">Chào mừng trở lại Genshin Shop!</p>
        </div>

        {/* Login Form */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white px-4 py-3 rounded-lg mb-6">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Username hoặc Email
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Nhập username hoặc email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Nhập mật khẩu"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Đang đăng nhập...' : '🔑 Đăng nhập'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-blue-500 bg-opacity-20 rounded-lg border border-blue-400 border-opacity-30">
            <p className="text-white text-sm font-semibold mb-2">🎯 Tài khoản demo:</p>
            <div className="text-white text-xs space-y-1">
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>User:</strong> Đăng ký tài khoản mới</p>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-300 hover:text-white transition">
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: ''
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone
    });
    
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
          <h2 className="text-3xl font-bold text-white mb-2">Đăng ký</h2>
          <p className="text-gray-300">Tạo tài khoản mới tại Genshin Shop</p>
        </div>

        {/* Register Form */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white px-4 py-3 rounded-lg mb-6">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Họ và tên *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Nguyễn Văn A"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength="3"
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="username123"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="0123456789"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Mật khẩu *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Ít nhất 6 ký tự"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Xác nhận mật khẩu *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Nhập lại mật khẩu"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? '⏳ Đang đăng ký...' : '✅ Đăng ký'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                Đăng nhập ngay
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

export default RegisterPage;
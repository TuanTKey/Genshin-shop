import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || ''
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authAPI.updateProfile(profileData);
      updateUser(response.data.data);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Có lỗi xảy ra' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không khớp' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }

    setLoading(true);

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Có lỗi xảy ra' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">👤 Tài khoản của tôi</h1>

        {/* User Info Card */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl">
              👤
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.fullName}</h2>
              <p className="text-gray-200">@{user?.username}</p>
              <p className="text-gray-200">{user?.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                user?.role === 'admin' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'
              }`}>
                {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'info'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📝 Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'password'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🔒 Đổi mật khẩu
            </button>
          </div>

          <div className="p-8">
            {/* Message */}
            {message.text && (
              <div className={`mb-6 px-4 py-3 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-100 border border-green-400 text-green-700'
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                {message.type === 'success' ? '✅' : '❌'} {message.text}
              </div>
            )}

            {/* Profile Info Tab */}
            {activeTab === 'info' && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={user?.username}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Username không thể thay đổi</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? '⏳ Đang cập nhật...' : '💾 Lưu thay đổi'}
                </button>
              </form>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại *
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới *
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-teal-600 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? '⏳ Đang xử lý...' : '🔒 Đổi mật khẩu'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
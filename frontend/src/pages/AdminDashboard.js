import React, { useState, useEffect } from 'react';
import { authAPI, accountAPI, orderAPI } from '../services/api';
import Loading from '../components/Loading';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, accountsRes, ordersRes] = await Promise.all([
        accountAPI.getStats(),
        authAPI.getAllUsers(),
        accountAPI.getAll(),
        orderAPI.getAll()
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setAccounts(accountsRes.data.data);
      setOrders(ordersRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await authAPI.toggleUserStatus(userId);
      fetchDashboardData();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản này?')) {
      try {
        await accountAPI.delete(accountId);
        fetchDashboardData();
        alert('✅ Xóa thành công!');
      } catch (error) {
        alert('❌ Có lỗi xảy ra!');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      fetchDashboardData();
      alert('✅ Cập nhật trạng thái thành công!');
    } catch (error) {
      alert('❌ Có lỗi xảy ra!');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            👑 Admin Dashboard
          </h1>
          <p className="text-gray-600">Quản lý hệ thống Genshin Shop</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100">Tổng tài khoản</p>
              <span className="text-3xl">📦</span>
            </div>
            <p className="text-4xl font-bold">{stats?.total || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100">Còn hàng</p>
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-4xl font-bold">{stats?.available || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-red-100">Đã bán</p>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-4xl font-bold">{stats?.sold || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100">Users</p>
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-4xl font-bold">{users.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                activeTab === 'stats'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📊 Thống kê
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                activeTab === 'users'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              👥 Người dùng ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                activeTab === 'accounts'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🎮 Tài khoản ({accounts.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
                activeTab === 'orders'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🛒 Đơn hàng ({orders.length})
            </button>
          </div>

          <div className="p-6">
            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">📊 Thống kê tổng quan</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">Giá trung bình</h4>
                    <p className="text-3xl font-bold text-blue-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(stats?.averagePrice || 0)}
                    </p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">Tổng đơn hàng</h4>
                    <p className="text-3xl font-bold text-green-600">{orders.length}</p>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3">Đơn chờ xử lý</h4>
                    <p className="text-3xl font-bold text-purple-600">
                      {orders.filter(o => o.status === 'pending').length}
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-3">Đơn đã giao</h4>
                    <p className="text-3xl font-bold text-yellow-600">
                      {orders.filter(o => o.status === 'delivered').length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">👥 Quản lý người dùng</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium text-gray-900">{user.fullName}</div>
                              <div className="text-sm text-gray-500">@{user.username}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? '✅ Active' : '❌ Locked'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleToggleUserStatus(user._id)}
                                className={`px-3 py-1 rounded ${
                                  user.isActive
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-green-500 hover:bg-green-600'
                                } text-white text-xs font-semibold`}
                              >
                                {user.isActive ? '🔒 Khóa' : '🔓 Mở'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Accounts Tab */}
            {activeTab === 'accounts' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">🎮 Quản lý tài khoản game</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AR</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân vật</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Server</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {accounts.map(account => (
                        <tr key={account._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-purple-600">AR {account.adventureRank}</div>
                            <div className="text-xs text-gray-500">{account.fiveStars}★ 5 | {account.fourStars}★ 4</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {account.characters.slice(0, 3).map((char, idx) => (
                                <span key={idx} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  {char}
                                </span>
                              ))}
                              {account.characters.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  +{account.characters.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {account.region}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-yellow-600">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(account.price)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              account.status === 'available'
                                ? 'bg-green-100 text-green-800'
                                : account.status === 'sold'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {account.status === 'available' ? '✅ Có sẵn' : 
                               account.status === 'sold' ? '❌ Đã bán' : '⏳ Đang giữ'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button
                              onClick={() => handleDeleteAccount(account._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold"
                            >
                              🗑️ Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">🛒 Quản lý đơn hàng</h3>
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-bold text-gray-800 mb-2">Thông tin khách hàng</h4>
                          <p className="text-sm text-gray-600"><strong>Tên:</strong> {order.customerName}</p>
                          <p className="text-sm text-gray-600"><strong>Email:</strong> {order.customerEmail}</p>
                          <p className="text-sm text-gray-600"><strong>SĐT:</strong> {order.customerPhone || 'N/A'}</p>
                          <p className="text-sm text-gray-600"><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 mb-2">Thông tin đơn hàng</h4>
                          <p className="text-sm text-gray-600"><strong>Giá:</strong> <span className="text-yellow-600 font-bold">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(order.totalPrice)}
                          </span></p>
                          <p className="text-sm text-gray-600"><strong>Thanh toán:</strong> {order.paymentMethod}</p>
                          <p className="text-sm text-gray-600"><strong>Ghi chú:</strong> {order.notes || 'Không có'}</p>
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Trạng thái:
                            </label>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm"
                            >
                              <option value="pending">⏳ Chờ xử lý</option>
                              <option value="paid">💰 Đã thanh toán</option>
                              <option value="delivered">✅ Đã giao</option>
                              <option value="cancelled">❌ Đã hủy</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-4xl mb-3">📦</p>
                      <p>Chưa có đơn hàng nào</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
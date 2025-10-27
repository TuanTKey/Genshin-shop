import React, { useState, useEffect } from 'react';
import { accountAPI } from '../services/api';
import AccountCard from '../components/AccountCard';
import Filter from '../components/Filter';
import Loading from '../components/Loading';

const AccountsPage = ({ onAddToCart, cart }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  // Fetch accounts
  useEffect(() => {
    fetchAccounts();
  }, [filters]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await accountAPI.getAll(filters);
      setAccounts(response.data.data);
    } catch (err) {
      setError('Không thể tải danh sách tài khoản. Vui lòng thử lại!');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (account) => {
    const isInCart = cart.some(item => item._id === account._id);
    if (isInCart) {
      alert('Tài khoản này đã có trong giỏ hàng!');
      return;
    }
    if (account.status !== 'available') {
      alert('Tài khoản này không còn khả dụng!');
      return;
    }
    onAddToCart(account);
    alert('✅ Đã thêm vào giỏ hàng!');
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎮 Danh sách tài khoản
          </h1>
          <p className="text-gray-600">
            Tìm và chọn tài khoản Genshin Impact phù hợp với bạn
          </p>
        </div>

        {/* Filter */}
        <Filter filters={filters} onFilterChange={setFilters} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <p className="text-gray-700">
            Tìm thấy <span className="font-bold text-yellow-600">{accounts.length}</span> tài khoản
          </p>
        </div>

        {/* Accounts Grid */}
        {accounts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">😢</p>
            <p className="text-xl text-gray-600">Không tìm thấy tài khoản nào</p>
            <button
              onClick={() => setFilters({})}
              className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              🔄 Reset bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map(account => (
              <AccountCard
                key={account._id}
                account={account}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsPage;
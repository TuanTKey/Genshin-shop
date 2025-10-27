import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';

const CartPage = ({ cart, onRemoveFromCart, onClearCart }) => {
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'bank_transfer',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    setLoading(true);

    try {
      // Tạo order cho từng account trong giỏ
      const orderPromises = cart.map(account => 
        orderAPI.create({
          accountId: account._id,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          paymentMethod: customerInfo.paymentMethod,
          notes: customerInfo.notes
        })
      );

      await Promise.all(orderPromises);
      
      alert('✅ Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      onClearCart();
      navigate('/');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('❌ Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-8xl mb-6">🛒</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-8">
            Hãy thêm một số tài khoản vào giỏ hàng của bạn!
          </p>
          <button
            onClick={() => navigate('/accounts')}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition"
          >
            🎮 Xem tài khoản
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          🛒 Giỏ hàng của bạn
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg">
                      <p className="text-sm">AR</p>
                      <p className="text-2xl font-bold">{item.adventureRank}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        Tài khoản AR {item.adventureRank} - {item.region}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.fiveStars} nhân vật 5★, {item.fourStars} nhân vật 4★
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.characters.slice(0, 5).map((char, index) => (
                      <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        ⭐ {char}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right ml-6">
                  <p className="text-2xl font-bold text-yellow-600 mb-3">
                    {formatPrice(item.price)}
                  </p>
                  <button
                    onClick={() => onRemoveFromCart(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📋 Tóm tắt đơn hàng
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Số lượng:</span>
                  <span className="font-semibold">{cart.length} tài khoản</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-yellow-600">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-teal-600 transition shadow-lg"
                >
                  💳 Tiến hành thanh toán
                </button>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ tên *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                      placeholder="Nguyen Van A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                      placeholder="0123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phương thức thanh toán
                    </label>
                    <select
                      name="paymentMethod"
                      value={customerInfo.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                      <option value="momo">Ví MoMo</option>
                      <option value="zalopay">ZaloPay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      name="notes"
                      value={customerInfo.notes}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                      rows="3"
                      placeholder="Ghi chú thêm (nếu có)..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-teal-600 transition shadow-lg disabled:opacity-50"
                  >
                    {loading ? '⏳ Đang xử lý...' : '✅ Xác nhận đặt hàng'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    ← Quay lại
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
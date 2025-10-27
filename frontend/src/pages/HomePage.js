import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            🎮 Genshin Impact Shop
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            Mua bán tài khoản Genshin Impact uy tín, chất lượng
          </p>
          <p className="text-yellow-400 text-lg mb-12">
            ⚠️ Website demo cho mục đích học tập với MongoDB & Jenkins
          </p>
          
          <div className="flex justify-center gap-6">
            <Link 
              to="/accounts"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-lg text-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
            >
              🛒 Xem tài khoản
            </Link>
            <Link 
              to="/about"
              className="bg-white bg-opacity-10 backdrop-blur-md text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-opacity-20 transition-all border-2 border-white border-opacity-30"
            >
              ℹ️ Về chúng tôi
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 text-center hover:bg-opacity-20 transition">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Tài khoản chất lượng
            </h3>
            <p className="text-gray-300">
              Nhiều nhân vật 5 sao, AR cao, đầy đủ tài nguyên
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 text-center hover:bg-opacity-20 transition">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Giao dịch an toàn
            </h3>
            <p className="text-gray-300">
              Thanh toán qua ngân hàng, bảo mật thông tin
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 text-center hover:bg-opacity-20 transition">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Giá cả hợp lý
            </h3>
            <p className="text-gray-300">
              Giá tốt nhất thị trường, nhiều ưu đãi
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-white mb-2">500+</p>
            <p className="text-white">Tài khoản đã bán</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-white mb-2">1000+</p>
            <p className="text-white">Khách hàng</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-white mb-2">4.9/5</p>
            <p className="text-white">Đánh giá</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-white mb-2">24/7</p>
            <p className="text-white">Hỗ trợ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
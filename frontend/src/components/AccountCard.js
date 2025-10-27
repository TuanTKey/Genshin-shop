import React from 'react';

const AccountCard = ({ account, onAddToCart }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white text-sm font-medium">Adventure Rank</p>
            <p className="text-white text-4xl font-bold">{account.adventureRank}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            account.status === 'available' 
              ? 'bg-green-500 text-white' 
              : account.status === 'sold'
              ? 'bg-red-500 text-white'
              : 'bg-yellow-500 text-black'
          }`}>
            {account.status === 'available' ? '✅ Có sẵn' : 
             account.status === 'sold' ? '❌ Đã bán' : '⏳ Đang giữ'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Characters */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm font-medium mb-2">
            Nhân vật nổi bật:
          </p>
          <div className="flex flex-wrap gap-2">
            {account.characters.slice(0, 4).map((char, index) => (
              <span 
                key={index}
                className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold"
              >
                ⭐ {char}
              </span>
            ))}
            {account.characters.length > 4 && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                +{account.characters.length - 4} khác
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg">
            <p className="text-gray-600 text-xs">5★ Characters</p>
            <p className="text-yellow-600 font-bold text-lg">{account.fiveStars}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg">
            <p className="text-gray-600 text-xs">4★ Characters</p>
            <p className="text-purple-600 font-bold text-lg">{account.fourStars}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
            <p className="text-gray-600 text-xs">Primogems</p>
            <p className="text-blue-600 font-bold text-lg">
              {account.primogems.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
            <p className="text-gray-600 text-xs">Server</p>
            <p className="text-green-600 font-bold text-lg">{account.region}</p>
          </div>
        </div>

        {/* Description */}
        {account.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {account.description}
          </p>
        )}

        {/* Price & Button */}
        <div className="border-t pt-4">
          <p className="text-3xl font-bold text-yellow-600 mb-3">
            {formatPrice(account.price)}
          </p>
          <button
            onClick={() => onAddToCart(account)}
            disabled={account.status !== 'available'}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
              account.status === 'available'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {account.status === 'available' ? '🛒 Thêm vào giỏ' : 
             account.status === 'sold' ? '❌ Đã bán' : '⏳ Đang giữ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
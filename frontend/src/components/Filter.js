import React from 'react';

const Filter = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 Lọc tài khoản</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm nhân vật
          </label>
          <input
            type="text"
            placeholder="Zhongli, Raiden..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Server
          </label>
          <select
            value={filters.region || ''}
            onChange={(e) => onFilterChange({ ...filters, region: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Tất cả</option>
            <option value="Asia">Asia</option>
            <option value="America">America</option>
            <option value="Europe">Europe</option>
          </select>
        </div>

        {/* Min AR */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AR tối thiểu
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.minAR || ''}
            onChange={(e) => onFilterChange({ ...filters, minAR: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giá tối đa (VNĐ)
          </label>
          <input
            type="number"
            placeholder="5000000"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        onClick={() => onFilterChange({})}
        className="mt-4 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
      >
        🔄 Reset bộ lọc
      </button>
    </div>
  );
};

export default Filter;
import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            ℹ️ Về dự án này
          </h1>

          <div className="space-y-6 text-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-yellow-600 mb-3">
                🎯 Mục đích
              </h2>
              <p className="leading-relaxed">
                Đây là một dự án demo website bán tài khoản Genshin Impact được xây dựng 
                với mục đích <strong>học tập và thực hành</strong> các công nghệ web hiện đại.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                <p className="font-semibold text-yellow-800">
                  ⚠️ Lưu ý quan trọng:
                </p>
                <p className="text-yellow-700 mt-2">
                  Website này chỉ dùng cho mục đích học tập. Việc mua bán tài khoản game 
                  vi phạm điều khoản dịch vụ của hầu hết các nhà phát triển game.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-blue-600 mb-3">
                🛠️ Công nghệ sử dụng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-2">Backend:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>✅ Node.js & Express</li>
                    <li>✅ MongoDB & Mongoose</li>
                    <li>✅ REST API</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-bold text-purple-800 mb-2">Frontend:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>✅ React.js</li>
                    <li>✅ React Router</li>
                    <li>✅ Axios</li>
                    <li>✅ Tailwind CSS</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-3">
                📚 Tính năng đã implement
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>CRUD operations cho tài khoản game</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Hệ thống giỏ hàng và đặt hàng</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Filter và tìm kiếm tài khoản</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Quản lý orders và status</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Responsive design</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-red-600 mb-3">
                🚀 Kế hoạch tương lai
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">○</span>
                  <span>Tích hợp Jenkins CI/CD</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">○</span>
                  <span>Authentication & Authorization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">○</span>
                  <span>Admin dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">○</span>
                  <span>Upload ảnh tài khoản</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">○</span>
                  <span>Payment gateway integration</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg mt-8">
              <h3 className="font-bold text-gray-800 mb-2">
                👨‍💻 Developer Notes
              </h3>
              <p className="text-sm text-gray-600">
                Project này được tạo ra để học và thực hành các kỹ năng full-stack development.
                Nếu bạn muốn sử dụng code này, hãy đảm bảo tuân thủ các quy định pháp luật 
                và điều khoản dịch vụ của các nền tảng game.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
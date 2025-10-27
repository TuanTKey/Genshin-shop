import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import AccountsPage from './pages/AccountsPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('genshin-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('genshin-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (account) => {
    setCart([...cart, account]);
  };

  const removeFromCart = (accountId) => {
    setCart(cart.filter(item => item._id !== accountId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('genshin-cart');
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar cartCount={cart.length} />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            
            <Route 
              path="/accounts" 
              element={
                <AccountsPage 
                  onAddToCart={addToCart} 
                  cart={cart}
                />
              } 
            />
            
            <Route 
              path="/cart" 
              element={
                <CartPage 
                  cart={cart}
                  onRemoveFromCart={removeFromCart}
                  onClearCart={clearCart}
                />
              } 
            />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes - Yêu cầu đăng nhập */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Admin Only Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-8 mt-20">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-400 mb-2">
                © 2025 Genshin Shop Demo - Website học tập
              </p>
              <p className="text-gray-500 text-sm">
                Built with React, Node.js, Express & MongoDB
              </p>
              <div className="mt-4 space-x-4">
                <a href="https://github.com" className="text-gray-400 hover:text-white transition">
                  GitHub
                </a>
                <a href="/about" className="text-gray-400 hover:text-white transition">
                  About
                </a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

// 404 Not Found Page
const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-gray-300 mb-8">Trang không tồn tại</p>
        <a 
          href="/" 
          className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition inline-block"
        >
          ← Về trang chủ
        </a>
      </div>
    </div>
  );
};

export default App;
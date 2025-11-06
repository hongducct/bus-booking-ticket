import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { SeatSelectionPage } from './components/SeatSelectionPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderManagementPage } from './components/OrderManagementPage';
import { TrackingPage } from './components/TrackingPage';
import { LiveChatSupport } from './components/LiveChatSupport';
import { Toaster } from './components/ui/sonner';
import { Bus, Menu, X } from 'lucide-react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <Toaster position="top-center" richColors />
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-lg">
                  <Bus className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  VeXeViet
                </span>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Trang chủ
                </Link>
                <Link to="/tracking" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Tra cứu vé
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Quản lý đơn hàng
                </Link>
                <Link to="/orders" className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                  Đăng nhập
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 space-y-3">
                <Link
                  to="/"
                  className="block text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Trang chủ
                </Link>
                <Link
                  to="/tracking"
                  className="block text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tra cứu vé
                </Link>
                <Link
                  to="/orders"
                  className="block text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Quản lý đơn hàng
                </Link>
                <Link
                  to="/orders"
                  className="block bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-2 rounded-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </nav>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/seat-selection/:tripId" element={<SeatSelectionPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderManagementPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Live Chat Support */}
        <LiveChatSupport />

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-lg">
                    <Bus className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl">VeXeViet</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Nền tảng đặt vé xe khách hàng đầu Việt Nam
                </p>
              </div>
              <div>
                <h3 className="mb-4">Về chúng tôi</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Giới thiệu</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4">Hỗ trợ</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Điều khoản</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Chính sách</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn</a></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4">Liên hệ</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Hotline: 1900 6467</li>
                  <li>Email: support@vexeviet.com</li>
                  <li>Giờ làm việc: 24/7</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              © 2025 VeXeViet. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

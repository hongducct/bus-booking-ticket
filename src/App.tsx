import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeProvider';
import { HomePage } from './components/HomePage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { SeatSelectionPage } from './components/SeatSelectionPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderManagementPage } from './components/OrderManagementPage';
import { TrackingPage } from './components/TrackingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminBookingsPage } from './components/AdminBookingsPage';
import { AdminTripsPage } from './components/AdminTripsPage';
import { AdminUsersPage } from './components/AdminUsersPage';
import { UserMenu } from './components/UserMenu';
// import { ThemeSwitcher } from './components/ThemeSwitcher';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LiveChatSupport } from './components/LiveChatSupport';
import { Toaster } from './components/ui/sonner';
import { Bus, Menu, X } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { isAdmin } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Toaster position="top-center" richColors />
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
          <nav className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-lg shadow-md">
                  <Bus className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  MaiLinh Transit
                </span>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-3">
                <Link 
                  to="/" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium whitespace-nowrap"
                >
                  {t('common.home')}
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium whitespace-nowrap"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  to="/tracking" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium whitespace-nowrap"
                >
                  {t('common.tracking')}
                </Link>
                <Link 
                  to="/orders" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium whitespace-nowrap"
                >
                  {t('common.orders')}
                </Link>
                <UserMenu />
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
              <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                <Link
                  to="/"
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('common.home')}
                </Link>
                <Link
                  to="/tracking"
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('common.tracking')}
                </Link>
                <Link
                  to="/orders"
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('common.orders')}
                </Link>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <UserMenu />
                </div>
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderManagementPage />
              </ProtectedRoute>
            }
          />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                <AdminBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/trips"
            element={
              <ProtectedRoute>
                <AdminTripsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Live Chat Support */}
        <LiveChatSupport />

        {/* Floating Language & Theme Switcher */}
        <div className="fixed right-4 md:right-6 z-50 flex flex-col gap-3" style={{ top: '80px' }}>
          <LanguageSwitcher />
          {/* <ThemeSwitcher /> */}
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-20 border-t border-gray-800">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-lg shadow-md">
                    <Bus className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                    MaiLinh Transit
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Nền tảng đặt vé xe khách hàng đầu Việt Nam
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-white">Về chúng tôi</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Giới thiệu
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Tuyển dụng
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Liên hệ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-white">Hỗ trợ</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Điều khoản
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Chính sách
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Hướng dẫn
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-white">Liên hệ</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <span>📞</span>
                    <span>Hotline: 079 9076 901</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✉️</span>
                    <span>Email: support@hongducct.id.vn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🕐</span>
                    <span>Giờ làm việc: 24/7</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
              © 2025 Hong Duc CT. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

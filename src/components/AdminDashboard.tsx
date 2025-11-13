import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getDashboardStats } from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Users, Ticket, TrendingUp, Calendar, Package, Settings } from 'lucide-react';

export function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bảng điều khiển Admin</h1>
        <div className="flex gap-2">
          <Link to="/admin/bookings">
            <Button variant="outline">
              <Package className="w-4 h-4 mr-2" />
              Quản lý đơn hàng
            </Button>
          </Link>
          <Link to="/admin/trips">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Quản lý chuyến xe
            </Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Tạo Admin
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overview?.totalBookings || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                stats?.overview?.totalRevenue || 0
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overview?.totalUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chuyến xe</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overview?.totalTrips || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Đơn hàng:</span>
                <span className="font-bold">{stats?.today?.bookings || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Doanh thu:</span>
                <span className="font-bold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    stats?.today?.revenue || 0
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tháng này</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Đơn hàng:</span>
                <span className="font-bold">{stats?.thisMonth?.bookings || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Doanh thu:</span>
                <span className="font-bold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    stats?.thisMonth?.revenue || 0
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Trạng thái đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.bookingsByStatus?.pending || 0}
              </div>
              <div className="text-sm text-muted-foreground">Chờ xử lý</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats?.bookingsByStatus?.confirmed || 0}
              </div>
              <div className="text-sm text-muted-foreground">Đã xác nhận</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats?.bookingsByStatus?.cancelled || 0}
              </div>
              <div className="text-sm text-muted-foreground">Đã hủy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


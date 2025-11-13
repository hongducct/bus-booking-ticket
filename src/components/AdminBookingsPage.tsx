import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getBookings, updateBookingStatus } from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, CheckCircle2 } from 'lucide-react';

export function AdminBookingsPage() {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (isAdmin) {
      loadBookings();
    }
  }, [isAdmin]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getBookings();
      console.log('Loaded bookings:', data);
      console.log('Booking statuses:', data.map((b: any) => ({ id: b.id, status: b.status })));
      setBookings(data);
    } catch (error: any) {
      console.error('Error loading bookings:', error);
      toast.error(error.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      console.log('handleUpdateStatus called:', { bookingId, status });
      const result = await updateBookingStatus(bookingId, status);
      console.log('handleUpdateStatus success:', result);
      toast.success('Cập nhật trạng thái thành công');
      // Reload bookings after a short delay to ensure backend has updated
      setTimeout(() => {
        loadBookings();
      }, 500);
    } catch (error: any) {
      console.error('handleUpdateStatus error:', error);
      toast.error(error.message || 'Không thể cập nhật trạng thái');
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">Đã xác nhận</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 text-white">Đã hủy</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Chờ xử lý</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500 text-white">Hoàn thành</Badge>;
      default:
        return <Badge>{status || 'unknown'}</Badge>;
    }
  };

  const getWorkflowSteps = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    const steps = [
      { key: 'pending', label: 'Chờ xử lý', icon: Clock, active: normalizedStatus === 'pending' },
      { key: 'confirmed', label: 'Đã xác nhận', icon: CheckCircle, active: normalizedStatus === 'confirmed' || normalizedStatus === 'completed' },
      { key: 'completed', label: 'Hoàn thành', icon: CheckCircle2, active: normalizedStatus === 'completed' },
    ];

    if (normalizedStatus === 'cancelled') {
      return [
        { key: 'pending', label: 'Chờ xử lý', icon: Clock, active: true, cancelled: true },
        { key: 'cancelled', label: 'Đã hủy', icon: XCircle, active: true, cancelled: true },
      ];
    }

    return steps;
  };

  // Filter bookings by status
  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === 'all') return true;
    return booking.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Tất cả ({bookings.length})
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
            className={statusFilter === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
          >
            Chờ xử lý ({bookings.filter((b) => b.status?.toLowerCase() === 'pending').length})
          </Button>
          <Button
            variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('confirmed')}
            className={statusFilter === 'confirmed' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            Đã xác nhận ({bookings.filter((b) => b.status?.toLowerCase() === 'confirmed').length})
          </Button>
          <Button
            variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('cancelled')}
            className={statusFilter === 'cancelled' ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            Đã hủy ({bookings.filter((b) => b.status?.toLowerCase() === 'cancelled').length})
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {bookings.length === 0 ? 'Chưa có đơn hàng nào' : 'Không có đơn hàng nào với bộ lọc này'}
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => {
            // Debug: Log booking status
            console.log('Rendering booking:', {
              id: booking.id,
              status: booking.status,
              statusType: typeof booking.status,
              statusLower: booking.status?.toLowerCase(),
            });
            
            return (
            <Card key={booking.id} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Đơn hàng #{booking.orderId}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(booking.bookingDate).toLocaleString('vi-VN')}
                    </p>
                    {/* Debug info */}
                    <p className="text-xs text-red-500 mt-1">
                      Debug: status = "{booking.status}" (type: {typeof booking.status})
                    </p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Workflow Indicator */}
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                    <h3 className="font-semibold mb-3 text-sm">Trạng thái đơn hàng</h3>
                    <div className="flex items-center justify-between">
                      {getWorkflowSteps(booking.status).map((step, index) => {
                        const Icon = step.icon;
                        const isLast = index === getWorkflowSteps(booking.status).length - 1;
                        const isActive = step.active;
                        const isCancelled = step.cancelled;

                        return (
                          <div key={step.key} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                  isActive
                                    ? isCancelled
                                      ? 'bg-red-100 border-red-500 text-red-600 dark:bg-red-900 dark:border-red-400'
                                      : 'bg-green-100 border-green-500 text-green-600 dark:bg-green-900 dark:border-green-400'
                                    : 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-600'
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <span
                                className={`text-xs mt-2 text-center ${
                                  isActive
                                    ? isCancelled
                                      ? 'text-red-600 font-semibold dark:text-red-400'
                                      : 'text-green-600 font-semibold dark:text-green-400'
                                    : 'text-gray-400 dark:text-gray-500'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                            {!isLast && (
                              <div
                                className={`flex-1 h-0.5 mx-2 ${
                                  isActive && !isCancelled
                                    ? 'bg-green-500 dark:bg-green-400'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {booking.trip && (
                    <div>
                      <h3 className="font-semibold mb-2">Thông tin chuyến xe</h3>
                      <p>
                        {booking.trip.from} → {booking.trip.to}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.trip.departureTime} - {booking.trip.company}
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
                    <p>Tên: {booking.customerInfo?.name}</p>
                    <p>SĐT: {booking.customerInfo?.phone}</p>
                    {booking.customerInfo?.email && <p>Email: {booking.customerInfo.email}</p>}
                  </div>

                  {booking.seats && booking.seats.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Ghế đã đặt</h3>
                      <div className="flex flex-wrap gap-2">
                        {booking.seats.map((seat: any) => (
                          <Badge key={seat.id} variant="outline">
                            {seat.number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <span className="text-sm text-muted-foreground">Tổng tiền: </span>
                      <span className="text-lg font-bold">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                          booking.totalPrice
                        )}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {(() => {
                        const normalizedStatus = String(booking.status || '').toLowerCase().trim();
                        const isPending = normalizedStatus === 'pending';
                        const isConfirmed = normalizedStatus === 'confirmed';
                        const isCompleted = normalizedStatus === 'completed';
                        const isCancelled = normalizedStatus === 'cancelled';
                        
                        console.log('Booking action buttons check:', {
                          id: booking.id,
                          originalStatus: booking.status,
                          normalizedStatus,
                          isPending,
                          isConfirmed,
                          isCompleted,
                          isCancelled,
                        });
                        
                        // Show confirm/cancel buttons for pending orders
                        if (isPending) {
                          return (
                            <>
                              <Button
                                size="sm"
                                onClick={() => {
                                  console.log('Confirming booking:', booking.id, booking.status);
                                  handleUpdateStatus(booking.id, 'confirmed');
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Xác nhận đơn
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                                    handleUpdateStatus(booking.id, 'cancelled');
                                  }
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Hủy đơn
                              </Button>
                            </>
                          );
                        }
                        
                        // Show complete/cancel buttons for confirmed orders
                        if (isConfirmed) {
                          return (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Hoàn thành
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng đã xác nhận?')) {
                                    handleUpdateStatus(booking.id, 'cancelled');
                                  }
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Hủy đơn
                              </Button>
                            </>
                          );
                        }
                        
                        // Show status badge for completed or cancelled
                        if (isCompleted) {
                          return <Badge className="bg-blue-500 text-white">Đơn hàng đã hoàn thành</Badge>;
                        }
                        
                        if (isCancelled) {
                          return <Badge className="bg-red-500 text-white">Đơn hàng đã bị hủy</Badge>;
                        }
                        
                        // Fallback: if status is unknown, show confirm button anyway
                        return (
                          <>
                            <Button
                              size="sm"
                              onClick={() => {
                                console.log('Confirming booking (fallback):', booking.id, booking.status);
                                handleUpdateStatus(booking.id, 'confirmed');
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Xác nhận đơn
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                                  handleUpdateStatus(booking.id, 'cancelled');
                                }
                              }}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Hủy đơn
                            </Button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })
        )}
      </div>
    </div>
  );
}


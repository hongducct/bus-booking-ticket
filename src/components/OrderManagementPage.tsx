import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Download,
  X,
  Ticket,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Order {
  orderId: string;
  trip: any;
  seats: any[];
  customerInfo: any;
  totalPrice: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
}

export function OrderManagementPage() {
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newOrder, setNewOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);

    // Check for new order from checkout
    if (location.state?.newOrder && location.state?.showSuccess) {
      setNewOrder(location.state.newOrder);
      setShowSuccessModal(true);
    }
  }, [location]);

  const getStatusBadge = (status: string) => {
    const configs: { [key: string]: { label: string; variant: any; icon: any } } = {
      pending: {
        label: 'Chờ xác nhận',
        variant: 'secondary',
        icon: <Clock className="w-4 h-4" />,
      },
      confirmed: {
        label: 'Đã xác nhận',
        variant: 'default',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      completed: {
        label: 'Hoàn thành',
        variant: 'default',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      cancelled: {
        label: 'Đã hủy',
        variant: 'destructive',
        icon: <XCircle className="w-4 h-4" />,
      },
    };
    const config = configs[status] || configs.pending;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: { [key: string]: string } = {
      momo: 'Ví MoMo',
      bank: 'Chuyển khoản',
      card: 'Thẻ tín dụng',
      cash: 'Tiền mặt',
    };
    return labels[method] || method;
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      const updatedOrders = orders.map((order) =>
        order.orderId === orderId ? { ...order, status: 'cancelled' as const } : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
  };

  const filterOrders = (status?: string) => {
    if (!status) return orders;
    return orders.filter((order) => order.status === status);
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl">Mã đơn: {order.orderId}</h3>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-sm text-gray-500">
            Đặt ngày: {new Date(order.bookingDate).toLocaleString('vi-VN')}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl text-orange-500">{order.totalPrice.toLocaleString('vi-VN')}đ</div>
          <div className="text-sm text-gray-500">{getPaymentMethodLabel(order.paymentMethod)}</div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Ticket className="w-4 h-4 text-blue-600" />
          <span>{order.trip.company}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span>
            {order.trip.from} → {order.trip.to}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>{order.trip.departureTime}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-4 h-4 text-orange-500" />
          <span>
            Ghế: {order.seats.map((s) => s.number).join(', ')} ({order.seats.length} ghế)
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Tải vé
        </Button>
        {order.status === 'pending' && (
          <Button
            variant="destructive"
            onClick={() => handleCancelOrder(order.orderId)}
          >
            Hủy đơn
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8">Quản lý đơn hàng</h1>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Ticket className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xl">Chưa có đơn hàng nào</p>
            <p className="text-sm mt-2">Hãy đặt vé để bắt đầu hành trình của bạn</p>
          </div>
          <Button
            onClick={() => (window.location.href = '/')}
            className="mt-4 bg-gradient-to-r from-blue-600 to-orange-500"
          >
            Đặt vé ngay
          </Button>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4 mb-8">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
            <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
            <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            {filterOrders('confirmed').length > 0 ? (
              filterOrders('confirmed').map((order) => (
                <OrderCard key={order.orderId} order={order} />
              ))
            ) : (
              <Card className="p-12 text-center text-gray-400">
                <p>Không có đơn hàng đã xác nhận</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {filterOrders('pending').length > 0 ? (
              filterOrders('pending').map((order) => (
                <OrderCard key={order.orderId} order={order} />
              ))
            ) : (
              <Card className="p-12 text-center text-gray-400">
                <p>Không có đơn hàng chờ xác nhận</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {filterOrders('cancelled').length > 0 ? (
              filterOrders('cancelled').map((order) => (
                <OrderCard key={order.orderId} order={order} />
              ))
            ) : (
              <Card className="p-12 text-center text-gray-400">
                <p>Không có đơn hàng đã hủy</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && newOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl mb-2">Đặt vé thành công!</h2>
                  <p className="text-gray-600">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</p>
                </div>

                <Card className="p-4 text-left mb-6 bg-gray-50">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã đơn hàng</span>
                      <span className="text-blue-600">{newOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tuyến đường</span>
                      <span>
                        {newOrder.trip.from} → {newOrder.trip.to}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số ghế</span>
                      <span>{newOrder.seats.map((s) => s.number).join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng tiền</span>
                      <span className="text-orange-500">
                        {newOrder.totalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </Card>

                <div className="space-y-3">
                  <Button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full bg-gradient-to-r from-blue-600 to-orange-500"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải vé điện tử
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSuccessModal(false);
                      window.location.href = '/';
                    }}
                    className="w-full"
                  >
                    Về trang chủ
                  </Button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Vé điện tử đã được gửi đến email: {newOrder.customerInfo.email || 'N/A'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

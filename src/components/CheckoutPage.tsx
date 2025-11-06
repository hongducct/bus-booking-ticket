import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  ArrowLeft,
} from 'lucide-react';

export function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { trip, seats, customerInfo, totalPrice } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo' | 'bank' | 'cash'>('momo');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!trip || !seats) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">Không tìm thấy thông tin đặt vé</p>
        <Button onClick={() => navigate('/')}>Về trang chủ</Button>
      </div>
    );
  }

  const paymentMethods = [
    {
      id: 'momo',
      name: 'Ví MoMo',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Thanh toán qua ví điện tử MoMo',
    },
    {
      id: 'bank',
      name: 'Chuyển khoản ngân hàng',
      icon: <Building2 className="w-6 h-6" />,
      description: 'Chuyển khoản qua tài khoản ngân hàng',
    },
    {
      id: 'card',
      name: 'Thẻ tín dụng/ghi nợ',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, JCB',
    },
    {
      id: 'cash',
      name: 'Tiền mặt',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Thanh toán khi lên xe',
    },
  ];

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Save to localStorage
      const orderId = `VX${Date.now()}`;
      const order = {
        orderId,
        trip,
        seats,
        customerInfo,
        totalPrice,
        paymentMethod,
        status: paymentMethod === 'cash' ? 'pending' : 'confirmed',
        bookingDate: new Date().toISOString(),
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      setIsProcessing(false);
      
      // Navigate to success page
      navigate('/orders', { 
        state: { 
          newOrder: order,
          showSuccess: true 
        } 
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      <h1 className="text-3xl mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl mb-4">Phương thức thanh toán</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${
                      paymentMethod === method.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`
                      p-3 rounded-lg
                      ${paymentMethod === method.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}
                    `}
                    >
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3>{method.name}</h3>
                        {paymentMethod === method.id && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Customer Info */}
          <Card className="p-6">
            <h2 className="text-xl mb-4">Thông tin khách hàng</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Họ tên</div>
                  <div>{customerInfo.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Số điện thoại</div>
                  <div>{customerInfo.phone}</div>
                </div>
              </div>
              {customerInfo.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div>{customerInfo.email}</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl mb-4">Chi tiết đặt vé</h2>
            
            <div className="space-y-4">
              {/* Trip Info */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg">
                <h3 className="mb-2">{trip.company}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{trip.departureTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{trip.from} → {trip.to}</span>
                  </div>
                </div>
              </div>

              {/* Seats */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Ghế đã chọn</span>
                  <span className="text-sm">{seats.length} ghế</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {seats.map((seat: any) => (
                    <Badge key={seat.id} variant="secondary">
                      {seat.number}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Pickup/Dropoff */}
              {customerInfo.pickupPoint && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Điểm đón</div>
                  <div className="text-sm">{customerInfo.pickupPoint}</div>
                </div>
              )}
              {customerInfo.dropoffPoint && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Điểm trả</div>
                  <div className="text-sm">{customerInfo.dropoffPoint}</div>
                </div>
              )}

              {/* Pricing */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giá vé ({seats.length} x {trip.price.toLocaleString('vi-VN')}đ)</span>
                  <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí dịch vụ</span>
                  <span>0đ</span>
                </div>
                <div className="flex justify-between items-center text-lg pt-2 border-t border-gray-200">
                  <span>Tổng cộng</span>
                  <span className="text-2xl text-orange-500">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white py-6"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Xác nhận thanh toán
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                Bằng việc nhấn "Xác nhận thanh toán", bạn đồng ý với{' '}
                <span className="text-blue-600 cursor-pointer">Điều khoản sử dụng</span> và{' '}
                <span className="text-blue-600 cursor-pointer">Chính sách bảo mật</span> của chúng tôi
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

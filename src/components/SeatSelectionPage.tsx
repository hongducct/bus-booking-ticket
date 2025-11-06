import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ArrowLeft, Clock, MapPin, Phone, Mail, User, AlertCircle } from 'lucide-react';

interface Seat {
  id: string;
  row: number;
  number: string;
  floor: 1 | 2;
  status: 'available' | 'booked' | 'holding' | 'selected';
}

export function SeatSelectionPage() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  
  const [seats, setSeats] = useState<Seat[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    phone: '',
    name: '',
    email: '',
    pickupPoint: '',
    dropoffPoint: '',
  });
  const [holdingTimer, setHoldingTimer] = useState<number | null>(null);

  const trip = {
    id: tripId,
    company: 'BX Nam Nghĩa - Quảng Bình',
    from: 'Hồ Chí Minh',
    to: 'Đà Lạt',
    departureTime: '08:00 - 14:40',
    date: 'Thứ năm, 6 giờ đi phục',
    price: 320000,
  };

  useEffect(() => {
    // Initialize seats
    const initialSeats: Seat[] = [];
    
    // Floor 1 - 6 rows
    const floor1Layout = [
      ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'],
      ['D1', 'D2', 'D3', 'D4', 'D5'],
    ];
    
    floor1Layout.forEach((row, rowIndex) => {
      row.forEach((seatNum, colIndex) => {
        const randomStatus = Math.random();
        let status: 'available' | 'booked' | 'holding' = 'available';
        
        if (randomStatus < 0.15) status = 'booked';
        else if (randomStatus < 0.25) status = 'holding';
        
        initialSeats.push({
          id: `floor1-${seatNum}`,
          row: rowIndex,
          number: seatNum,
          floor: 1,
          status,
        });
      });
    });

    // Floor 2 - 6 rows
    const floor2Layout = [
      ['F1', 'F2', 'F3', 'F4', 'F5'],
      ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
      ['C1', 'C2', 'C3', 'C4', 'C5'],
      ['E1', 'E2', 'E3', 'E4', 'E5'],
    ];
    
    floor2Layout.forEach((row, rowIndex) => {
      row.forEach((seatNum, colIndex) => {
        const randomStatus = Math.random();
        let status: 'available' | 'booked' | 'holding' = 'available';
        
        if (randomStatus < 0.15) status = 'booked';
        else if (randomStatus < 0.25) status = 'holding';
        
        initialSeats.push({
          id: `floor2-${seatNum}`,
          row: rowIndex,
          number: seatNum,
          floor: 2,
          status,
        });
      });
    });

    setSeats(initialSeats);

    // Simulate holding timer
    const interval = setInterval(() => {
      setHoldingTimer((prev) => {
        if (prev === null) return 15 * 60; // 15 minutes in seconds
        if (prev <= 1) {
          // Release holding seats
          setSeats((prevSeats) =>
            prevSeats.map((seat) =>
              seat.status === 'holding' ? { ...seat, status: 'available' } : seat
            )
          );
          return 15 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSeatClick = (seatId: string) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => {
        if (seat.id === seatId) {
          if (seat.status === 'available') {
            return { ...seat, status: 'selected' };
          } else if (seat.status === 'selected') {
            return { ...seat, status: 'available' };
          }
        }
        return seat;
      })
    );
  };

  const getSeatColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300 cursor-pointer';
      case 'booked':
        return 'bg-red-100 text-red-400 border-red-200 cursor-not-allowed opacity-60';
      case 'holding':
        return 'bg-yellow-100 text-yellow-600 border-yellow-300 cursor-not-allowed';
      case 'selected':
        return 'bg-green-500 text-white border-green-600 cursor-pointer shadow-lg scale-105';
      default:
        return 'bg-gray-100';
    }
  };

  const selectedSeats = seats.filter((seat) => seat.status === 'selected');
  const totalPrice = selectedSeats.length * trip.price;

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất một chỗ');
      return;
    }
    if (!customerInfo.phone || !customerInfo.name) {
      alert('Vui lòng điền đầy đủ thông tin liên hệ');
      return;
    }

    // Navigate to checkout
    navigate('/checkout', {
      state: {
        trip,
        seats: selectedSeats,
        customerInfo,
        totalPrice,
      },
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const floor1Seats = seats.filter((seat) => seat.floor === 1);
  const floor2Seats = seats.filter((seat) => seat.floor === 2);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seat Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Info Card */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-orange-50 border-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl mb-2">{trip.company}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{trip.departureTime}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{trip.from} → {trip.to}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1">{trip.date}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl text-orange-500">{trip.price.toLocaleString('vi-VN')}đ</div>
                <div className="text-sm text-gray-500">/ khách</div>
              </div>
            </div>

            {holdingTimer !== null && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Các ghế màu vàng đang được giữ và sẽ được giải phóng sau: <span className="font-semibold">{formatTime(holdingTimer)}</span>
                </span>
              </div>
            )}
          </Card>

          {/* Seat Map */}
          <Card className="p-6">
            <h3 className="text-xl mb-6">Chọn chỗ</h3>

            {/* Floor 1 */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Tầng 1</div>
              </div>
              
              <div className="grid grid-cols-6 gap-3 max-w-md">
                {floor1Seats
                  .filter(seat => seat.number.startsWith('B'))
                  .sort((a, b) => {
                    const numA = parseInt(a.number.substring(1));
                    const numB = parseInt(b.number.substring(1));
                    return numA - numB;
                  })
                  .map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat.id)}
                      disabled={seat.status === 'booked' || seat.status === 'holding'}
                      className={`
                        aspect-square rounded-lg border-2 transition-all text-sm
                        ${getSeatColor(seat.status)}
                      `}
                    >
                      {seat.number}
                    </button>
                  ))}
              </div>

              <div className="grid grid-cols-5 gap-3 max-w-md mt-3">
                {floor1Seats
                  .filter(seat => seat.number.startsWith('D'))
                  .sort((a, b) => {
                    const numA = parseInt(a.number.substring(1));
                    const numB = parseInt(b.number.substring(1));
                    return numA - numB;
                  })
                  .map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat.id)}
                      disabled={seat.status === 'booked' || seat.status === 'holding'}
                      className={`
                        aspect-square rounded-lg border-2 transition-all text-sm
                        ${getSeatColor(seat.status)}
                      `}
                    >
                      {seat.number}
                    </button>
                  ))}
              </div>
            </div>

            {/* Floor 2 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">Tầng 2</div>
              </div>
              
              <div className="space-y-3 max-w-md">
                <div className="grid grid-cols-5 gap-3">
                  {floor2Seats
                    .filter(seat => seat.number.startsWith('F'))
                    .sort((a, b) => {
                      const numA = parseInt(a.number.substring(1));
                      const numB = parseInt(b.number.substring(1));
                      return numA - numB;
                    })
                    .map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={seat.status === 'booked' || seat.status === 'holding'}
                        className={`
                          aspect-square rounded-lg border-2 transition-all text-sm
                          ${getSeatColor(seat.status)}
                        `}
                      >
                        {seat.number}
                      </button>
                    ))}
                </div>

                <div className="grid grid-cols-6 gap-3">
                  {floor2Seats
                    .filter(seat => seat.number.startsWith('A'))
                    .sort((a, b) => {
                      const numA = parseInt(a.number.substring(1));
                      const numB = parseInt(b.number.substring(1));
                      return numA - numB;
                    })
                    .map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={seat.status === 'booked' || seat.status === 'holding'}
                        className={`
                          aspect-square rounded-lg border-2 transition-all text-sm
                          ${getSeatColor(seat.status)}
                        `}
                      >
                        {seat.number}
                      </button>
                    ))}
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {floor2Seats
                    .filter(seat => seat.number.startsWith('C'))
                    .sort((a, b) => {
                      const numA = parseInt(a.number.substring(1));
                      const numB = parseInt(b.number.substring(1));
                      return numA - numB;
                    })
                    .map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={seat.status === 'booked' || seat.status === 'holding'}
                        className={`
                          aspect-square rounded-lg border-2 transition-all text-sm
                          ${getSeatColor(seat.status)}
                        `}
                      >
                        {seat.number}
                      </button>
                    ))}
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {floor2Seats
                    .filter(seat => seat.number.startsWith('E'))
                    .sort((a, b) => {
                      const numA = parseInt(a.number.substring(1));
                      const numB = parseInt(b.number.substring(1));
                      return numA - numB;
                    })
                    .map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={seat.status === 'booked' || seat.status === 'holding'}
                        className={`
                          aspect-square rounded-lg border-2 transition-all text-sm
                          ${getSeatColor(seat.status)}
                        `}
                      >
                        {seat.number}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 border-2 border-blue-300" />
                <span className="text-gray-600">Trống</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 border-2 border-yellow-300" />
                <span className="text-gray-600">Đặt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 border-2 border-red-200 opacity-60" />
                <span className="text-gray-600">Đặt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500 border-2 border-green-600" />
                <span className="text-gray-600">Tạm</span>
              </div>
            </div>
          </Card>

          {/* Reference Image - Removed as it's not needed */}
        </div>

        {/* Customer Info & Summary */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="p-6 sticky top-24">
            <h3 className="text-xl mb-4">Thông tin khách hàng</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Số điện thoại *
                </label>
                <Input
                  type="tel"
                  placeholder="Số điện thoại"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Họ tên *
                </label>
                <Input
                  type="text"
                  placeholder="Họ tên"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <h4 className="mb-4">Địa điểm</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Điểm đi
                  </label>
                  <select
                    value={customerInfo.pickupPoint}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, pickupPoint: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn điểm đón</option>
                    <option>Bến xe Miền Đông</option>
                    <option>Bến xe Miền Tây</option>
                    <option>Văn phòng công ty</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    Điểm đến
                  </label>
                  <select
                    value={customerInfo.dropoffPoint}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, dropoffPoint: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn điểm trả</option>
                    <option>Bến xe Đà Lạt</option>
                    <option>Trung tâm thành phố</option>
                    <option>Khách sạn</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ghế đã chọn</span>
                  <span className="text-sm text-gray-500">
                    {selectedSeats.length > 0 ? selectedSeats.map(s => s.number).join(', ') : 'Chưa chọn'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số lượng</span>
                  <span>{selectedSeats.length} ghế</span>
                </div>
                <div className="flex justify-between items-center text-lg pt-3 border-t border-gray-200">
                  <span>Tổng tiền</span>
                  <span className="text-2xl text-orange-500">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                onClick={handleContinue}
                disabled={selectedSeats.length === 0 || !customerInfo.phone || !customerInfo.name}
                className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white py-6"
              >
                Tiếp tục
              </Button>
              
              <p className="text-xs text-center text-gray-500">
                Đã đọc, giải đáp thắc mắc về <span className="text-red-500 cursor-pointer">điều khoản sử dụng</span> và đồng ý với các <span className="text-red-500 cursor-pointer">chính sách</span> của Vận Minh, góp khoách với tổng liên hệ <span className="text-blue-600">1900 6467</span>
              </p>
              <p className="text-xs text-center text-gray-500">
                <span className="text-red-500 cursor-pointer">Lưu ý:</span> Mọi liên hệ về vận chuyển, quý khoách thắng cần. Mong quý khách thông cảm!
              </p>
            </div>

            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-center text-gray-700">
                Thanh toán
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, MapPin, Calendar, Users, CheckCircle, Clock, Package } from 'lucide-react';
import { searchBooking } from '../utils/api';

export function TrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await searchBooking(searchQuery);
      setSearchResult(result);
    } catch (error: any) {
      console.error('Error searching booking:', error);
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const configs: {
      [key: string]: { label: string; color: string; icon: any; description: string };
    } = {
      pending: {
        label: 'Chờ xác nhận',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: <Clock className="w-6 h-6" />,
        description: 'Đơn hàng đang chờ được xác nhận từ nhà xe',
      },
      confirmed: {
        label: 'Đã xác nhận',
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: <CheckCircle className="w-6 h-6" />,
        description: 'Đơn hàng đã được xác nhận. Vui lòng có mặt trước giờ khởi hành 15 phút',
      },
      completed: {
        label: 'Hoàn thành',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: <CheckCircle className="w-6 h-6" />,
        description: 'Chuyến đi đã hoàn thành',
      },
      cancelled: {
        label: 'Đã hủy',
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: <Package className="w-6 h-6" />,
        description: 'Đơn hàng đã bị hủy',
      },
    };
    return configs[status] || configs.pending;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Tra cứu vé</h1>
          <p className="text-gray-600">
            Nhập mã đơn hàng, số điện thoại hoặc email để tra cứu thông tin vé
          </p>
        </div>

        {/* Search Form */}
        <Card className="p-6 mb-8">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Nhập mã đơn hàng, số điện thoại hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-12"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!searchQuery || isSearching}
              className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 px-8"
            >
              {isSearching ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Tra cứu
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Search Result */}
        {searchResult ? (
          <Card className="p-6">
            <div className="space-y-6">
              {/* Status */}
              <div className={`p-6 rounded-xl border-2 ${getStatusInfo(searchResult.status).color}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{getStatusInfo(searchResult.status).icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl mb-1">{getStatusInfo(searchResult.status).label}</h3>
                    <p className="text-sm opacity-80">
                      {getStatusInfo(searchResult.status).description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h3 className="text-xl mb-4">Thông tin đơn hàng</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Mã đơn hàng</span>
                    <span className="text-blue-600">{searchResult.orderId || searchResult.id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Ngày đặt</span>
                    <span>
                      {searchResult.bookingDate 
                        ? new Date(searchResult.bookingDate).toLocaleString('vi-VN')
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Tổng tiền</span>
                    <span className="text-orange-500 text-xl">
                      {(searchResult.totalPrice || 0).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              {searchResult.trip && (
                <div>
                  <h3 className="text-xl mb-4">Thông tin chuyến đi</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg">
                      <div className="text-gray-600 text-sm mb-2">Nhà xe</div>
                      <div className="text-lg">{searchResult.trip.company || 'Nhà xe'}</div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-orange-500 mt-1" />
                      <div className="flex-1">
                        <div className="text-gray-600 text-sm mb-1">Tuyến đường</div>
                        <div>
                          {searchResult.trip.from || ''} → {searchResult.trip.to || ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <div className="text-gray-600 text-sm mb-1">Thời gian</div>
                        <div>{searchResult.trip.departureTime || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-orange-500 mt-1" />
                      <div className="flex-1">
                        <div className="text-gray-600 text-sm mb-1">Ghế đã đặt</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {searchResult.seats && searchResult.seats.length > 0 ? (
                            searchResult.seats.map((seat: any) => (
                              <Badge key={seat.id || seat.number} variant="secondary">
                                {seat.number || seat.seatNumber || 'N/A'}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">Chưa có thông tin ghế</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Info */}
              {searchResult.customerInfo && (
                <div>
                  <h3 className="text-xl mb-4">Thông tin khách hàng</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Họ tên</span>
                      <span>{searchResult.customerInfo.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Số điện thoại</span>
                      <span>{searchResult.customerInfo.phone || 'N/A'}</span>
                    </div>
                    {searchResult.customerInfo.email && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Email</span>
                        <span>{searchResult.customerInfo.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500">
                  In vé
                </Button>
                <Button variant="outline" className="flex-1">
                  Liên hệ hỗ trợ
                </Button>
              </div>
            </div>
          </Card>
        ) : searchQuery && !isSearching ? (
          <Card className="p-12 text-center">
            <div className="text-gray-400">
              <Search className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl mb-2">Không tìm thấy kết quả</p>
              <p className="text-sm">
                Vui lòng kiểm tra lại mã đơn hàng, số điện thoại hoặc email
              </p>
            </div>
          </Card>
        ) : null}

        {/* Help Section */}
        {!searchResult && (
          <Card className="p-6 mt-8 bg-gradient-to-r from-blue-50 to-orange-50 border-0">
            <h3 className="mb-4">Cần hỗ trợ?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Nếu bạn gặp vấn đề khi tra cứu vé, vui lòng liên hệ với chúng tôi:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Hotline:</span>
                <span className="text-blue-600">1900 6467</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Email:</span>
                <span className="text-blue-600">support@hongducct.id.vn</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Giờ làm việc:</span>
                <span>24/7</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

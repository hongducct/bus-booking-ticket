import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { 
  MapPin, 
  Clock, 
  Star, 
  Users, 
  ArrowRight, 
  SlidersHorizontal,
  Bed,
  Armchair,
  X,
  Loader2
} from 'lucide-react';
import { searchTrips } from '../utils/api';
import { toast } from 'sonner';

interface Trip {
  id: string;
  company: string;
  companyRating: number;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  busType: 'seat' | 'sleeper' | 'limousine';
  availableSeats: number;
  totalSeats: number;
  amenities: string[];
}

export function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [priceRange, setPriceRange] = useState([200000, 300000]);
  const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'time' | 'rating'>('time');

  const from = searchParams.get('from') || 'Hồ Chí Minh';
  const to = searchParams.get('to') || 'Đà Lạt';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  // Load trips from API
  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true);
      try {
        const results = await searchTrips({
          from,
          to,
          date,
          passengers: parseInt(searchParams.get('passengers') || '1'),
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          busType: selectedBusTypes.length === 1 ? selectedBusTypes[0] : undefined,
          timeSlot: selectedTimeSlots.length === 1 ? selectedTimeSlots[0] : undefined,
          sortBy,
        });
        setTrips(results);
        setFilteredTrips(results);
      } catch (error: any) {
        console.error('Error loading trips:', error);
        toast.error(error.message || 'Không thể tải danh sách chuyến xe');
        setTrips([]);
        setFilteredTrips([]);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, [from, to, date, searchParams]);

  // Apply filters when filters change
  useEffect(() => {
    if (trips.length === 0) return;
    
    const loadFilteredTrips = async () => {
      try {
        const results = await searchTrips({
          from,
          to,
          date,
          passengers: parseInt(searchParams.get('passengers') || '1'),
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          busType: selectedBusTypes.length === 1 ? selectedBusTypes[0] : undefined,
          timeSlot: selectedTimeSlots.length === 1 ? selectedTimeSlots[0] : undefined,
          sortBy,
        });
        setFilteredTrips(results);
      } catch (error: any) {
        console.error('Error filtering trips:', error);
      }
    };
    loadFilteredTrips();
  }, [priceRange, selectedBusTypes, selectedTimeSlots, sortBy, from, to, date, searchParams]);


  const toggleBusType = (type: string) => {
    setSelectedBusTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleTimeSlot = (slot: string) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const getBusTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      seat: 'Ghế ngồi',
      sleeper: 'Giường nằm',
      limousine: 'Limousine',
    };
    return labels[type] || type;
  };

  const getBusTypeIcon = (type: string) => {
    if (type === 'sleeper' || type === 'limousine') return <Bed className="w-4 h-4" />;
    return <Armchair className="w-4 h-4" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span>{from}</span>
          <ArrowRight className="w-4 h-4" />
          <MapPin className="w-5 h-5 text-orange-500" />
          <span>{to}</span>
          <span className="ml-4 text-gray-400">•</span>
          <Clock className="w-4 h-4 ml-4" />
          <span>{new Date(date).toLocaleDateString('vi-VN')}</span>
        </div>
        <h1 className="text-3xl">
          Tìm thấy <span className="text-blue-600">{filteredTrips.length}</span> chuyến xe
        </h1>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar - Desktop */}
        <Card className="hidden lg:block w-80 h-fit p-6 space-y-6 sticky top-24">
          <div className="flex items-center justify-between">
            <h2 className="text-xl">Bộ lọc</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPriceRange([200000, 300000]);
                setSelectedBusTypes([]);
                setSelectedTimeSlots([]);
              }}
            >
              Xóa tất cả
            </Button>
          </div>

          {/* Sort */}
          <div className="space-y-3">
            <h3>Sắp xếp theo</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="time">Giờ đi sớm nhất</option>
              <option value="price">Giá thấp nhất</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h3>Khoảng giá</h3>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={200000}
              max={300000}
              step={10000}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{priceRange[0].toLocaleString('vi-VN')}đ</span>
              <span>{priceRange[1].toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* Bus Type */}
          <div className="space-y-3">
            <h3>Loại xe</h3>
            {['seat', 'sleeper', 'limousine'].map((type) => (
              <div key={type} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedBusTypes.includes(type)}
                  onCheckedChange={() => toggleBusType(type)}
                />
                <label className="text-sm cursor-pointer" onClick={() => toggleBusType(type)}>
                  {getBusTypeLabel(type)}
                </label>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="space-y-3">
            <h3>Khung giờ</h3>
            {[
              { value: 'morning', label: 'Sáng (6h - 12h)' },
              { value: 'afternoon', label: 'Chiều (12h - 18h)' },
              { value: 'evening', label: 'Tối (18h - 6h)' },
            ].map((slot) => (
              <div key={slot.value} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedTimeSlots.includes(slot.value)}
                  onCheckedChange={() => toggleTimeSlot(slot.value)}
                />
                <label className="text-sm cursor-pointer" onClick={() => toggleTimeSlot(slot.value)}>
                  {slot.label}
                </label>
              </div>
            ))}
          </div>
        </Card>

        {/* Filters Button - Mobile */}
        <Button
          onClick={() => setShowFilters(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 rounded-full shadow-2xl w-14 h-14 p-0"
        >
          <SlidersHorizontal className="w-6 h-6" />
        </Button>

        {/* Mobile Filter Modal */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
            <div
              className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl">Bộ lọc</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Same filters as desktop */}
                <div className="space-y-3">
                  <h3>Sắp xếp theo</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="time">Giờ đi sớm nhất</option>
                    <option value="price">Giá thấp nhất</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <h3>Khoảng giá</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={200000}
                    max={300000}
                    step={10000}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0].toLocaleString('vi-VN')}đ</span>
                    <span>{priceRange[1].toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3>Loại xe</h3>
                  {['seat', 'sleeper', 'limousine'].map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedBusTypes.includes(type)}
                        onCheckedChange={() => toggleBusType(type)}
                      />
                      <label className="text-sm" onClick={() => toggleBusType(type)}>
                        {getBusTypeLabel(type)}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3>Khung giờ</h3>
                  {[
                    { value: 'morning', label: 'Sáng (6h - 12h)' },
                    { value: 'afternoon', label: 'Chiều (12h - 18h)' },
                    { value: 'evening', label: 'Tối (18h - 6h)' },
                  ].map((slot) => (
                    <div key={slot.value} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedTimeSlots.includes(slot.value)}
                        onCheckedChange={() => toggleTimeSlot(slot.value)}
                      />
                      <label className="text-sm" onClick={() => toggleTimeSlot(slot.value)}>
                        {slot.label}
                      </label>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full"
                  onClick={() => setShowFilters(false)}
                >
                  Áp dụng
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Trip List */}
        <div className="flex-1 space-y-4">
          {loading && (
            <Card className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Đang tải danh sách chuyến xe...</p>
            </Card>
          )}
          {!loading && filteredTrips.map((trip) => (
            <Card key={trip.id} className="p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Trip Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl mb-1">{trip.company}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{trip.companyRating}</span>
                        <span className="mx-2">•</span>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {getBusTypeIcon(trip.busType)}
                          {getBusTypeLabel(trip.busType)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl mb-1">{trip.departureTime}</div>
                      <div className="text-sm text-gray-600">{trip.from}</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-sm text-gray-500 mb-1">{trip.duration}</div>
                      <div className="w-full h-px bg-gradient-to-r from-blue-600 to-orange-500 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-1">{trip.arrivalTime}</div>
                      <div className="text-sm text-gray-600">{trip.to}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {trip.amenities.map((amenity, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      Còn <span className="text-green-600">{trip.availableSeats}</span> / {trip.totalSeats} chỗ
                    </span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="lg:w-48 flex lg:flex-col items-end lg:items-stretch justify-between lg:justify-start gap-4">
                  <div className="lg:text-right">
                    <div className="text-3xl text-orange-500 mb-1">
                      {trip.price.toLocaleString('vi-VN')}đ
                    </div>
                    <div className="text-sm text-gray-500">/ khách</div>
                  </div>
                  <Button
                    onClick={() => navigate(`/seat-selection/${trip.id}`)}
                    className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 whitespace-nowrap"
                  >
                    Chọn chỗ
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {!loading && filteredTrips.length === 0 && (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <MapPin className="w-16 h-16 mx-auto mb-4" />
                <p className="text-xl">Không tìm thấy chuyến xe phù hợp</p>
                <p className="text-sm mt-2">Vui lòng thử điều chỉnh bộ lọc của bạn</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

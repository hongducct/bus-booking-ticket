import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Search, Star, Shield, Clock, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getPopularRoutes, getStations } from '../utils/api';

interface Station {
  id: string;
  name: string;
  city: string;
  address: string;
}

export function HomePage() {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    from: 'Hà Nội',
    to: 'Hà Tĩnh',
    date: new Date().toISOString().split('T')[0],
    passengers: 1,
  });

  const [stations, setStations] = useState<Station[]>([]);
  const [popularRoutes, setPopularRoutes] = useState([
    { from: 'Hà Nội', to: 'Hà Tĩnh', price: '250,000đ', image: 'dalat nature' },
    { from: 'Hà Nội', to: 'Sapa', price: '320,000đ', image: 'sapa mountain' },
    { from: 'Hà Tĩnh', to: 'Hà Nội', price: '280,000đ', image: 'nha trang beach' },
    { from: 'Hà Nội', to: 'Hà Tĩnh', price: '150,000đ', image: 'haiphong city' },
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load stations
        const stationsData = await getStations();
        if (stationsData && stationsData.length > 0) {
          // Remove duplicates by name
          const uniqueStations = stationsData.reduce((acc: Station[], station: Station) => {
            if (!acc.find(s => s.name === station.name)) {
              acc.push(station);
            }
            return acc;
          }, []);
          setStations(uniqueStations);
          
          // Set default values if available
          if (uniqueStations.length > 0) {
            const hn = uniqueStations.find(s => s.name === 'Hà Nội');
            const htn = uniqueStations.find(s => s.name === 'Hà Tĩnh');
            if (hn && htn) {
              setSearchForm(prev => ({
                ...prev,
                from: hn.name,
                to: htn.name,
              }));
            }
          }
        }

        // Load popular routes
        const routes = await getPopularRoutes();
        if (routes && routes.length > 0) {
          setPopularRoutes(routes.map((r: any) => ({
            from: r.from,
            to: r.to,
            price: r.price,
            image: `${r.from.toLowerCase()} ${r.to.toLowerCase()}`,
          })));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: 'An toàn & Bảo mật',
      description: 'Thanh toán được mã hóa và bảo vệ tuyệt đối',
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-500" />,
      title: 'Đặt vé nhanh chóng',
      description: 'Chỉ 3 bước đơn giản để hoàn tất đặt vé',
    },
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      title: 'Giá tốt nhất',
      description: 'Cam kết giá vé cạnh tranh nhất thị trường',
    },
    {
      icon: <Star className="w-8 h-8 text-orange-500" />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?from=${searchForm.from}&to=${searchForm.to}&date=${searchForm.date}&passengers=${searchForm.passengers}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-orange-500/10 -z-10" />
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              MaiLinh Transit
            </h1>
            <p className="text-xl text-gray-600">
              Hành trình an toàn, tiện nghi - Đồng hành cùng bạn trên mọi nẻo đường
            </p>
          </div>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto p-6 md:p-8 shadow-2xl border-0">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* From */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Điểm đi
                  </label>
                  <select
                    value={searchForm.from}
                    onChange={(e) => setSearchForm({ ...searchForm, from: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {stations.map((station) => (
                      <option key={station.id} value={station.name}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* To */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    Điểm đến
                  </label>
                  <select
                    value={searchForm.to}
                    onChange={(e) => setSearchForm({ ...searchForm, to: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {stations.map((station) => (
                      <option key={station.id} value={station.name}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Ngày đi
                  </label>
                  <input
                    type="date"
                    value={searchForm.date}
                    onChange={(e) => setSearchForm({ ...searchForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Passengers */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4 text-orange-500" />
                    Số hành khách
                  </label>
                  <select
                    value={searchForm.passengers}
                    onChange={(e) => setSearchForm({ ...searchForm, passengers: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} người
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Search className="w-5 h-5 mr-2" />
                Tìm chuyến xe
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">Tại sao chọn MaiLinh Transit?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-shadow border-0">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">Tuyến đường phổ biến</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map((route, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-2xl transition-all cursor-pointer group border-0"
                onClick={() => navigate(`/search?from=${route.from}&to=${route.to}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={`https://source.unsplash.com/800x600/?${route.image}`}
                    alt={`${route.from} to ${route.to}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{route.from}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{route.to}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Từ</span>
                    <span className="text-xl text-orange-500">{route.price}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl mb-2">50+</div>
              <div className="text-blue-100">Tuyến đường</div>
            </div>
            <div>
              <div className="text-5xl mb-2">200+</div>
              <div className="text-blue-100">Chuyến xe/ngày</div>
            </div>
            <div>
              <div className="text-5xl mb-2">500K+</div>
              <div className="text-blue-100">Khách hàng</div>
            </div>
            <div>
              <div className="text-5xl mb-2">4.8★</div>
              <div className="text-blue-100">Đánh giá</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

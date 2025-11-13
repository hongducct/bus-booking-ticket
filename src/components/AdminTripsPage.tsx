import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getStations, getPopularRoutes, createTrip, createTripsBatch } from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function AdminTripsPage() {
  const { isAdmin } = useAuth();
  const [stations, setStations] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyId: '',
    fromStationId: '',
    toStationId: '',
    date: new Date().toISOString().split('T')[0],
    departureTime: '08:00',
    arrivalTime: '14:00',
    duration: 360,
    price: 200000,
    busType: 'seat',
    totalSeats: 40,
    amenities: [] as string[],
  });
  const [batchFormData, setBatchFormData] = useState({
    companyId: '',
    fromStationId: '',
    toStationId: '',
    startDate: new Date().toISOString().split('T')[0],
    days: 30,
    departureTime: '08:00',
    arrivalTime: '14:00',
    duration: 360,
    price: 200000,
    busType: 'seat',
    totalSeats: 40,
    amenities: [] as string[],
  });

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      const stationsData = await getStations();
      setStations(stationsData);
      
      // Get companies from popular routes (temporary solution)
      const routes = await getPopularRoutes();
      // You might need to add a getCompanies API endpoint
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createTrip(formData);
      toast.success('Tạo chuyến xe thành công');
      // Reset form
      setFormData({
        ...formData,
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error: any) {
      toast.error(error.message || 'Không thể tạo chuyến xe');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await createTripsBatch(batchFormData);
      toast.success(`Tạo thành công ${result.success} chuyến xe${result.failed > 0 ? `, ${result.failed} chuyến thất bại` : ''}`);
      // Reset form
      setBatchFormData({
        ...batchFormData,
        startDate: new Date().toISOString().split('T')[0],
      });
    } catch (error: any) {
      toast.error(error.message || 'Không thể tạo chuyến xe');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Quản lý chuyến xe</h1>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Tạo chuyến đơn lẻ</TabsTrigger>
          <TabsTrigger value="batch">Tạo nhiều chuyến (30 ngày)</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle>Tạo chuyến xe mới</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTrip} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nhà xe (Company ID)</Label>
                    <Input
                      value={formData.companyId}
                      onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                      placeholder="Nhập ID nhà xe"
                      required
                    />
                  </div>
                  <div>
                    <Label>Điểm đi</Label>
                    <Select
                      value={formData.fromStationId}
                      onValueChange={(value) => setFormData({ ...formData, fromStationId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn điểm đi" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station.id} value={station.id}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Điểm đến</Label>
                    <Select
                      value={formData.toStationId}
                      onValueChange={(value) => setFormData({ ...formData, toStationId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn điểm đến" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station.id} value={station.id}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Ngày</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Giờ khởi hành</Label>
                    <Input
                      type="time"
                      value={formData.departureTime}
                      onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Giờ đến</Label>
                    <Input
                      type="time"
                      value={formData.arrivalTime}
                      onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Thời gian (phút)</Label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Giá vé (VND)</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Loại xe</Label>
                    <Select
                      value={formData.busType}
                      onValueChange={(value) => setFormData({ ...formData, busType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seat">Ghế ngồi</SelectItem>
                        <SelectItem value="sleeper">Giường nằm</SelectItem>
                        <SelectItem value="limousine">Limousine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Số ghế</Label>
                    <Input
                      type="number"
                      value={formData.totalSeats}
                      onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang tạo...' : 'Tạo chuyến xe'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch">
          <Card>
            <CardHeader>
              <CardTitle>Tạo nhiều chuyến xe (30 ngày)</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBatch} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nhà xe (Company ID)</Label>
                    <Input
                      value={batchFormData.companyId}
                      onChange={(e) => setBatchFormData({ ...batchFormData, companyId: e.target.value })}
                      placeholder="Nhập ID nhà xe"
                      required
                    />
                  </div>
                  <div>
                    <Label>Điểm đi</Label>
                    <Select
                      value={batchFormData.fromStationId}
                      onValueChange={(value) => setBatchFormData({ ...batchFormData, fromStationId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn điểm đi" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station.id} value={station.id}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Điểm đến</Label>
                    <Select
                      value={batchFormData.toStationId}
                      onValueChange={(value) => setBatchFormData({ ...batchFormData, toStationId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn điểm đến" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station.id} value={station.id}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Ngày bắt đầu</Label>
                    <Input
                      type="date"
                      value={batchFormData.startDate}
                      onChange={(e) => setBatchFormData({ ...batchFormData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Số ngày</Label>
                    <Input
                      type="number"
                      value={batchFormData.days}
                      onChange={(e) => setBatchFormData({ ...batchFormData, days: parseInt(e.target.value) })}
                      min={1}
                      required
                    />
                  </div>
                  <div>
                    <Label>Giờ khởi hành</Label>
                    <Input
                      type="time"
                      value={batchFormData.departureTime}
                      onChange={(e) => setBatchFormData({ ...batchFormData, departureTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Giờ đến</Label>
                    <Input
                      type="time"
                      value={batchFormData.arrivalTime}
                      onChange={(e) => setBatchFormData({ ...batchFormData, arrivalTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Thời gian (phút)</Label>
                    <Input
                      type="number"
                      value={batchFormData.duration}
                      onChange={(e) => setBatchFormData({ ...batchFormData, duration: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Giá vé (VND)</Label>
                    <Input
                      type="number"
                      value={batchFormData.price}
                      onChange={(e) => setBatchFormData({ ...batchFormData, price: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Loại xe</Label>
                    <Select
                      value={batchFormData.busType}
                      onValueChange={(value) => setBatchFormData({ ...batchFormData, busType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seat">Ghế ngồi</SelectItem>
                        <SelectItem value="sleeper">Giường nằm</SelectItem>
                        <SelectItem value="limousine">Limousine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Số ghế</Label>
                    <Input
                      type="number"
                      value={batchFormData.totalSeats}
                      onChange={(e) => setBatchFormData({ ...batchFormData, totalSeats: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang tạo...' : `Tạo ${batchFormData.days} chuyến xe`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


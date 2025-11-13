import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { createAdmin } from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

export function AdminUsersPage() {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createAdmin(formData);
      toast.success('Tạo admin thành công');
      setFormData({
        email: '',
        password: '',
        name: '',
        phone: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Không thể tạo admin');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tạo tài khoản Admin</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Thông tin admin mới</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <Label>Mật khẩu *</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Tối thiểu 6 ký tự"
                minLength={6}
                required
              />
            </div>
            <div>
              <Label>Tên</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Tên admin"
              />
            </div>
            <div>
              <Label>Số điện thoại</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0123456789"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo admin'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

export default function AdminLogin({ onLogin }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (password === 'adsa1234') {
        const adminData = { name: 'Admin', isAdmin: true };
        localStorage.setItem('mydom_user', JSON.stringify(adminData));
        onLogin(adminData);
        toast.success('Admin panelinə xoş gəldiniz!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Yanlış şifrə');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="logo-text text-4xl font-semibold text-[#B91C1C]">
              My<span className="font-normal">dom</span>
            </span>
          </Link>
          <p className="text-gray-500 mt-2">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mx-auto mb-6">
            <Shield className="w-8 h-8 text-[#B91C1C]" />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Admin Girişi</h1>
          <p className="text-gray-500 text-center mb-6">
            Davam etmək üçün admin şifrəsini daxil edin
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrə"
                className="pr-10 h-12"
                data-testid="admin-password-input"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full h-12 bg-[#B91C1C] hover:bg-[#991B1B] text-white"
              data-testid="admin-login-btn"
            >
              {isLoading ? 'Yüklənir...' : 'Daxil ol'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-[#B91C1C]">
              <Home size={16} className="mr-2" />
              Ana səhifəyə qayıt
            </Link>
          </div>
        </div>

        {/* Demo Hint */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 text-center">
            <strong>Demo:</strong> Şifrə: <code className="px-1 py-0.5 bg-yellow-100 rounded">adsa1234</code>
          </p>
        </div>
      </div>
    </div>
  );
}

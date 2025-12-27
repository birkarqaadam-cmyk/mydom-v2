import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

export const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const navigate = useNavigate();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminLogin = () => {
    if (adminPassword === 'adsa1234') {
      const adminData = { name: 'Admin', isAdmin: true };
      localStorage.setItem('mydom_user', JSON.stringify(adminData));
      onLogin(adminData);
      toast.success('Admin panelinə xoş gəldiniz!');
      onClose();
      resetForm();
      navigate('/admin');
    } else {
      toast.error('Yanlış şifrə');
    }
  };

  const resetForm = () => {
    setAdminPassword('');
    setShowAdminPanel(false);
    setShowPassword(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); resetForm(); } }}>
      <DialogContent className="sm:max-w-md" data-testid="login-modal">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold logo-text">Admin Girişi</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-4 fade-in">
          <div className="p-4 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-600 mb-4">Admin girişi üçün şifrəni daxil edin:</p>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Admin şifrəsi"
                  className="pr-10"
                  data-testid="admin-password-input"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
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
                onClick={handleAdminLogin}
                className="w-full bg-[#B91C1C] hover:bg-[#991B1B] text-white"
                data-testid="admin-login-btn"
              >
                Admin girişi
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

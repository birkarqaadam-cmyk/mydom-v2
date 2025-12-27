import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

export const UserAuthModal = ({ isOpen, onClose, onLogin, users = [], onUpdateUsers }) => {
  // Ensure users is always an array
  const safeUsers = Array.isArray(users) ? users : [];
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form
  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const user = safeUsers.find(u => u.email === loginEmail && u.password === loginPassword);
    
    if (user) {
      onLogin(user);
      toast.success(`Xoş gəldiniz, ${user.name}!`);
      onClose();
      resetForm();
    } else {
      toast.error('Email və ya şifrə yanlışdır');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!regName || !regEmail || !regPassword) {
      toast.error('Bütün sahələri doldurun');
      return;
    }

    if (safeUsers.find(u => u.email === regEmail)) {
      toast.error('Bu email artıq qeydiyyatdadır');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: regName,
      surname: regSurname,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      createdAt: new Date().toISOString()
    };

    onUpdateUsers([...safeUsers, newUser]);
    onLogin(newUser);
    toast.success('Qeydiyyat uğurla tamamlandı!');
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setLoginEmail('');
    setLoginPassword('');
    setRegName('');
    setRegSurname('');
    setRegEmail('');
    setRegPhone('');
    setRegPassword('');
    setShowPassword(false);
    setActiveTab('login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); resetForm(); } }}>
      <DialogContent className="sm:max-w-md" data-testid="user-auth-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold logo-text text-center">
            İstifadəçi Hesabı
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Giriş</TabsTrigger>
            <TabsTrigger value="register">Qeydiyyat</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 pt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="pl-10"
                    data-testid="login-email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Şifrə</Label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    data-testid="login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#B91C1C] hover:bg-[#991B1B] relative z-10" data-testid="login-submit-btn">
                Daxil ol
              </Button>
            </form>
            <p className="text-xs text-center text-gray-500">
              Demo: ali@example.com / password123
            </p>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 pt-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Ad</Label>
                  <Input
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Adınız"
                    data-testid="reg-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Soyad</Label>
                  <Input
                    value={regSurname}
                    onChange={(e) => setRegSurname(e.target.value)}
                    placeholder="Soyadınız"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="email@example.com"
                  data-testid="reg-email"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+994 XX XXX XX XX"
                />
              </div>
              <div className="space-y-2">
                <Label>Şifrə</Label>
                <Input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Şifrənizi daxil edin"
                  data-testid="reg-password"
                />
              </div>
              <Button type="submit" className="w-full bg-[#B91C1C] hover:bg-[#991B1B]">
                Qeydiyyatdan keç
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

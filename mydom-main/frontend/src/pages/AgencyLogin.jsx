import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function AgencyLogin({ agencies, onAgencyLogin }) {
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const agency = agencies.find(a => a.accessCode === accessCode && a.isActive);

    setTimeout(() => {
      if (agency) {
        onAgencyLogin(agency);
        toast.success(`Xoş gəldiniz, ${agency.name}!`);
        navigate('/agency/dashboard');
      } else {
        toast.error('Yanlış giriş kodu və ya hesab aktiv deyil');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" data-testid="agency-login-page">
      <div className="w-full max-w-md">
        <Link to="/agencies" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#B91C1C] mb-8">
          <ArrowLeft size={18} />
          Agentliklərə qayıt
        </Link>

        <div className="bg-white rounded-2xl p-8 shadow-lg border">
          <div className="text-center mb-8">
            <h1 className="logo-text text-3xl font-bold text-[#B91C1C] mb-2">Mydom</h1>
            <p className="text-gray-500">Agent Girişi</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#B91C1C]/10 rounded-full flex items-center justify-center">
              <KeyRound size={32} className="text-[#B91C1C]" />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label>Giriş Kodu</Label>
              <Input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="RMX-2024"
                className="h-12 text-center text-lg tracking-widest"
                data-testid="access-code-input"
                maxLength={8}
              />
              <p className="text-xs text-gray-500 text-center">
                Admin tərəfindən verilən giriş kodunuzu daxil edin
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#B91C1C] hover:bg-[#991B1B] font-semibold"
              disabled={isLoading || accessCode.length < 7}
              data-testid="agency-login-submit"
            >
              {isLoading ? 'Yüklənir...' : 'Daxil ol'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t">
            <p className="text-xs text-gray-500 text-center mb-3">Demo giriş kodları:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {agencies.slice(0, 3).map(agency => (
                <button
                  key={agency.id}
                  onClick={() => setAccessCode(agency.accessCode)}
                  className="px-3 py-1 bg-gray-100 rounded text-xs text-gray-600 hover:bg-[#B91C1C] hover:text-white transition-colors"
                >
                  {agency.accessCode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

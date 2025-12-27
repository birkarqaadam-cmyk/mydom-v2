import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { LoginModal } from './LoginModal';
import { UserAuthModal } from './UserAuthModal';

export const Header = ({ user, onLogin, onLogout, users, onUpdateUsers }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userAuthModalOpen, setUserAuthModalOpen] = useState(false);

  const navItems = [
    { label: 'Alqı-satqı', href: '/?category=sale' },
    { label: 'Kirayə', href: '/?category=rent' },
    { label: 'Günlük', href: '/?category=daily' },
    { label: 'Agentliklər', href: '/agencies' },
    { label: 'Yaşayış kompleksləri', href: '/complexes' },
  ];

  return (
    <>
      <header 
        className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur"
        data-testid="main-header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center" data-testid="logo-link">
              <span className="logo-text text-3xl font-semibold text-[#B91C1C]">
                My<span className="font-normal">dom</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6" data-testid="desktop-nav">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-[#B91C1C] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {user && !user.isAdmin && (
                <Link to="/create-listing">
                  <Button className="hidden md:flex bg-[#B91C1C] hover:bg-[#991B1B] text-white btn-transition">
                    <Plus size={18} className="mr-2" />
                    İlan Yerləşdir
                  </Button>
                </Link>
              )}
              
              {user ? (
                <div className="hidden md:flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {user.isAdmin ? 'Admin' : user.name}
                  </span>
                  {user.isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm">Panel</Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    onClick={onLogout}
                    className="border-[#B91C1C] text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white"
                    data-testid="logout-btn"
                  >
                    Çıxış
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setUserAuthModalOpen(true)}
                    className="border-[#B91C1C] text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white btn-transition"
                    data-testid="login-btn"
                  >
                    Giriş / Qeydiyyat
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-btn"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t fade-in">
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block py-2 text-gray-700 hover:text-[#B91C1C]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t">
                {user ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Salam, {user.name}</p>
                    <Button
                      variant="outline"
                      onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                      className="w-full border-[#B91C1C] text-[#B91C1C]"
                    >
                      Çıxış
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => { setUserAuthModalOpen(true); setMobileMenuOpen(false); }}
                    className="w-full bg-[#B91C1C] hover:bg-[#991B1B] text-white"
                  >
                    Giriş / Qeydiyyat
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        onLogin={onLogin}
      />
      
      <UserAuthModal 
        isOpen={userAuthModalOpen}
        onClose={() => setUserAuthModalOpen(false)}
        onLogin={onLogin}
        users={users}
        onUpdateUsers={onUpdateUsers}
      />
    </>
  );
};

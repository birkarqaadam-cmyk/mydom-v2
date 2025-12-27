import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Building, MapPin, ArrowRight, Home } from 'lucide-react';

export default function ComplexesPage({ complexes, user, onLogin, onLogout }) {
  return (
    <div className="app-container" data-testid="complexes-page">
      <Header user={user} onLogin={onLogin} onLogout={onLogout} />
      
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 logo-text mb-3">Yaşayış Kompleksləri</h1>
          <p className="text-lg text-gray-600">Bakının ən yaxşı layihələri</p>
        </div>
      </section>

      {/* Complexes Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="complexes-grid">
            {complexes.map((complex) => (
              <Link
                key={complex.id}
                to={`/complexes/${complex.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden card-hover"
                data-testid={`complex-card-${complex.id}`}
              >
                <div className="relative h-48">
                  <img src={complex.image} alt={complex.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-[#B91C1C]">
                    {complex.status}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{complex.name}</h3>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin size={14} className="text-[#B91C1C]" />
                    <span className="text-sm">{complex.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Building size={14} className="text-[#B91C1C]" />
                    <span className="text-sm">{complex.developer}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Qiymət</p>
                      <p className="text-lg font-bold text-[#B91C1C]">{complex.priceFrom.toLocaleString()} AZN-dən</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Mənzillər</p>
                      <p className="font-medium text-gray-900">{complex.totalApartments}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center text-[#B91C1C] font-medium text-sm">
                    <span>Ətraflı bax</span>
                    <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

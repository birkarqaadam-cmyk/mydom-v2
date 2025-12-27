import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Building2, Phone, MapPin, FileText, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function AgenciesPage({ agencies, listings, user, onLogin, onLogout }) {
  const getAgencyListingsCount = (agencyId) => {
    return listings.filter(l => l.agencyId === agencyId).length;
  };

  return (
    <div className="app-container" data-testid="agencies-page">
      <Header user={user} onLogin={onLogin} onLogout={onLogout} />
      
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 logo-text mb-3">Agentliklər</h1>
              <p className="text-lg text-gray-600">Etibarlı agentliklərdən elanlar</p>
            </div>
            <Link to="/agency/login">
              <Button className="bg-[#B91C1C] hover:bg-[#991B1B]" data-testid="agent-login-btn">
                <Building2 size={18} className="mr-2" />
                Agent Girişi
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Agencies Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="agencies-grid">
            {agencies.map((agency) => (
              <Link
                key={agency.id}
                to={`/agencies/${agency.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden card-hover"
                data-testid={`agency-card-${agency.id}`}
              >
                <div className="h-32 bg-gray-100">
                  <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{agency.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{agency.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-[#B91C1C]" />
                      <span>{agency.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#B91C1C]" />
                      <span className="truncate">{agency.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-[#B91C1C]" />
                      <span>{getAgencyListingsCount(agency.id)} elan</span>
                    </div>
                  </div>

                  <div className="flex items-center text-[#B91C1C] font-medium text-sm">
                    <span>Elanları gör</span>
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

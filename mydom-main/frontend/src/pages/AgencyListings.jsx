import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { ListingCard } from '../components/ListingCard';
import { useState } from 'react';

export default function AgencyListings({ agencies, listings }) {
  const { id } = useParams();
  const agency = agencies.find(a => a.id === id);
  const agencyListings = listings.filter(l => l.agencyId === id);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('mydom_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const handleFavoriteToggle = (listingId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(listingId) ? prev.filter(f => f !== listingId) : [...prev, listingId];
      localStorage.setItem('mydom_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  if (!agency) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Agentlik tapılmadı</p>
          <Link to="/agencies" className="text-[#B91C1C]">Agentliklərə qayıt</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/agencies" className="flex items-center gap-2 text-gray-600 hover:text-[#B91C1C]">
            <ArrowLeft size={20} />
            <span>Agentliklər</span>
          </Link>
          <Link to="/" className="logo-text text-2xl font-semibold text-[#B91C1C]">Mydom</Link>
        </div>
      </header>

      {/* Agency Info */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img src={agency.logo} alt={agency.name} className="w-32 h-32 rounded-xl object-cover" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 logo-text mb-2">{agency.name}</h1>
              <p className="text-gray-600 mb-4">{agency.description}</p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} className="text-[#B91C1C]" />
                  <span>{agency.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} className="text-[#B91C1C]" />
                  <span>{agency.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} className="text-[#B91C1C]" />
                  <span>{agency.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{agency.name} Elanları ({agencyListings.length})</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agencyListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isFavorite={favorites.includes(listing.id)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>

          {agencyListings.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">Bu agentlikdə elan tapılmadı</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Building, Check, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ListingCard } from '../components/ListingCard';
import { useState } from 'react';

export default function ComplexDetail({ complexes, listings }) {
  const { id } = useParams();
  const complex = complexes.find(c => c.id === id);
  const complexListings = listings.filter(l => l.location.includes(complex?.location?.split(',')[0]));
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

  if (!complex) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Kompleks tapılmadı</p>
          <Link to="/complexes" className="text-[#B91C1C]">Komplekslərə qayıt</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/complexes" className="flex items-center gap-2 text-gray-600 hover:text-[#B91C1C]">
            <ArrowLeft size={20} />
            <span>Komplekslər</span>
          </Link>
          <Link to="/" className="logo-text text-2xl font-semibold text-[#B91C1C]">Mydom</Link>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-80 md:h-96">
        <img src={complex.image} alt={complex.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-[#B91C1C] mb-4">
              {complex.status}
            </span>
            <h1 className="text-4xl font-bold text-white logo-text">{complex.name}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl p-6 border">
                <h2 className="text-xl font-semibold mb-4">Haqqında</h2>
                <p className="text-gray-600 leading-relaxed">{complex.description}</p>
              </div>

              <div className="bg-white rounded-xl p-6 border">
                <h2 className="text-xl font-semibold mb-4">İmkanlar</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {complex.amenities?.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-600">
                      <Check size={16} className="text-green-500" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Listings in this area */}
              {complexListings.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Bu ərazidə elanlar</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {complexListings.slice(0, 4).map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        isFavorite={favorites.includes(listing.id)}
                        onFavoriteToggle={handleFavoriteToggle}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border sticky top-24">
                <div className="mb-6">
                  <p className="text-sm text-gray-500">Başlanğıc qiymət</p>
                  <p className="text-3xl font-bold text-[#B91C1C]">{complex.priceFrom.toLocaleString()} AZN</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-[#B91C1C]" />
                    <span className="text-gray-600">{complex.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building size={18} className="text-[#B91C1C]" />
                    <span className="text-gray-600">{complex.developer}</span>
                  </div>
                </div>

                <Button className="w-full bg-[#B91C1C] hover:bg-[#991B1B]">
                  <Phone size={18} className="mr-2" />
                  Əlaqə saxla
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

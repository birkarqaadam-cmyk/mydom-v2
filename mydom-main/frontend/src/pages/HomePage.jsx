import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { HeroSearch } from '../components/HeroSearch';
import { ListingCard } from '../components/ListingCard';
import { toast } from 'sonner';

export default function HomePage({ listings, agencies, user, users, onLogin, onLogout, onUpdateUsers }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [favorites, setFavorites] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'sale');
  const [filteredListings, setFilteredListings] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('mydom_favorites');
    if (saved) setFavorites(JSON.parse(saved));
    const locs = localStorage.getItem('mydom_selected_locations');
    if (locs) setSelectedLocations(JSON.parse(locs));
  }, []);

  useEffect(() => {
    const filtered = listings.filter(l => l.category === activeCategory);
    setFilteredListings(filtered);
  }, [listings, activeCategory]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && ['sale', 'rent', 'daily'].includes(cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchParams({ category });
  };

  const handleFavoriteToggle = (id) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('mydom_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const handleSearch = (filters) => {
    let results = listings.filter(l => l.category === filters.category);
    
    if (filters.propertyType) {
      const typeMap = {
        'menzil': 'Mənzil', 'yeni-tikili': 'Yeni tikili', 'kohne-tikili': 'Köhnə tikili',
        'heyet-evi': 'Həyət evi', 'ofis': 'Ofis', 'qaraj': 'Qaraj', 'torpaq': 'Torpaq', 'obyekt': 'Obyekt'
      };
      results = results.filter(l => l.type === typeMap[filters.propertyType]);
    }
    if (filters.rooms) {
      results = filters.rooms === '5+' 
        ? results.filter(l => l.rooms >= 5)
        : results.filter(l => l.rooms === parseInt(filters.rooms));
    }
    if (filters.minPrice) results = results.filter(l => l.price >= parseInt(filters.minPrice));
    if (filters.maxPrice) results = results.filter(l => l.price <= parseInt(filters.maxPrice));
    if (filters.locations?.length) {
      results = results.filter(l => filters.locations.some(loc => l.location.includes(loc)));
    }

    setFilteredListings(results);
    toast.success(`${results.length} elan tapıldı`);
  };

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (a.isVip && !b.isVip) return -1;
    if (!a.isVip && b.isVip) return 1;
    if (a.isAgency && !b.isAgency) return -1;
    if (!a.isAgency && b.isAgency) return 1;
    return 0;
  });

  const getCategoryTitle = () => {
    const titles = { sale: 'Satış elanları', rent: 'Kirayə elanları', daily: 'Günlük kirayə' };
    return titles[activeCategory];
  };

  return (
    <div className="app-container" data-testid="home-page">
      <Header user={user} onLogin={onLogin} onLogout={onLogout} users={users} onUpdateUsers={onUpdateUsers} />
      <HeroSearch 
        onSearch={handleSearch}
        selectedLocations={selectedLocations}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      <section className="py-12 md:py-16 bg-white" data-testid="listings-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 logo-text">
              {getCategoryTitle()}
            </h2>
            <span className="text-sm text-gray-500">{sortedListings.length} elan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedListings.map((listing, index) => (
              <div key={listing.id} className="slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <ListingCard
                  listing={listing}
                  isFavorite={favorites.includes(listing.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </div>
            ))}
          </div>

          {sortedListings.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">Bu kateqoriyada elan tapılmadı</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

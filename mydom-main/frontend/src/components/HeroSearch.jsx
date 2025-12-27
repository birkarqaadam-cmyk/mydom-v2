import { useState } from 'react';
import { Search, MapPin, ChevronDown, Home, Building2, Building, Warehouse, Briefcase, Car, Mountain, Store } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { LocationModal } from './LocationModal';
import { propertyTypes, roomOptions } from '../data/mockData';

const iconMap = {
  Building2, Building, Warehouse, Home, Briefcase, Car, Mountain, Store,
};

export const HeroSearch = ({ onSearch, selectedLocations, activeCategory, onCategoryChange }) => {
  const [propertyType, setPropertyType] = useState('');
  const [rooms, setRooms] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [pricePopoverOpen, setPricePopoverOpen] = useState(false);

  const handleSearch = () => {
    onSearch({
      category: activeCategory,
      propertyType,
      rooms,
      minPrice,
      maxPrice,
      locations: selectedLocations
    });
  };

  const getLocationButtonText = () => {
    if (selectedLocations && selectedLocations.length > 0) {
      return selectedLocations.length === 1 ? selectedLocations[0] : `${selectedLocations.length} məkan seçildi`;
    }
    return 'Rayon, metro, nişangah';
  };

  return (
    <>
      <section className="relative py-16 md:py-24 bg-gray-50" data-testid="hero-section">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/26389602/pexels-photo-26389602.jpeg)' }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 logo-text">
              Bakıda Əmlak Axtarışı
            </h1>
            <p className="text-lg text-white/80">
              Satış, kirayə və günlük mənzillər
            </p>
          </div>

          <div className="search-glass p-6 md:p-8" data-testid="search-box">
            {/* Category Tabs */}
            <div className="flex gap-2 mb-6" data-testid="search-tabs">
              {[
                { id: 'sale', label: 'Alış' },
                { id: 'rent', label: 'Kirayə' },
                { id: 'daily', label: 'Günlük' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onCategoryChange(tab.id)}
                  className={`px-6 py-2.5 rounded-full font-medium transition-colors ${
                    activeCategory === tab.id
                      ? 'bg-[#B91C1C] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-12" data-testid="property-type-select">
                  <SelectValue placeholder="Əmlak növü" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={rooms} onValueChange={setRooms}>
                <SelectTrigger className="h-12" data-testid="rooms-select">
                  <SelectValue placeholder="Otaq sayı" />
                </SelectTrigger>
                <SelectContent>
                  {roomOptions.map((room) => (
                    <SelectItem key={room} value={room}>{room} otaq</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover open={pricePopoverOpen} onOpenChange={setPricePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-12 justify-between font-normal" data-testid="price-dropdown">
                    {minPrice || maxPrice ? `${minPrice || '0'} - ${maxPrice || '∞'} AZN` : 'Qiymət'}
                    <ChevronDown size={16} className="text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Qiymət aralığı (AZN)</h4>
                    <div className="flex gap-3">
                      <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                      <span className="flex items-center text-gray-400">—</span>
                      <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                    </div>
                    <Button onClick={() => setPricePopoverOpen(false)} className="w-full bg-[#B91C1C] hover:bg-[#991B1B]">
                      Tətbiq et
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                onClick={() => setLocationModalOpen(true)}
                className="h-12 justify-start font-normal"
                data-testid="location-button"
              >
                <MapPin size={18} className="mr-2 text-[#B91C1C]" />
                <span className="truncate">{getLocationButtonText()}</span>
              </Button>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full h-14 bg-[#B91C1C] hover:bg-[#991B1B] text-white text-lg font-semibold btn-transition"
              data-testid="search-button"
            >
              <Search size={20} className="mr-2" />
              Axtar
            </Button>
          </div>

          {/* Category Icons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4" data-testid="category-icons">
            {propertyTypes.map((type) => {
              const IconComponent = iconMap[type.icon];
              return (
                <button
                  key={type.id}
                  onClick={() => setPropertyType(type.id)}
                  className={`category-icon flex flex-col items-center gap-2 p-4 rounded-xl bg-white/90 border border-white/50 ${
                    propertyType === type.id ? 'active' : ''
                  }`}
                  data-testid={`category-${type.id}`}
                >
                  {IconComponent && <IconComponent size={24} />}
                  <span className="text-xs font-medium whitespace-nowrap">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <LocationModal isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
    </>
  );
};

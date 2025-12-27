import { useState, useEffect } from 'react';
import { X, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { bakuLocations, otherCities } from '../data/mockData';

export const LocationModal = ({ isOpen, onClose, onSelect }) => {
  const [activeCity, setActiveCity] = useState('baku');
  const [activeTab, setActiveTab] = useState('rayonlar');
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('mydom_selected_locations');
      setSelectedLocations(saved ? JSON.parse(saved) : []);
    }
  }, [isOpen]);

  const handleLocationToggle = (location) => {
    setSelectedLocations(prev => prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]);
  };

  const handleApply = () => {
    localStorage.setItem('mydom_selected_locations', JSON.stringify(selectedLocations));
    if (onSelect) onSelect(selectedLocations);
    onClose();
  };

  const handleClear = () => {
    setSelectedLocations([]);
    localStorage.removeItem('mydom_selected_locations');
  };

  const filteredMetrolar = bakuLocations.metrolar.filter(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredNisangahlar = bakuLocations.nisangahlar.filter(n => n.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCities = otherCities.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0" data-testid="location-modal">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold logo-text">Məkan seçin</DialogTitle>
          
          <div className="flex gap-3 mt-4">
            <Button
              variant={activeCity === 'baku' ? 'default' : 'outline'}
              onClick={() => { setActiveCity('baku'); setActiveTab('rayonlar'); }}
              className={activeCity === 'baku' ? 'bg-[#B91C1C] hover:bg-[#991B1B]' : ''}
            >
              Bakı
            </Button>
            <Button
              variant={activeCity === 'other' ? 'default' : 'outline'}
              onClick={() => setActiveCity('other')}
              className={activeCity === 'other' ? 'bg-[#B91C1C] hover:bg-[#991B1B]' : ''}
            >
              Digər Şəhərlər
            </Button>
          </div>

          <div className="relative mt-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Axtar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>

          {activeCity === 'baku' && (
            <div className="flex gap-2 mt-4">
              {['rayonlar', 'metrolar', 'nisangahlar'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`location-tab ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab === 'rayonlar' ? 'Rayonlar' : tab === 'metrolar' ? 'Metrolar' : 'Nişangahlar'}
                </button>
              ))}
            </div>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-4">
            {activeCity === 'baku' ? (
              <>
                {activeTab === 'rayonlar' && (
                  <div className="space-y-2">
                    {Object.entries(bakuLocations.rayonlar).map(([district, areas]) => {
                      const filteredAreas = areas.filter(a => a.toLowerCase().includes(searchQuery.toLowerCase()) || district.toLowerCase().includes(searchQuery.toLowerCase()));
                      if (searchQuery && filteredAreas.length === 0) return null;
                      
                      return (
                        <div key={district} className="border rounded-lg overflow-hidden">
                          <button
                            onClick={() => setExpandedDistrict(expandedDistrict === district ? null : district)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={areas.every(a => selectedLocations.includes(a))}
                                onCheckedChange={() => {
                                  const allSelected = areas.every(a => selectedLocations.includes(a));
                                  setSelectedLocations(prev => allSelected ? prev.filter(l => !areas.includes(l)) : [...new Set([...prev, ...areas])]);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span className="font-medium">{district}</span>
                              <span className="text-sm text-gray-400">({areas.length})</span>
                            </div>
                            {expandedDistrict === district ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                          </button>
                          
                          {expandedDistrict === district && (
                            <div className="px-4 pb-4 pt-2 bg-gray-50 grid grid-cols-2 md:grid-cols-3 gap-2">
                              {(searchQuery ? filteredAreas : areas).map((area) => (
                                <label key={area} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white cursor-pointer">
                                  <Checkbox checked={selectedLocations.includes(area)} onCheckedChange={() => handleLocationToggle(area)} />
                                  <span className="text-sm">{area}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === 'metrolar' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {filteredMetrolar.map((metro) => (
                      <label key={metro} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                        <Checkbox checked={selectedLocations.includes(metro)} onCheckedChange={() => handleLocationToggle(metro)} />
                        <span className="text-sm">{metro} m.</span>
                      </label>
                    ))}
                  </div>
                )}

                {activeTab === 'nisangahlar' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {filteredNisangahlar.map((place) => (
                      <label key={place} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                        <Checkbox checked={selectedLocations.includes(place)} onCheckedChange={() => handleLocationToggle(place)} />
                        <span className="text-sm">{place}</span>
                      </label>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filteredCities.map((city) => (
                  <label key={city} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                    <Checkbox checked={selectedLocations.includes(city)} onCheckedChange={() => handleLocationToggle(city)} />
                    <span className="text-sm">{city}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {selectedLocations.length > 0 ? `${selectedLocations.length} məkan seçildi` : 'Məkan seçilməyib'}
          </span>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClear}>Təmizlə</Button>
            <Button onClick={handleApply} className="bg-[#B91C1C] hover:bg-[#991B1B]">Tətbiq et</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

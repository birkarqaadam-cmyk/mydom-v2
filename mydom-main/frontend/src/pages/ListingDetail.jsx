import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, MessageCircle, Maximize2, Building2, Star, Heart, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { formatPrice } from '../data/mockData';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ListingDetail({ listings, agencies }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(() => {
    const saved = localStorage.getItem('mydom_favorites');
    return saved ? JSON.parse(saved).includes(id) : false;
  });
  const [activeImage, setActiveImage] = useState(0);

  const listing = listings.find(l => l.id === id);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Elan tapılmadı</p>
          <Link to="/" className="text-[#B91C1C]">Ana səhifəyə qayıt</Link>
        </div>
      </div>
    );
  }

  const agency = listing.agencyId ? agencies.find(a => a.id === listing.agencyId) : null;
  const images = Array.isArray(listing.images) ? listing.images : [listing.image];

  const handleCall = () => window.location.href = `tel:${listing.phone}`;
  
  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Salam! ${listing.location} ünvanındakı elan ilə maraqlanıram.`);
    window.open(`https://wa.me/${listing.phone.replace(/\+/g, '')}?text=${message}`, '_blank');
  };

  const handleFavorite = () => {
    const saved = localStorage.getItem('mydom_favorites');
    const favorites = saved ? JSON.parse(saved) : [];
    const newFavorites = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    localStorage.setItem('mydom_favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Seçilmişlərdən silindi' : 'Seçilmişlərə əlavə edildi');
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: `${listing.type} - ${listing.location}`, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link kopyalandı');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="listing-detail-page">
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-[#B91C1C]">
            <ArrowLeft size={20} /><span>Geri</span>
          </button>
          <Link to="/" className="logo-text text-2xl font-semibold text-[#B91C1C]">Mydom</Link>
          <div className="flex items-center gap-2">
            <button onClick={handleFavorite} className="p-2 rounded-lg hover:bg-gray-100">
              <Heart size={20} className={isFavorite ? 'text-[#B91C1C] fill-[#B91C1C]' : 'text-gray-400'} />
            </button>
            <button onClick={handleShare} className="p-2 rounded-lg hover:bg-gray-100">
              <Share2 size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <img src={images[activeImage]} alt={listing.location} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {listing.isVip && <span className="vip-badge flex items-center gap-1"><Star size={12} fill="currentColor" />VIP</span>}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    listing.category === 'rent' ? 'bg-blue-500 text-white' : 
                    listing.category === 'daily' ? 'bg-purple-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {listing.category === 'rent' ? 'Kirayə' : listing.category === 'daily' ? 'Günlük' : 'Satılır'}
                  </span>
                  {listing.ownerType === 'sahibinden' && (
                    <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">Sahibindən</span>
                  )}
                </div>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${activeImage === i ? 'border-[#B91C1C]' : 'border-transparent'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Location */}
            <div className="bg-white rounded-xl p-6 border">
              <p className="text-3xl font-bold text-[#B91C1C] mb-3 logo-text">{formatPrice(listing.price, listing.category)}</p>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={18} className="text-[#B91C1C]" />
                <span>{listing.location}</span>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl p-6 border">
              <h2 className="text-lg font-semibold mb-4">Əmlak məlumatları</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-xl font-bold text-gray-900">{listing.type}</p>
                  <p className="text-sm text-gray-500">Növ</p>
                </div>
                {listing.rooms > 0 && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold text-gray-900">{listing.rooms}</p>
                    <p className="text-sm text-gray-500">Otaq</p>
                  </div>
                )}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-xl font-bold text-gray-900">{listing.area}</p>
                  <p className="text-sm text-gray-500">m²</p>
                </div>
                {listing.floor > 0 && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold text-gray-900">{listing.floor}/{listing.totalFloors}</p>
                    <p className="text-sm text-gray-500">Mərtəbə</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 border">
              <h2 className="text-lg font-semibold mb-4">Təsvir</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description || 'Təsvir mövcud deyil.'}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Əlaqə</h3>
              {agency && (
                <Link to={`/agencies/${agency.id}`} className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div className="w-12 h-12 bg-[#B91C1C]/10 rounded-full flex items-center justify-center">
                    <Building2 size={24} className="text-[#B91C1C]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{agency.name}</p>
                    <p className="text-sm text-gray-500">Agentlik</p>
                  </div>
                </Link>
              )}
              {listing.ownerType === 'sahibinden' && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-700">Sahibindən</p>
                  <p className="text-sm text-green-600">Birbaşa mülk sahibindən</p>
                </div>
              )}
              <p className="text-xl font-semibold text-gray-900 mb-4">{listing.phone}</p>
              <div className="space-y-3">
                <Button onClick={handleCall} className="w-full h-12 bg-[#B91C1C] hover:bg-[#991B1B]">
                  <Phone size={18} className="mr-2" />Zəng et
                </Button>
                <Button onClick={handleWhatsApp} variant="outline" className="w-full h-12 border-green-500 text-green-600 hover:bg-green-50">
                  <MessageCircle size={18} className="mr-2" />WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

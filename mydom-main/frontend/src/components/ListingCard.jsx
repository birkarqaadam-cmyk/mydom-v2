import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, MessageCircle, Star, MapPin, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { formatPrice } from '../data/mockData';

export const ListingCard = ({ listing, onFavoriteToggle, isFavorite }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 400);
    onFavoriteToggle(listing.id);
    
    if (!isFavorite) {
      toast.success('Seçilmişlərə əlavə edildi');
    }
  };

  const handleCall = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `tel:${listing.phone}`;
  };

  const handleWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = encodeURIComponent(`Salam! ${listing.location} ünvanındakı elan ilə maraqlanıram.`);
    window.open(`https://wa.me/${listing.phone.replace(/\+/g, '')}?text=${message}`, '_blank');
  };

  const getCardClasses = () => {
    let classes = 'listing-card flex flex-col overflow-hidden rounded-xl border-2 bg-white card-hover';
    if (listing.isVip) classes += ' border-[#D4AF37] vip-glow';
    else if (listing.isAgency) classes += ' border-blue-500 agency-border';
    else classes += ' border-gray-200';
    return classes;
  };

  const mainImage = Array.isArray(listing.images) ? listing.images[0] : listing.image;

  return (
    <Link to={`/listings/${listing.id}`} className={getCardClasses()} data-testid={`listing-card-${listing.id}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
        <img
          src={mainImage}
          alt={listing.location}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        <div className="absolute top-3 left-3 flex gap-2">
          {listing.isVip && (
            <span className="vip-badge flex items-center gap-1">
              <Star size={12} fill="currentColor" />
              VIP
            </span>
          )}
          {listing.isAgency && (
            <span className="agency-badge">{listing.agencyName}</span>
          )}
          {listing.ownerType === 'sahibinden' && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
              Sahibindən
            </span>
          )}
        </div>

        <div className="absolute top-3 right-12">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            listing.category === 'rent' ? 'bg-blue-500 text-white' : 
            listing.category === 'daily' ? 'bg-purple-500 text-white' : 
            'bg-green-500 text-white'
          }`}>
            {listing.category === 'rent' ? 'Kirayə' : listing.category === 'daily' ? 'Günlük' : 'Satılır'}
          </span>
        </div>

        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors ${heartAnimating ? 'heart-animate' : ''}`}
          data-testid={`favorite-btn-${listing.id}`}
        >
          <Heart size={18} className={isFavorite ? 'text-[#B91C1C] fill-[#B91C1C]' : 'text-gray-400'} />
        </button>

        <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1.5 rounded-lg shadow-sm">
          <span className="price-tag text-lg">{formatPrice(listing.price, listing.category)}</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start gap-2 mb-2">
          <MapPin size={16} className="text-[#B91C1C] mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-700 line-clamp-1">{listing.location}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <span>{listing.type}</span>
          {listing.rooms > 0 && (
            <>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{listing.rooms} otaq</span>
            </>
          )}
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className="flex items-center gap-1">
            <Maximize2 size={12} />
            {listing.area} m²
          </span>
        </div>

        <div className="flex gap-2 mt-auto">
          <Button
            onClick={handleCall}
            className="flex-1 bg-[#B91C1C] hover:bg-[#991B1B] text-white btn-transition"
          >
            <Phone size={16} className="mr-2" />
            Zəng et
          </Button>
          <Button
            onClick={handleWhatsApp}
            variant="outline"
            className="flex-1 border-green-500 text-green-600 hover:bg-green-50 btn-transition"
          >
            <MessageCircle size={16} className="mr-2" />
            WhatsApp
          </Button>
        </div>
      </div>
    </Link>
  );
};

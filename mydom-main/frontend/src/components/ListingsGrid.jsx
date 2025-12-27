import { ListingCard } from './ListingCard';

export const ListingsGrid = ({ listings, favorites, onFavoriteToggle, activeCategory }) => {
  // Sort listings: VIP first, then Agency, then Normal
  const sortedListings = [...listings].sort((a, b) => {
    if (a.isVip && !b.isVip) return -1;
    if (!a.isVip && b.isVip) return 1;
    if (a.isAgency && !b.isAgency) return -1;
    if (!a.isAgency && b.isAgency) return 1;
    return 0;
  });

  return (
    <section className="py-12 md:py-16 bg-[#0d0d0d]" data-testid="listings-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 
            className="text-2xl md:text-3xl font-bold text-gray-100"
            style={{ fontFamily: 'Manrope, sans-serif' }}
          >
            {activeCategory === 'rent' ? 'Kirayə elanları' : 'Satış elanları'}
          </h2>
          <span className="text-sm text-gray-500">
            {listings.length} elan tapıldı
          </span>
        </div>

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          data-testid="listings-grid"
        >
          {sortedListings.map((listing, index) => (
            <div 
              key={listing.id} 
              className="slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ListingCard
                listing={listing}
                isFavorite={favorites.includes(listing.id)}
                onFavoriteToggle={onFavoriteToggle}
              />
            </div>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">Elan tapılmadı</p>
          </div>
        )}
      </div>
    </section>
  );
};

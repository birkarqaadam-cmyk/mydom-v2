-- =====================================================
-- MyDom Real Estate Platform - Supabase Database Schema
-- =====================================================
-- Run this script in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. AGENCIES TABLE (Agentliklər)
-- =====================================================
CREATE TABLE IF NOT EXISTS agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    access_code VARCHAR(20) UNIQUE NOT NULL,
    logo TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    description TEXT,
    listings_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick access code lookups
CREATE INDEX IF NOT EXISTS idx_agencies_access_code ON agencies(access_code);
CREATE INDEX IF NOT EXISTS idx_agencies_is_active ON agencies(is_active);

-- =====================================================
-- 2. COMPLEXES TABLE (Yaşayış Kompleksləri)
-- =====================================================
CREATE TABLE IF NOT EXISTS complexes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    image TEXT,
    location VARCHAR(255),
    developer VARCHAR(255),
    description TEXT,
    status VARCHAR(100) DEFAULT 'Tikinti davam edir',
    total_apartments INTEGER DEFAULT 0,
    price_from DECIMAL(15, 2) DEFAULT 0,
    amenities TEXT[], -- Array of amenities like ['Park', 'Mühafizə', 'Parking']
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for active complexes
CREATE INDEX IF NOT EXISTS idx_complexes_is_active ON complexes(is_active);
CREATE INDEX IF NOT EXISTS idx_complexes_location ON complexes(location);

-- =====================================================
-- 3. LISTINGS TABLE (İlanlar)
-- =====================================================
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    title VARCHAR(255),
    description TEXT,
    
    -- Images (array of image URLs from Supabase Storage)
    images TEXT[],
    
    -- Category: 'sale', 'rent', 'daily'
    category VARCHAR(20) NOT NULL CHECK (category IN ('sale', 'rent', 'daily')),
    
    -- Property Type: 'Mənzil', 'Ev/Villa', 'Ofis', 'Torpaq', etc.
    type VARCHAR(100) NOT NULL,
    
    -- Pricing
    price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'AZN',
    
    -- Location
    location VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Property Details
    rooms INTEGER,
    area DECIMAL(10, 2), -- Square meters
    floor INTEGER,
    total_floors INTEGER,
    
    -- Ownership
    owner_type VARCHAR(50) NOT NULL CHECK (owner_type IN ('agency', 'sahibinden')),
    agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
    agency_name VARCHAR(255),
    
    -- User owner (for 'sahibinden' listings)
    owner_name VARCHAR(255),
    owner_phone VARCHAR(50),
    owner_email VARCHAR(255),
    user_id UUID, -- Reference to auth.users if using Supabase Auth
    
    -- Complex reference (for new building listings)
    complex_id UUID REFERENCES complexes(id) ON DELETE SET NULL,
    
    -- Status flags
    is_vip BOOLEAN DEFAULT false,
    is_agency BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    -- Amenities
    amenities TEXT[], -- Array: ['Təmir', 'Mebel', 'Kondisioner', etc.]
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    vip_until TIMESTAMP WITH TIME ZONE -- VIP expiration date
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_is_vip ON listings(is_vip);
CREATE INDEX IF NOT EXISTS idx_listings_is_active ON listings(is_active);
CREATE INDEX IF NOT EXISTS idx_listings_agency_id ON listings(agency_id);
CREATE INDEX IF NOT EXISTS idx_listings_owner_type ON listings(owner_type);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_listings_category_type_location 
    ON listings(category, type, location) WHERE is_active = true;

-- =====================================================
-- 4. USERS TABLE (İstifadəçilər) - Optional
-- =====================================================
-- Note: If using Supabase Auth, user data is in auth.users
-- This table is for additional user profile data
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. FAVORITES TABLE (Seçilmişlər)
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- =====================================================
-- 6. VIEWS/STATS TABLE (Baxış Statistikası)
-- =====================================================
CREATE TABLE IF NOT EXISTS listing_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    viewer_id UUID,
    ip_address INET,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listing_views_listing_id ON listing_views(listing_id);

-- =====================================================
-- 7. TRIGGER FUNCTIONS
-- =====================================================

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_agencies_updated_at
    BEFORE UPDATE ON agencies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complexes_updated_at
    BEFORE UPDATE ON complexes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update agency listings count
CREATE OR REPLACE FUNCTION update_agency_listings_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.agency_id IS NOT NULL THEN
        UPDATE agencies SET listings_count = listings_count + 1 WHERE id = NEW.agency_id;
    ELSIF TG_OP = 'DELETE' AND OLD.agency_id IS NOT NULL THEN
        UPDATE agencies SET listings_count = listings_count - 1 WHERE id = OLD.agency_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.agency_id IS DISTINCT FROM NEW.agency_id THEN
            IF OLD.agency_id IS NOT NULL THEN
                UPDATE agencies SET listings_count = listings_count - 1 WHERE id = OLD.agency_id;
            END IF;
            IF NEW.agency_id IS NOT NULL THEN
                UPDATE agencies SET listings_count = listings_count + 1 WHERE id = NEW.agency_id;
            END IF;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_agency_listings_count
    AFTER INSERT OR UPDATE OR DELETE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_agency_listings_count();

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE complexes ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Agencies: Public read, admin write
CREATE POLICY "Agencies are viewable by everyone" 
    ON agencies FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Agencies can be managed by admin" 
    ON agencies FOR ALL 
    USING (auth.jwt() ->> 'is_admin' = 'true');

-- Complexes: Public read, admin write
CREATE POLICY "Complexes are viewable by everyone" 
    ON complexes FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Complexes can be managed by admin" 
    ON complexes FOR ALL 
    USING (auth.jwt() ->> 'is_admin' = 'true');

-- Listings: Public read active listings
CREATE POLICY "Active listings are viewable by everyone" 
    ON listings FOR SELECT 
    USING (is_active = true);

-- Listings: Users can create their own listings
CREATE POLICY "Users can create their own listings" 
    ON listings FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

-- Listings: Users can update their own listings
CREATE POLICY "Users can update their own listings" 
    ON listings FOR UPDATE 
    USING (user_id = auth.uid() OR auth.jwt() ->> 'is_admin' = 'true');

-- Listings: Users can delete their own listings
CREATE POLICY "Users can delete their own listings" 
    ON listings FOR DELETE 
    USING (user_id = auth.uid() OR auth.jwt() ->> 'is_admin' = 'true');

-- Favorites: Users can manage their own favorites
CREATE POLICY "Users can view their own favorites" 
    ON favorites FOR SELECT 
    USING (user_id = auth.uid());

CREATE POLICY "Users can add favorites" 
    ON favorites FOR INSERT 
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their favorites" 
    ON favorites FOR DELETE 
    USING (user_id = auth.uid());

-- =====================================================
-- 9. SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Sample Agencies
INSERT INTO agencies (name, access_code, logo, phone, email, address, is_active) VALUES
('Re/Max Azerbaijan', 'RMX-2024', 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg', '+994 12 555 1234', 'info@remax.az', 'Bakı, Nizami küçəsi 45', true),
('Premium Estate', 'PRE-2024', 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg', '+994 12 555 5678', 'info@premium.az', 'Bakı, Nərimanov rayonu', true),
('Baku Property', 'BPR-2024', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg', '+994 12 555 9012', 'info@bakuproperty.az', 'Bakı, Yasamal rayonu', true)
ON CONFLICT DO NOTHING;

-- Sample Complexes
INSERT INTO complexes (name, image, location, developer, status, total_apartments, price_from, amenities) VALUES
('Port Baku Residence', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg', 'Bakı, Sahil', 'Pasha Construction', 'Hazır', 450, 250000, ARRAY['Üzgüçülük hovuzu', '24/7 Mühafizə', 'Yeraltı parking', 'Fitnes zalı']),
('Crystal Plaza', 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', 'Bakı, Nərimanov', 'Crystal Group', 'Tikinti davam edir', 320, 120000, ARRAY['Park', 'Mühafizə', 'Lift']),
('Green Park Towers', 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg', 'Bakı, Xətai', 'Green Development', '2025-ci il', 280, 85000, ARRAY['Yaşıl zona', 'Uşaq meydançası', 'Mühafizə'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. STORAGE BUCKET SETUP (Run in Supabase Dashboard)
-- =====================================================
-- Note: Storage buckets should be created via Supabase Dashboard
-- Bucket name: 'listings'
-- Public bucket: Yes
-- Allowed MIME types: image/jpeg, image/png, image/webp
-- Max file size: 5MB

-- After creating the bucket, add this policy:
-- Policy name: "Anyone can upload images"
-- Allowed operations: INSERT
-- Policy: true (for public uploads)
-- OR restrict to authenticated users: auth.uid() IS NOT NULL

-- =====================================================
-- IMPORTANT NOTES:
-- =====================================================
-- 1. Replace auth.jwt() and auth.uid() policies if not using Supabase Auth
-- 2. Adjust RLS policies based on your security requirements
-- 3. Create the 'listings' storage bucket manually in Supabase Dashboard
-- 4. Set up storage policies for secure file uploads
-- =====================================================

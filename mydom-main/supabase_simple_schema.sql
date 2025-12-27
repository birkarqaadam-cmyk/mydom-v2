-- =====================================================
-- MyDom - Sadə Supabase Schema (RLS OLMADAN)
-- =====================================================
-- Bu script-i Supabase SQL Editor-da run edin
-- RLS deaktivdir - test üçün idealdır
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. LISTINGS TABLE (İlanlar)
-- =====================================================
DROP TABLE IF EXISTS listings CASCADE;

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    description TEXT,
    images TEXT[],
    category VARCHAR(20) NOT NULL DEFAULT 'sale',
    type VARCHAR(100) NOT NULL,
    price DECIMAL(15, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'AZN',
    location VARCHAR(255) NOT NULL,
    address TEXT,
    rooms INTEGER,
    area DECIMAL(10, 2),
    floor INTEGER,
    total_floors INTEGER,
    owner_type VARCHAR(50) DEFAULT 'sahibinden',
    owner_name VARCHAR(255),
    owner_phone VARCHAR(50),
    owner_email VARCHAR(255),
    user_id TEXT,
    agency_id UUID,
    agency_name VARCHAR(255),
    is_vip BOOLEAN DEFAULT false,
    is_agency BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. AGENCIES TABLE (Agentliklər)
-- =====================================================
DROP TABLE IF EXISTS agencies CASCADE;

CREATE TABLE agencies (
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

-- =====================================================
-- 3. COMPLEXES TABLE (Yaşayış Kompleksləri)
-- =====================================================
DROP TABLE IF EXISTS complexes CASCADE;

CREATE TABLE complexes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    image TEXT,
    location VARCHAR(255),
    developer VARCHAR(255),
    description TEXT,
    status VARCHAR(100) DEFAULT 'Tikinti davam edir',
    total_apartments INTEGER DEFAULT 0,
    price_from DECIMAL(15, 2) DEFAULT 0,
    amenities TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DISABLE RLS (Test üçün)
-- =====================================================
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE agencies DISABLE ROW LEVEL SECURITY;
ALTER TABLE complexes DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- PUBLIC ACCESS POLICIES
-- =====================================================

-- Allow all operations for anon users (for testing)
DROP POLICY IF EXISTS "Allow all operations on listings" ON listings;
CREATE POLICY "Allow all operations on listings" ON listings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on agencies" ON agencies;
CREATE POLICY "Allow all operations on agencies" ON agencies FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on complexes" ON complexes;
CREATE POLICY "Allow all operations on complexes" ON complexes FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_is_active ON listings(is_active);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agencies_access_code ON agencies(access_code);
CREATE INDEX IF NOT EXISTS idx_agencies_is_active ON agencies(is_active);

-- =====================================================
-- TEST: Sample listing insert (bunu test edin)
-- =====================================================
-- INSERT INTO listings (title, type, price, location, category, owner_type, is_active)
-- VALUES ('Test İlan', 'Mənzil', 100000, 'Bakı, Nəsimi', 'sale', 'sahibinden', true);

-- =====================================================
-- DONE! İndi app-dan listing əlavə etməyi test edin
-- =====================================================

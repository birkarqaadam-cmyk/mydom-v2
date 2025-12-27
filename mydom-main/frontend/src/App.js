import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import HomePage from './pages/HomePage';
import AgenciesPage from './pages/AgenciesPage';
import AgencyListings from './pages/AgencyListings';
import ComplexesPage from './pages/ComplexesPage';
import ComplexDetail from './pages/ComplexDetail';
import ListingDetail from './pages/ListingDetail';
import AgencyLogin from './pages/AgencyLogin';
import AgencyDashboard from './pages/AgencyDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CreateListing from './pages/CreateListing';
import { mockListings, mockAgencies, mockComplexes, mockUsers } from './data/mockData';
import { fetchListings, fetchAgencies, fetchComplexes } from './lib/supabase';
import './App.css';

// Initialize data from localStorage with fallback to mock data
const getInitialData = (key, defaultData) => {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
};

// Transform Supabase data to app format
const transformListingFromDB = (dbListing) => ({
  id: dbListing.id,
  price: dbListing.price,
  category: dbListing.category,
  location: dbListing.location,
  type: dbListing.type,
  rooms: dbListing.rooms,
  area: dbListing.area,
  floor: dbListing.floor,
  totalFloors: dbListing.total_floors,
  images: dbListing.images || [],
  image: dbListing.images?.[0] || null,
  isVip: dbListing.is_vip,
  isAgency: dbListing.is_agency,
  agencyId: dbListing.agency_id,
  agencyName: dbListing.agency_name,
  userId: dbListing.user_id,
  ownerType: dbListing.owner_type,
  description: dbListing.description,
  phone: dbListing.owner_phone,
  createdAt: dbListing.created_at
});

function App() {
  const [listings, setListings] = useState(() => getInitialData('mydom_listings', mockListings));
  const [agencies, setAgencies] = useState(() => getInitialData('mydom_agencies', mockAgencies));
  const [complexes, setComplexes] = useState(() => getInitialData('mydom_complexes', mockComplexes));
  const [users, setUsers] = useState(() => getInitialData('mydom_users', mockUsers));
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mydom_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentAgency, setCurrentAgency] = useState(() => {
    const saved = localStorage.getItem('mydom_agency');
    return saved ? JSON.parse(saved) : null;
  });

  // Load data from Supabase on mount
  const loadDataFromSupabase = useCallback(async () => {
    try {
      console.log('Loading data from Supabase...');
      
      // Fetch listings from Supabase
      const dbListings = await fetchListings();
      console.log('Fetched listings from Supabase:', dbListings);
      
      if (dbListings && dbListings.length > 0) {
        const transformedListings = dbListings.map(transformListingFromDB);
        // Merge with mock data (mock data as fallback, DB data takes priority)
        const mergedListings = [...transformedListings, ...mockListings.filter(
          mock => !transformedListings.some(db => db.id === mock.id)
        )];
        setListings(mergedListings);
        localStorage.setItem('mydom_listings', JSON.stringify(mergedListings));
      }

      // Fetch agencies from Supabase
      const dbAgencies = await fetchAgencies();
      if (dbAgencies && dbAgencies.length > 0) {
        const mergedAgencies = [...dbAgencies, ...mockAgencies.filter(
          mock => !dbAgencies.some(db => db.id === mock.id)
        )];
        setAgencies(mergedAgencies);
        localStorage.setItem('mydom_agencies', JSON.stringify(mergedAgencies));
      }

      // Fetch complexes from Supabase  
      const dbComplexes = await fetchComplexes();
      if (dbComplexes && dbComplexes.length > 0) {
        const mergedComplexes = [...dbComplexes, ...mockComplexes.filter(
          mock => !dbComplexes.some(db => db.id === mock.id)
        )];
        setComplexes(mergedComplexes);
        localStorage.setItem('mydom_complexes', JSON.stringify(mergedComplexes));
      }

    } catch (error) {
      console.error('Error loading data from Supabase:', error);
      // Continue with localStorage/mock data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDataFromSupabase();
  }, [loadDataFromSupabase]);

  // Refresh listings from database
  const refreshListings = async () => {
    try {
      const dbListings = await fetchListings();
      if (dbListings && dbListings.length > 0) {
        const transformedListings = dbListings.map(transformListingFromDB);
        const mergedListings = [...transformedListings, ...mockListings.filter(
          mock => !transformedListings.some(db => db.id === mock.id)
        )];
        setListings(mergedListings);
        localStorage.setItem('mydom_listings', JSON.stringify(mergedListings));
      }
    } catch (error) {
      console.error('Error refreshing listings:', error);
    }
  };

  const updateListings = (data) => {
    setListings(data);
    localStorage.setItem('mydom_listings', JSON.stringify(data));
  };

  const updateAgencies = (data) => {
    setAgencies(data);
    localStorage.setItem('mydom_agencies', JSON.stringify(data));
  };

  const updateComplexes = (data) => {
    setComplexes(data);
    localStorage.setItem('mydom_complexes', JSON.stringify(data));
  };

  const updateUsers = (data) => {
    setUsers(data);
    localStorage.setItem('mydom_users', JSON.stringify(data));
  };

  const handleUserLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('mydom_user', JSON.stringify(user));
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mydom_user');
  };

  const handleAgencyLogin = (agency) => {
    setCurrentAgency(agency);
    localStorage.setItem('mydom_agency', JSON.stringify(agency));
  };

  const handleAgencyLogout = () => {
    setCurrentAgency(null);
    localStorage.removeItem('mydom_agency');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <HomePage 
            listings={listings}
            agencies={agencies}
            user={currentUser}
            users={users}
            onLogin={handleUserLogin}
            onLogout={handleUserLogout}
            onUpdateUsers={updateUsers}
          />
        } />
        <Route path="/agencies" element={
          <AgenciesPage 
            agencies={agencies}
            listings={listings}
            user={currentUser}
            onLogin={handleUserLogin}
            onLogout={handleUserLogout}
          />
        } />
        <Route path="/agencies/:id" element={
          <AgencyListings 
            agencies={agencies}
            listings={listings}
          />
        } />
        <Route path="/complexes" element={
          <ComplexesPage 
            complexes={complexes}
            user={currentUser}
            onLogin={handleUserLogin}
            onLogout={handleUserLogout}
          />
        } />
        <Route path="/complexes/:id" element={
          <ComplexDetail 
            complexes={complexes}
            listings={listings}
          />
        } />
        <Route path="/listings/:id" element={
          <ListingDetail 
            listings={listings}
            agencies={agencies}
          />
        } />
        <Route path="/create-listing" element={
          currentUser ? (
            <CreateListing 
              user={currentUser}
              listings={listings}
              onUpdateListings={updateListings}
              onRefreshListings={refreshListings}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/agency/login" element={
          <AgencyLogin 
            agencies={agencies}
            onAgencyLogin={handleAgencyLogin}
          />
        } />
        <Route path="/agency/dashboard" element={
          currentAgency ? (
            <AgencyDashboard 
              agency={currentAgency}
              listings={listings}
              onUpdateListings={updateListings}
              onLogout={handleAgencyLogout}
            />
          ) : (
            <Navigate to="/agency/login" replace />
          )
        } />
        <Route path="/admin" element={
          currentUser?.isAdmin ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <AdminLogin onLogin={handleUserLogin} />
          )
        } />
        <Route path="/admin/dashboard" element={
          currentUser?.isAdmin ? (
            <AdminDashboard 
              listings={listings}
              agencies={agencies}
              complexes={complexes}
              onUpdateListings={updateListings}
              onUpdateAgencies={updateAgencies}
              onUpdateComplexes={updateComplexes}
              onLogout={handleUserLogout}
            />
          ) : (
            <Navigate to="/admin" replace />
          )
        } />
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;

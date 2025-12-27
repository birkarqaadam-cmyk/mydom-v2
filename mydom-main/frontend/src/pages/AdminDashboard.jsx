import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, BarChart3, Star, Trash2, LogOut, Search, Building2, Plus, Users, Copy, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { toast } from 'sonner';
import { formatPrice, generateAccessCode } from '../data/mockData';

export default function AdminDashboard({ listings, agencies, complexes, onUpdateListings, onUpdateAgencies, onUpdateComplexes, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [showComplexModal, setShowComplexModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [newAgency, setNewAgency] = useState({ name: '', phone: '', email: '', address: '', description: '' });
  const [newComplex, setNewComplex] = useState({ name: '', location: '', developer: '', totalApartments: '', priceFrom: '', description: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('mydom_user') || '{}');
    if (!user.isAdmin) navigate('/');
  }, [navigate]);

  const handleVipToggle = (id) => {
    onUpdateListings(listings.map(l => l.id === id ? { ...l, isVip: !l.isVip } : l));
    toast.success('VIP statusu yeniləndi');
  };

  const handleDeleteListing = (id) => { onUpdateListings(listings.filter(l => l.id !== id)); toast.success('Elan silindi'); setDeleteId(null); };
  const handleDeleteAgency = (id) => { onUpdateAgencies(agencies.filter(a => a.id !== id)); toast.success('Agentlik silindi'); };

  const handleAddAgency = (e) => {
    e.preventDefault();
    const agency = {
      id: `agency-${Date.now()}`,
      ...newAgency,
      accessCode: generateAccessCode(),
      logo: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
      listingsCount: 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onUpdateAgencies([...agencies, agency]);
    toast.success(`Agentlik əlavə edildi. Kod: ${agency.accessCode}`);
    setShowAgencyModal(false);
    setNewAgency({ name: '', phone: '', email: '', address: '', description: '' });
  };

  const handleAddComplex = (e) => {
    e.preventDefault();
    const complex = {
      id: `complex-${Date.now()}`,
      ...newComplex,
      totalApartments: parseInt(newComplex.totalApartments) || 0,
      priceFrom: parseInt(newComplex.priceFrom) || 0,
      image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      amenities: ['Park', 'Mühafizə'],
      status: 'Tikinti davam edir',
      isActive: true
    };
    onUpdateComplexes([...complexes, complex]);
    toast.success('Kompleks əlavə edildi');
    setShowComplexModal(false);
    setNewComplex({ name: '', location: '', developer: '', totalApartments: '', priceFrom: '', description: '' });
  };

  const copyCode = (code) => { navigator.clipboard.writeText(code); setCopiedCode(code); toast.success('Kod kopyalandı'); setTimeout(() => setCopiedCode(null), 2000); };
  const handleLogout = () => { onLogout(); navigate('/admin'); };

  const filtered = listings.filter(l => l.location.toLowerCase().includes(searchQuery.toLowerCase()) || l.type.toLowerCase().includes(searchQuery.toLowerCase()));
  const stats = { total: listings.length, vip: listings.filter(l => l.isVip).length, agency: listings.filter(l => l.isAgency).length, sale: listings.filter(l => l.category === 'sale').length, rent: listings.filter(l => l.category === 'rent').length, daily: listings.filter(l => l.category === 'daily').length };

  return (
    <div className="min-h-screen bg-gray-50 flex" data-testid="admin-dashboard">
      <aside className="admin-sidebar w-64 p-4 flex flex-col">
        <div className="mb-8">
          <Link to="/" className="logo-text text-2xl font-bold text-[#B91C1C]">Mydom</Link>
          <p className="text-gray-500 text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="space-y-2 flex-1">
          {[
            { id: 'listings', icon: FileText, label: 'İlanlar' },
            { id: 'agencies', icon: Users, label: 'Agentliklər' },
            { id: 'complexes', icon: Building2, label: 'Komplekslər' },
            { id: 'stats', icon: BarChart3, label: 'İstatistika' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`admin-sidebar-item w-full flex items-center gap-3 ${activeTab === item.id ? 'active' : ''}`}>
              <item.icon size={20} />{item.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="admin-sidebar-item w-full flex items-center gap-3 text-red-400 hover:text-red-500"><LogOut size={20} />Çıxış</button>
      </aside>

      <main className="flex-1 p-8">
        {activeTab === 'listings' && (
          <>
            <h1 className="text-2xl font-bold logo-text mb-6">İlanlar</h1>
            <div className="relative mb-6"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><Input placeholder="Axtar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 max-w-md" /></div>
            <div className="bg-white rounded-xl border overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Şəkil</TableHead><TableHead>Məkan</TableHead><TableHead>Növ</TableHead><TableHead>Kateqoriya</TableHead><TableHead>Qiymət</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Əməliyyat</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filtered.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell><img src={Array.isArray(l.images) ? l.images[0] : l.image} alt="" className="w-16 h-12 object-cover rounded" /></TableCell>
                      <TableCell className="font-medium">{l.location}</TableCell>
                      <TableCell>{l.type}</TableCell>
                      <TableCell><span className={`px-2 py-1 rounded text-xs ${l.category === 'rent' ? 'bg-blue-100 text-blue-600' : l.category === 'daily' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>{l.category === 'rent' ? 'Kirayə' : l.category === 'daily' ? 'Günlük' : 'Satış'}</span></TableCell>
                      <TableCell className="font-semibold text-[#B91C1C]">{formatPrice(l.price, l.category)}</TableCell>
                      <TableCell><div className="flex gap-1">{l.isVip && <Badge className="bg-yellow-100 text-yellow-700">VIP</Badge>}{l.isAgency && <Badge className="bg-blue-100 text-blue-700">Agentlik</Badge>}{l.ownerType === 'sahibinden' && <Badge className="bg-green-100 text-green-700">Sahibindən</Badge>}</div></TableCell>
                      <TableCell className="text-right"><div className="flex items-center justify-end gap-2"><Button variant="ghost" size="sm" onClick={() => handleVipToggle(l.id)} className={l.isVip ? 'text-yellow-500' : 'text-gray-400'}><Star size={18} fill={l.isVip ? 'currentColor' : 'none'} /></Button><AlertDialog open={deleteId === l.id} onOpenChange={(o) => !o && setDeleteId(null)}><AlertDialogTrigger asChild><Button variant="ghost" size="sm" onClick={() => setDeleteId(l.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Elanı silmək?</AlertDialogTitle><AlertDialogDescription>Geri qaytarıla bilməz.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Ləğv et</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteListing(l.id)} className="bg-red-500">Sil</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filtered.length === 0 && <div className="text-center py-12 text-gray-500">Elan tapılmadı</div>}
            </div>
          </>
        )}

        {activeTab === 'agencies' && (
          <>
            <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold logo-text">Agentliklər</h1><Button onClick={() => setShowAgencyModal(true)} className="bg-[#B91C1C] hover:bg-[#991B1B]"><Plus size={18} className="mr-2" />Agentlik Ekle</Button></div>
            <div className="bg-white rounded-xl border overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Ad</TableHead><TableHead>Giriş Kodu</TableHead><TableHead>Telefon</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Əməliyyat</TableHead></TableRow></TableHeader>
                <TableBody>
                  {agencies.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell><div className="flex items-center gap-2"><code className="px-2 py-1 bg-gray-100 rounded text-[#B91C1C]">{a.accessCode}</code><button onClick={() => copyCode(a.accessCode)} className="text-gray-400 hover:text-[#B91C1C]">{copiedCode === a.accessCode ? <Check size={16} /> : <Copy size={16} />}</button></div></TableCell>
                      <TableCell>{a.phone}</TableCell>
                      <TableCell><Badge className={a.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{a.isActive ? 'Aktiv' : 'Deaktiv'}</Badge></TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => handleDeleteAgency(a.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {activeTab === 'complexes' && (
          <>
            <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold logo-text">Yaşayış Kompleksləri</h1><Button onClick={() => setShowComplexModal(true)} className="bg-[#B91C1C] hover:bg-[#991B1B]"><Plus size={18} className="mr-2" />Kompleks Ekle</Button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complexes.map((c) => (
                <div key={c.id} className="bg-white rounded-xl border overflow-hidden">
                  <img src={c.image} alt={c.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{c.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">{c.location}</p>
                    <p className="text-sm text-gray-400 mb-3">{c.developer}</p>
                    <div className="flex justify-between"><span className="text-[#B91C1C] font-semibold">{c.priceFrom.toLocaleString()} AZN-dən</span><span className="text-xs text-gray-500">{c.totalApartments} mənzil</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'stats' && (
          <>
            <h1 className="text-2xl font-bold logo-text mb-6">İstatistika</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="stat-card p-5"><p className="text-sm text-gray-500">Ümumi</p><p className="text-2xl font-bold">{stats.total}</p></div>
              <div className="stat-card p-5"><p className="text-sm text-gray-500">VIP</p><p className="text-2xl font-bold text-yellow-500">{stats.vip}</p></div>
              <div className="stat-card p-5"><p className="text-sm text-gray-500">Agentlik</p><p className="text-2xl font-bold text-blue-500">{stats.agency}</p></div>
              <div className="stat-card p-5"><p className="text-sm text-gray-500">Satış</p><p className="text-2xl font-bold text-green-500">{stats.sale}</p></div>
              <div className="stat-card p-5"><p className="text-sm text-gray-500">Kirayə</p><p className="text-2xl font-bold text-blue-500">{stats.rent}</p></div>
              <div className="stat-card p-5"><p className="text-sm text-gray-500">Günlük</p><p className="text-2xl font-bold text-purple-500">{stats.daily}</p></div>
            </div>
          </>
        )}
      </main>

      <Dialog open={showAgencyModal} onOpenChange={setShowAgencyModal}>
        <DialogContent><DialogHeader><DialogTitle>Yeni Agentlik</DialogTitle></DialogHeader>
          <form onSubmit={handleAddAgency} className="space-y-4 pt-4">
            <div className="space-y-2"><Label>Ad *</Label><Input value={newAgency.name} onChange={(e) => setNewAgency({...newAgency, name: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Telefon *</Label><Input value={newAgency.phone} onChange={(e) => setNewAgency({...newAgency, phone: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={newAgency.email} onChange={(e) => setNewAgency({...newAgency, email: e.target.value})} /></div>
            <div className="space-y-2"><Label>Ünvan</Label><Input value={newAgency.address} onChange={(e) => setNewAgency({...newAgency, address: e.target.value})} /></div>
            <p className="text-xs text-gray-500">Giriş kodu avtomatik yaradılacaq</p>
            <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setShowAgencyModal(false)}>Ləğv et</Button><Button type="submit" className="bg-[#B91C1C] hover:bg-[#991B1B]">Əlavə et</Button></div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showComplexModal} onOpenChange={setShowComplexModal}>
        <DialogContent><DialogHeader><DialogTitle>Yeni Kompleks</DialogTitle></DialogHeader>
          <form onSubmit={handleAddComplex} className="space-y-4 pt-4">
            <div className="space-y-2"><Label>Ad *</Label><Input value={newComplex.name} onChange={(e) => setNewComplex({...newComplex, name: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Məkan *</Label><Input value={newComplex.location} onChange={(e) => setNewComplex({...newComplex, location: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Developer</Label><Input value={newComplex.developer} onChange={(e) => setNewComplex({...newComplex, developer: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Mənzil sayı</Label><Input type="number" value={newComplex.totalApartments} onChange={(e) => setNewComplex({...newComplex, totalApartments: e.target.value})} /></div>
              <div className="space-y-2"><Label>Başlanğıc qiymət</Label><Input type="number" value={newComplex.priceFrom} onChange={(e) => setNewComplex({...newComplex, priceFrom: e.target.value})} /></div>
            </div>
            <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setShowComplexModal(false)}>Ləğv et</Button><Button type="submit" className="bg-[#B91C1C] hover:bg-[#991B1B]">Əlavə et</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

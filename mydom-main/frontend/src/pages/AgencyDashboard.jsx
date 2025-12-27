import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Plus, Trash2, LogOut, Search, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { ImageDropzone } from '../components/ImageDropzone';
import { toast } from 'sonner';
import { formatPrice, propertyTypes } from '../data/mockData';

export default function AgencyDashboard({ agency, listings, onUpdateListings, onLogout }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    type: '', category: 'sale', rooms: '', area: '', floor: '', totalFloors: '', price: '', location: '', description: '', phone: agency.phone
  });

  const agencyListings = listings.filter(l => l.agencyId === agency.id);
  const filtered = agencyListings.filter(l => l.location.toLowerCase().includes(searchQuery.toLowerCase()) || l.type.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleLogout = () => { onLogout(); navigate('/'); };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.type || !form.price || !form.location) {
      toast.error('Zəruri sahələri doldurun');
      return;
    }

    const listing = {
      id: `listing-${Date.now()}`,
      ...form,
      rooms: parseInt(form.rooms) || 0,
      area: parseInt(form.area) || 0,
      floor: parseInt(form.floor) || 0,
      totalFloors: parseInt(form.totalFloors) || 0,
      price: parseInt(form.price) || 0,
      images: images.length > 0 ? images.map(i => i.publicUrl) : ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
      isVip: false,
      isAgency: true,
      agencyId: agency.id,
      agencyName: agency.name,
      userId: null,
      ownerType: 'agency',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onUpdateListings([listing, ...listings]);
    toast.success('Elan əlavə edildi');
    setShowAddModal(false);
    setForm({ type: '', category: 'sale', rooms: '', area: '', floor: '', totalFloors: '', price: '', location: '', description: '', phone: agency.phone });
    setImages([]);
  };

  const handleDelete = (id) => {
    onUpdateListings(listings.filter(l => l.id !== id));
    toast.success('Elan silindi');
    setDeleteId(null);
  };

  const stats = {
    total: agencyListings.length,
    sale: agencyListings.filter(l => l.category === 'sale').length,
    rent: agencyListings.filter(l => l.category === 'rent').length,
    daily: agencyListings.filter(l => l.category === 'daily').length
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" data-testid="agency-dashboard">
      <aside className="admin-sidebar w-64 p-4 flex flex-col">
        <div className="mb-8">
          <Link to="/" className="logo-text text-2xl font-bold text-[#B91C1C]">Mydom</Link>
          <p className="text-gray-500 text-sm mt-1">Agent Paneli</p>
        </div>
        <div className="mb-6 p-4 bg-white/10 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#B91C1C]/20 rounded-full flex items-center justify-center">
              <Building2 size={20} className="text-[#B91C1C]" />
            </div>
            <div>
              <p className="font-medium text-white">{agency.name}</p>
              <p className="text-xs text-gray-400">{agency.accessCode}</p>
            </div>
          </div>
        </div>
        <nav className="space-y-2 flex-1">
          <div className="admin-sidebar-item w-full flex items-center gap-3 active"><FileText size={20} />İlanlarım</div>
        </nav>
        <button onClick={handleLogout} className="admin-sidebar-item w-full flex items-center gap-3 text-red-400 hover:text-red-500">
          <LogOut size={20} />Çıxış
        </button>
      </aside>

      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card p-5"><p className="text-sm text-gray-500">Ümumi</p><p className="text-2xl font-bold">{stats.total}</p></div>
          <div className="stat-card p-5"><p className="text-sm text-gray-500">Satış</p><p className="text-2xl font-bold text-green-600">{stats.sale}</p></div>
          <div className="stat-card p-5"><p className="text-sm text-gray-500">Kirayə</p><p className="text-2xl font-bold text-blue-600">{stats.rent}</p></div>
          <div className="stat-card p-5"><p className="text-sm text-gray-500">Günlük</p><p className="text-2xl font-bold text-purple-600">{stats.daily}</p></div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold logo-text">İlanlarım</h1>
          <Button onClick={() => setShowAddModal(true)} className="bg-[#B91C1C] hover:bg-[#991B1B]" data-testid="add-listing-btn">
            <Plus size={18} className="mr-2" />İlan Əlavə et
          </Button>
        </div>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Axtar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 max-w-md" />
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Şəkil</TableHead>
                <TableHead>Məkan</TableHead>
                <TableHead>Növ</TableHead>
                <TableHead>Kateqoriya</TableHead>
                <TableHead>Qiymət</TableHead>
                <TableHead className="text-right">Əməliyyat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell><img src={Array.isArray(listing.images) ? listing.images[0] : listing.image} alt="" className="w-16 h-12 object-cover rounded" /></TableCell>
                  <TableCell className="font-medium">{listing.location}</TableCell>
                  <TableCell>{listing.type}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${listing.category === 'rent' ? 'bg-blue-100 text-blue-600' : listing.category === 'daily' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                      {listing.category === 'rent' ? 'Kirayə' : listing.category === 'daily' ? 'Günlük' : 'Satış'}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-[#B91C1C]">{formatPrice(listing.price, listing.category)}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog open={deleteId === listing.id} onOpenChange={(o) => !o && setDeleteId(null)}>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(listing.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={18} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Elanı silmək istəyirsiniz?</AlertDialogTitle>
                          <AlertDialogDescription>Bu əməliyyat geri qaytarıla bilməz.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(listing.id)} className="bg-red-500 hover:bg-red-600">Sil</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-500">Elan tapılmadı</div>}
        </div>
      </main>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="logo-text">Yeni Elan</DialogTitle></DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 pt-4">
            <ImageDropzone images={images} onImagesChange={setImages} maxFiles={5} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kateqoriya</Label>
                <Select value={form.category} onValueChange={(v) => setForm({...form, category: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Satış</SelectItem>
                    <SelectItem value="rent">Kirayə</SelectItem>
                    <SelectItem value="daily">Günlük</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Əmlak növü *</Label>
                <Select value={form.type} onValueChange={(v) => setForm({...form, type: v})}>
                  <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                  <SelectContent>{propertyTypes.map(t => <SelectItem key={t.id} value={t.label}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Otaq</Label><Input type="number" value={form.rooms} onChange={(e) => setForm({...form, rooms: e.target.value})} /></div>
              <div className="space-y-2"><Label>Sahə (m²)</Label><Input type="number" value={form.area} onChange={(e) => setForm({...form, area: e.target.value})} /></div>
              <div className="space-y-2"><Label>Qiymət *</Label><Input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Mərtəbə</Label><Input type="number" value={form.floor} onChange={(e) => setForm({...form, floor: e.target.value})} /></div>
              <div className="space-y-2"><Label>Ümumi mərtəbə</Label><Input type="number" value={form.totalFloors} onChange={(e) => setForm({...form, totalFloors: e.target.value})} /></div>
            </div>
            <div className="space-y-2"><Label>Ünvan *</Label><Input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} /></div>
            <div className="space-y-2"><Label>Təsvir</Label><Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} /></div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Ləğv et</Button>
              <Button type="submit" className="bg-[#B91C1C] hover:bg-[#991B1B]">Əlavə et</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

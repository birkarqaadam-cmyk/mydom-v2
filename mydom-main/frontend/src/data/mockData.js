// Mock Listings Data for MyDom Real Estate Platform - Final Version
export const mockListings = [
  {
    id: "1",
    price: 185000,
    category: "sale",
    location: "Nəsimi r., 28 May m.",
    type: "Yeni tikili",
    rooms: 3,
    area: 95,
    floor: 12,
    totalFloors: 18,
    images: ["https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"],
    isVip: true,
    isAgency: false,
    agencyId: null,
    agencyName: null,
    userId: "user-1",
    ownerType: "sahibinden",
    description: "Bakının mərkəzində, 28 May metrosuna yaxın ərazidə yerləşən bu təmtəraqlı mənzil sizin üçün ideal seçimdir. 95 kv.m sahəsi olan bu 3 otaqlı mənzil tam təmirli olub, yüksək keyfiyyətli materiallarla hazırlanmışdır. Geniş qonaq otağı ailənizlə vaxt keçirmək üçün ideal şərait yaradır. Mətbəx müasir avadanlıqlarla təchiz edilmişdir. Yataq otaqları geniş və işıqlıdır. Binada lift, 24 saat mühafizə və yeraltı qaraj mövcuddur.",
    phone: "+994501234567",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    price: 2500,
    category: "rent",
    location: "Yasamal r., Yeni Yasamal",
    type: "Mənzil",
    rooms: 2,
    area: 70,
    floor: 8,
    totalFloors: 16,
    images: ["https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg"],
    isVip: true,
    isAgency: true,
    agencyId: "agency-1",
    agencyName: "Premium Realty",
    userId: null,
    ownerType: "agency",
    description: "Yeni Yasamalda kirayə verilən bu modern mənzil qısamüddətli və ya uzunmüddətli kirayə üçün idealdır. Tam mebelli və texnika ilə təchiz edilmişdir. Geniş balkon şəhərin gözəl mənzərəsini açır. İnternet, kabel TV və kondisioner quraşdırılmışdır.",
    phone: "+994502345678",
    createdAt: "2024-01-14"
  },
  {
    id: "3",
    price: 320000,
    category: "sale",
    location: "Səbail r., Port Baku",
    type: "Yeni tikili",
    rooms: 4,
    area: 145,
    floor: 20,
    totalFloors: 25,
    images: ["https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg"],
    isVip: false,
    isAgency: true,
    agencyId: "agency-2",
    agencyName: "Baku Homes",
    userId: null,
    ownerType: "agency",
    description: "Port Baku Residence-da yerləşən bu lüks penthouse Bakının ən prestijli yaşayış kompleksində sizə eksklüziv həyat tərzi təqdim edir. 145 kv.m sahədə 4 geniş otaq, 3 hamam, ayrıca camaşırxana otağı mövcuddur. Panoramik pəncərələr Xəzər dənizinin əsrarəngiz mənzərəsini açır.",
    phone: "+994503456789",
    createdAt: "2024-01-13"
  },
  {
    id: "4",
    price: 150,
    category: "daily",
    location: "Səbail r., Fəvvarələr meydanı",
    type: "Mənzil",
    rooms: 2,
    area: 60,
    floor: 5,
    totalFloors: 9,
    images: ["https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg"],
    isVip: true,
    isAgency: false,
    agencyId: null,
    agencyName: null,
    userId: "user-2",
    ownerType: "sahibinden",
    description: "Fəvvarələr meydanının yaxınlığında günlük kirayəyə verilən bu mənzil turistlər və iş səfərləri üçün idealdır. Tam təmirli, mebelli və texnika ilə təchiz edilmişdir. WiFi, TV, kondisioner var. Bulvar 5 dəqiqəlik məsafədədir.",
    phone: "+994504567890",
    createdAt: "2024-01-12"
  },
  {
    id: "5",
    price: 450000,
    category: "sale",
    location: "Xəzər r., Mərdəkan",
    type: "Həyət evi",
    rooms: 5,
    area: 280,
    floor: 2,
    totalFloors: 2,
    images: ["https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg"],
    isVip: true,
    isAgency: false,
    agencyId: null,
    agencyName: null,
    userId: "user-3",
    ownerType: "sahibinden",
    description: "Mərdəkanda dənizə 500 metr məsafədə yerləşən bu möhtəşəm villa istirahət və daimi yaşayış üçün idealdır. 6 sot torpaq sahəsində 280 kv.m yaşayış sahəsi olan 2 mərtəbəli evdir. Hovuz, qaraj və gözəl bağça mövcuddur.",
    phone: "+994505678901",
    createdAt: "2024-01-11"
  },
  {
    id: "6",
    price: 1800,
    category: "rent",
    location: "Nərimanov r., Böyükşor",
    type: "Mənzil",
    rooms: 1,
    area: 45,
    floor: 6,
    totalFloors: 12,
    images: ["https://images.pexels.com/photos/4906520/pexels-photo-4906520.jpeg"],
    isVip: false,
    isAgency: true,
    agencyId: "agency-3",
    agencyName: "City Apartments",
    userId: null,
    ownerType: "agency",
    description: "Nərimanov rayonunda kirayəyə verilən bu studiya tipli mənzil tək yaşayan və ya cütlüklər üçün idealdır. Tam təmirli və mebelli olan mənzil modern üslubda dizayn edilmişdir.",
    phone: "+994506789012",
    createdAt: "2024-01-10"
  },
  {
    id: "7",
    price: 200,
    category: "daily",
    location: "Nəsimi r., 28 May",
    type: "Mənzil",
    rooms: 3,
    area: 85,
    floor: 10,
    totalFloors: 16,
    images: ["https://images.pexels.com/photos/6585625/pexels-photo-6585625.jpeg"],
    isVip: false,
    isAgency: true,
    agencyId: "agency-1",
    agencyName: "Premium Realty",
    userId: null,
    ownerType: "agency",
    description: "28 May metrosunun yaxınlığında günlük kirayəyə verilən geniş mənzil. Ailə və qruplar üçün idealdır. 3 otaq, 2 hamam, tam mebelli mətbəx. Bütün kommunikasiyalar var.",
    phone: "+994507890123",
    createdAt: "2024-01-09"
  },
  {
    id: "8",
    price: 95000,
    category: "sale",
    location: "Binəqədi r., 8-ci mkr",
    type: "Köhnə tikili",
    rooms: 2,
    area: 55,
    floor: 4,
    totalFloors: 9,
    images: ["https://images.pexels.com/photos/4161619/pexels-photo-4161619.jpeg"],
    isVip: false,
    isAgency: false,
    agencyId: null,
    agencyName: null,
    userId: "user-4",
    ownerType: "sahibinden",
    description: "Binəqədi rayonunda yerləşən bu 2 otaqlı mənzil gənc ailələr üçün əla başlanğıc seçimidir. Orta təmirli olsa da, bütün kommunikasiyalar işlək vəziyyətdədir.",
    phone: "+994508901234",
    createdAt: "2024-01-08"
  }
];

// Mock Agencies Data
export const mockAgencies = [
  {
    id: "agency-1",
    name: "Premium Realty",
    accessCode: "RMX-2024",
    phone: "+994551112233",
    email: "info@premiumrealty.az",
    address: "Bakı, Nəsimi r., Nizami küç. 25",
    logo: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
    description: "Bakının aparıcı daşınmaz əmlak agentliyi. 10 ildən artıq təcrübə.",
    listingsCount: 45,
    isActive: true,
    createdAt: "2024-01-01"
  },
  {
    id: "agency-2",
    name: "Baku Homes",
    accessCode: "BKH-5531",
    phone: "+994552223344",
    email: "contact@bakuhomes.az",
    address: "Bakı, Səbail r., Bünyad Sərdarov küç. 15",
    logo: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg",
    description: "Premium sinif mənzillər və villalar üzrə ixtisaslaşmış agentlik.",
    listingsCount: 32,
    isActive: true,
    createdAt: "2024-01-02"
  },
  {
    id: "agency-3",
    name: "City Apartments",
    accessCode: "CAP-9087",
    phone: "+994553334455",
    email: "hello@cityapartments.az",
    address: "Bakı, Nərimanov r., Təbriz küç. 8",
    logo: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    description: "Kirayə mənzillər üzrə lider agentlik. Günlük və aylıq kirayə.",
    listingsCount: 78,
    isActive: true,
    createdAt: "2024-01-03"
  }
];

// Mock Residential Complexes
export const mockComplexes = [
  {
    id: "complex-1",
    name: "Port Baku Residence",
    location: "Səbail r., Port Baku",
    developer: "Pasha Construction",
    totalApartments: 450,
    priceFrom: 250000,
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    description: "Bakının ən prestijli yaşayış kompleksi. Dəniz mənzərəsi, premium infrastruktur.",
    amenities: ["Hovuz", "Fitnes", "Spa", "Resepsiya 24/7", "Yeraltı qaraj"],
    status: "Hazır",
    isActive: true
  },
  {
    id: "complex-2",
    name: "Crescent Bay",
    location: "Xəzər r., Crescent Bay",
    developer: "Azinko Development",
    totalApartments: 280,
    priceFrom: 180000,
    image: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
    description: "Dəniz kənarında müasir yaşayış kompleksi. Ailələr üçün ideal.",
    amenities: ["Uşaq meydançası", "Park", "Supermarket", "Aptek"],
    status: "Tikinti davam edir",
    isActive: true
  },
  {
    id: "complex-3",
    name: "Ağ Şəhər Towers",
    location: "Xətai r., Ağ Şəhər",
    developer: "State Housing Agency",
    totalApartments: 800,
    priceFrom: 120000,
    image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg",
    description: "Müasir şəhər mərkəzində sərfəli qiymətlərlə mənzillər.",
    amenities: ["Metro yaxınlığı", "Park", "Məktəb", "Bağça"],
    status: "Hazır",
    isActive: true
  }
];

// Mock Users (for Sahibinden listings)
export const mockUsers = [
  {
    id: "user-1",
    name: "Əli",
    surname: "Həsənov",
    email: "ali@example.com",
    password: "password123",
    phone: "+994501234567",
    createdAt: "2024-01-01"
  }
];

// Location Data for Baku
export const bakuLocations = {
  rayonlar: {
    "Abşeron r.": ["Aşağı Güzdək", "Atyalı", "Ceyranbatan", "Çiçək", "Digah", "Fatmayı", "Görədil", "Güzdək", "Hökməli", "Köhnə Corat", "Qobu", "Masazır", "Mehdiabad", "Məmmədli", "Novxanı", "Pirəkəşkül", "Saray", "Yeni Corat", "Zuğulba"],
    "Binəqədi r.": ["2-ci Alatava", "28 May", "6-cı mkr", "7-ci mkr", "8-ci mkr", "9-cu mkr", "Biləcəri", "Binəqədi", "Xocəsən", "Xutor", "M.Ə.Rəsulzadə", "Sulutəpə"],
    "Xətai r.": ["Ağ şəhər", "Əhmədli", "Həzi Aslanov", "Köhnə Günəşli", "NZS"],
    "Xəzər r.": ["Binə", "Buzovna", "Dübəndi", "Gürgən", "Qala", "Mərdəkan", "Şağan", "Şimal DRES", "Şüvəlan", "Türkan", "Zirə"],
    "Qaradağ r.": ["Ələt", "Qızıldaş", "Qobustan", "Lökbatan", "Müşfiqabad", "Puta", "Sahil", "Səngəçal", "Şubanı"],
    "Nərimanov r.": ["Böyükşor", "Nərimanov"],
    "Nəsimi r.": ["1-ci mkr", "2-ci mkr", "3-cü mkr", "4-cü mkr", "5-ci mkr", "Kubinka"],
    "Nizami r.": ["8-ci km", "Keşlə"],
    "Sabunçu r.": ["Albalılıq", "Bakıxanov", "Balaxanı", "Bilgəh", "Kürdəxanı", "Maştağa", "Nardaran", "Pirşağı", "Ramana", "Sabunçu", "Savalan", "Sea Breeze", "Yeni Balaxanı", "Yeni Ramana", "Zabrat"],
    "Səbail r.": ["20-ci sahə", "Badamdar", "Bayıl", "Bibiheybət", "Şıxov"],
    "Suraxanı r.": ["Bahar", "Bülbülə", "Dədə Qorqud", "Əmircan", "Günəşli", "Hövsan", "Qaraçuxur", "Massiv A", "Massiv B", "Massiv D", "Massiv G", "Massiv V", "Suraxanı", "Şərq", "Yeni Günəşli", "Yeni Suraxanı", "Zığ"],
    "Yasamal r.": ["Yasamal", "Yeni Yasamal"]
  },
  metrolar: [
    "20 Yanvar", "28 May", "8 Noyabr", "Avtovağzal", "Azadlıq", "Bakmil", "Dərnəgül", "Elmlər", "Əhmədli", "Gənclik", "Həzi Aslanov", "Xalqlar", "Xocəsən", "İçəri Şəhər", "İnşaatçılar", "Koroğlu", "Qara Qarayev", "Memar Əcəmi", "Neftçilər", "Nəriman Nərimanov", "Nəsimi", "Nizami", "Sahil", "Xətai", "Ulduz"
  ],
  nisangahlar: [
    "Abşeron TM", "Ağ şəhər", "Axundov bağı", "ASAN 1", "Azadlıq meydanı", "BDU", "Fəvvarələr", "Filarmoniya", "Port Baku", "Sahil bağı"
  ]
};

// Other Cities
export const otherCities = [
  "Ağcabədi", "Ağdam", "Ağdaş", "Ağstafa", "Ağsu", "Astara", "Balakən", "Beyləqan", "Bərdə", "Biləsuvar", "Cəlilabad", "Daşkəsən", "Gədəbəy", "Gəncə", "Goranboy", "Göyçay", "Göygöl", "Hacıqabul", "Xaçmaz", "Xırdalan", "Xızı", "Xudat", "İmişli", "İsmayıllı", "Kürdəmir", "Qax", "Qazax", "Qəbələ", "Qobustan", "Quba", "Qusar", "Lerik", "Lənkəran", "Masallı", "Mingəçevir", "Naftalan", "Naxçıvan", "Neftçala", "Oğuz", "Saatlı", "Sabirabad", "Salyan", "Samux", "Siyəzən", "Sumqayıt", "Şabran", "Şamaxı", "Şəki", "Şəmkir", "Şirvan", "Şuşa", "Tərtər", "Tovuz", "Ucar", "Yardımlı", "Yevlax", "Zaqatala", "Zərdab"
];

// Property Types
export const propertyTypes = [
  { id: "menzil", label: "Mənzil", icon: "Building2" },
  { id: "yeni-tikili", label: "Yeni tikili", icon: "Building" },
  { id: "kohne-tikili", label: "Köhnə tikili", icon: "Warehouse" },
  { id: "heyet-evi", label: "Həyət evi", icon: "Home" },
  { id: "ofis", label: "Ofis", icon: "Briefcase" },
  { id: "qaraj", label: "Qaraj", icon: "Car" },
  { id: "torpaq", label: "Torpaq", icon: "Mountain" },
  { id: "obyekt", label: "Obyekt", icon: "Store" }
];

// Room options
export const roomOptions = ["1", "2", "3", "4", "5+"];

// Format price helper
export const formatPrice = (price, category) => {
  const formatted = price.toLocaleString('az-AZ');
  if (category === 'rent') {
    return `${formatted} AZN / ay`;
  }
  if (category === 'daily') {
    return `${formatted} AZN / gün`;
  }
  return `${formatted} AZN`;
};

// Generate access code
export const generateAccessCode = () => {
  const prefixes = ['RMX', 'BKH', 'CAP', 'AZR', 'PRO'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
};

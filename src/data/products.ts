export interface Product {
  id: string;
  name: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  mrp: number;
  discount: number; // percentage e.g. 36
  rating: number;
  reviewsCount: number;
  stock: number; // 0 = Out of stock
  description: string;
  images: string[]; // Owner uploaded/URL images; falls back to SVG placeholder when empty
  isBestSeller: boolean; // Admin star toggle
  isActive: boolean; // Admin Active/Hidden toggle
  createdAt: number; // Timestamp for "Naye Products" sorting
  illustrationType:
    | 'smartphone'
    | 'earbuds'
    | 'smartwatch'
    | 'laptop'
    | 'tshirt'
    | 'sneakers'
    | 'kurta'
    | 'backpack'
    | 'serum'
    | 'lipstick'
    | 'cookware'
    | 'bedsheet'
    | 'lamp'
    | 'mixer'
    | 'airfryer'
    | 'iron'
    | 'toycar'
    | 'plush'
    | 'almonds'
    | 'greenTea'
    | 'helmet'
    | 'carVacuum'
    | 'dumbbell'
    | 'yogaMat'
    | 'chair'
    | 'bookshelf'
    | 'book'
    | 'notebook'
    | 'scooter'
    | 'evBike';
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  specs: Record<string, string>;
}

export interface CategoryItem {
  slug: string;
  name: string;
  emoji: string;
  imageUrl?: string;
  bgColor: string;
  accentColor: string;
}

export interface BannerSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  priceTag: string;
  ctaText: string;
  targetLink: string;
  imageUrl?: string;
  gradient: string;
  accentColor: string;
  illustration: 'smartphone' | 'sneakers' | 'airfryer';
}

export interface StoreSettings {
  storeName: string;
  productTypeTagline: string;
  whatsappNumber: string;
  phoneNumber: string;
  storeAddress: string;
  storeTiming: string;
  deliveryFee: number;
  freeDeliveryAmount: number;
  deliveryAreaText: string;
  serviceablePincodes: string; // comma-separated list e.g. "400001, 110001, 560001"
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'MeraStore',
  productTypeTagline: 'Smart shopping, every day',
  whatsappNumber: '919876543210',
  phoneNumber: '+91 98765 43210',
  storeAddress: 'Shop No. 14, Main Market Road, Sector 18, Noida - 201301',
  storeTiming: 'Mon – Sun: 10:00 AM – 9:00 PM',
  deliveryFee: 40,
  freeDeliveryAmount: 499,
  deliveryAreaText: 'Local & Metro Areas (Same/Next Day)',
  serviceablePincodes: '400001, 110001, 560001, 500001, 411001, 302001, 226001, 700001, 201301',
};

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { slug: 'mobiles', name: 'Mobiles', emoji: '📱', bgColor: '#eef2ff', accentColor: '#4338ca' },
  { slug: 'electronics', name: 'Electronics', emoji: '🎧', bgColor: '#ede7f6', accentColor: '#5e35b1' },
  { slug: 'fashion', name: 'Fashion', emoji: '👕', bgColor: '#fff0f3', accentColor: '#e91e63' },
  { slug: 'appliances', name: 'Appliances', emoji: '🍳', bgColor: '#fff7ed', accentColor: '#f97316' },
  { slug: 'home', name: 'Home & Decor', emoji: '🏠', bgColor: '#e8f5e9', accentColor: '#15803d' },
  { slug: 'beauty', name: 'Beauty', emoji: '✨', bgColor: '#fce4ec', accentColor: '#d81b60' },
  { slug: 'sports-fitness', name: 'Fitness', emoji: '🏋️', bgColor: '#fbe9e7', accentColor: '#d84315' },
  { slug: 'books', name: 'Books', emoji: '📚', bgColor: '#fff3e0', accentColor: '#ef6c00' },
];

export const INITIAL_BANNERS: BannerSlide[] = [
  {
    id: 'banner-1',
    tag: 'NEW ARRIVALS',
    title: '5G Smartphones & Pro Audio',
    subtitle: 'Direct from our store with assured warranty & doorstep Cash on Delivery',
    priceTag: 'Starting ₹6,999',
    ctaText: 'Shop Mobiles',
    targetLink: '/category/mobiles',
    imageUrl: '',
    gradient: 'linear-gradient(135deg, #312e81 0%, #4338ca 60%, #6366f1 100%)',
    accentColor: '#f97316',
    illustration: 'smartphone',
  },
  {
    id: 'banner-2',
    tag: 'FRESH COLLECTION',
    title: 'Everyday Fashion & Running Sneakers',
    subtitle: '100% Cotton Tees, Ethnic Kurta Sets & Cushioned Footwear',
    priceTag: 'Min. 40% Off',
    ctaText: 'Explore Fashion',
    targetLink: '/category/fashion',
    imageUrl: '',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 55%, #4f46e5 100%)',
    accentColor: '#f97316',
    illustration: 'sneakers',
  },
  {
    id: 'banner-3',
    tag: 'KITCHEN & HOME',
    title: 'Digital Air Fryers & Home Appliances',
    subtitle: 'Upgrade your kitchen with genuine appliances & fast local delivery',
    priceTag: 'Up to 65% Off',
    ctaText: 'View Appliances',
    targetLink: '/category/appliances',
    imageUrl: '',
    gradient: 'linear-gradient(135deg, #1f2937 0%, #3730a3 60%, #4338ca 100%)',
    accentColor: '#f97316',
    illustration: 'airfryer',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'mob-1',
    name: 'NovaPulse X1 5G (Midnight Indigo, 128 GB, 8 GB RAM)',
    brand: 'NovaPulse',
    categorySlug: 'mobiles',
    categoryName: 'Mobiles',
    price: 13999,
    mrp: 21999,
    discount: 36,
    rating: 4.5,
    reviewsCount: 142,
    stock: 12,
    description:
      'Experience ultra-smooth 120Hz AMOLED display, 50MP OIS dual camera, and 5000 mAh battery with 67W fast charger included in the box.',
    images: [],
    isBestSeller: true,
    isActive: true,
    createdAt: 1710000120000,
    illustrationType: 'smartphone',
    gradientFrom: '#e0e7ff',
    gradientTo: '#c7d2fe',
    accentColor: '#4338ca',
    specs: {
      Processor: 'Octa-Core 6nm 5G Processor',
      Display: '6.67 inch FHD+ 120Hz AMOLED',
      RAM_Storage: '8 GB RAM | 128 GB Storage',
      Battery: '5000 mAh with 67W Charger',
      Warranty: '1 Year Store & Brand Warranty',
    },
  },
  {
    id: 'mob-2',
    name: 'Zenith Z9 Pro 5G (Titanium Slate, 256 GB, 12 GB RAM)',
    brand: 'Zenith',
    categorySlug: 'mobiles',
    categoryName: 'Mobiles',
    price: 22999,
    mrp: 32999,
    discount: 30,
    rating: 4.6,
    reviewsCount: 98,
    stock: 7,
    description:
      'Flagship curved AMOLED display smartphone with 108MP ProGrade camera, 12GB RAM, and 80W flash charging.',
    images: [],
    isBestSeller: true,
    isActive: true,
    createdAt: 1710000110000,
    illustrationType: 'smartphone',
    gradientFrom: '#ede9fe',
    gradientTo: '#ddd6fe',
    accentColor: '#3730a3',
    specs: {
      Processor: 'Flagship 4nm Octa-Core',
      Display: '6.7 inch 3D Curved AMOLED',
      RAM_Storage: '12 GB RAM | 256 GB UFS 3.1',
      Battery: '5500 mAh',
      Warranty: '1 Year Warranty',
    },
  },
  {
    id: 'elec-1',
    name: 'SonicPods Air Pro ANC True Wireless Earbuds (Matte Slate)',
    brand: 'SonicWave',
    categorySlug: 'electronics',
    categoryName: 'Electronics',
    price: 899,
    mrp: 2499,
    discount: 64,
    rating: 4.4,
    reviewsCount: 310,
    stock: 25,
    description:
      '32dB Active Noise Cancellation wireless earbuds with quad-mic clear calls, 50 hours total playback, and low-latency gaming mode.',
    images: [],
    isBestSeller: true,
    isActive: true,
    createdAt: 1710000100000,
    illustrationType: 'earbuds',
    gradientFrom: '#ede9fe',
    gradientTo: '#ddd6fe',
    accentColor: '#6d28d9',
    specs: {
      Connectivity: 'Bluetooth v5.3',
      Playtime: 'Up to 50 Hours with Case',
      Driver: '13mm Dynamic Bass Driver',
      Waterproof: 'IPX5 Sweat Resistant',
      Warranty: '1 Year Replacement Warranty',
    },
  },
  {
    id: 'elec-2',
    name: 'ChronoFit Ultra AMOLED Bluetooth Calling Smartwatch (Onyx)',
    brand: 'ChronoFit',
    categorySlug: 'electronics',
    categoryName: 'Electronics',
    price: 1199,
    mrp: 3999,
    discount: 70,
    rating: 4.3,
    reviewsCount: 215,
    stock: 18,
    description:
      '1.96-inch Super AMOLED Always-On Display smartwatch with single-chip Bluetooth calling, 110+ sports modes, and 24x7 heart rate tracking.',
    images: [],
    isBestSeller: false,
    isActive: true,
    createdAt: 1710000095000,
    illustrationType: 'smartwatch',
    gradientFrom: '#e0f2fe',
    gradientTo: '#bae6fd',
    accentColor: '#0369a1',
    specs: {
      Display: '1.96 inch 600 Nits AMOLED',
      Calling: 'Built-in Mic & Speaker',
      Strap: '22mm Soft Silicone',
      BatteryLife: 'Up to 7 Days',
    },
  },
  {
    id: 'fash-1',
    name: 'Men Oversized Heavy Gauge 100% Cotton Graphic T-Shirt (Navy)',
    brand: 'UrbanThread',
    categorySlug: 'fashion',
    categoryName: 'Fashion',
    price: 349,
    mrp: 999,
    discount: 65,
    rating: 4.4,
    reviewsCount: 184,
    stock: 30,
    description:
      '240 GSM combed bio-washed 100% pure cotton oversized drop-shoulder T-shirt for all-season everyday comfort.',
    images: [],
    isBestSeller: true,
    isActive: true,
    createdAt: 1710000090000,
    illustrationType: 'tshirt',
    gradientFrom: '#e0e7ff',
    gradientTo: '#a5b4fc',
    accentColor: '#3730a3',
    specs: {
      Fabric: '100% Bio-Washed Cotton (240 GSM)',
      Fit: 'Oversized Drop Shoulder',
      Sleeve: 'Half Sleeve',
      WashCare: 'Gentle Machine Wash',
    },
  },
  {
    id: 'fash-2',
    name: 'AirStride Pro Mesh Running & Training Sneakers (White/Orange)',
    brand: 'StrideX',
    categorySlug: 'fashion',
    categoryName: 'Fashion',
    price: 699,
    mrp: 1999,
    discount: 65,
    rating: 4.5,
    reviewsCount: 162,
    stock: 14,
    description:
      'Breathable engineered knit upper running shoes with high-rebound cushioned EVA sole and anti-skid rubber grip.',
    images: [],
    isBestSeller: true,
    isActive: true,
    createdAt: 1710000085000,
    illustrationType: 'sneakers',
    gradientFrom: '#ffedd5',
    gradientTo: '#fed7aa',
    accentColor: '#c2410c',
    specs: {
      UpperMaterial: 'Engineered Breathable Mesh',
      SoleMaterial: 'High-Rebound EVA + Rubber',
      Closure: 'Lace-Up',
      IdealFor: 'Running, Gym & Casual Wear',
    },
  },
  {
    id: 'fash-3',
    name: 'Women Embroidered Rayon Straight Kurta with Pant & Dupatta Set',
    brand: 'Ananya Studio',
    categorySlug: 'fashion',
    categoryName: 'Fashion',
    price: 649,
    mrp: 1899,
    discount: 66,
    rating: 4.5,
    reviewsCount: 129,
    stock: 0, // Out of stock example
    description:
      'Soft breathable viscose rayon straight kurta with delicate thread embroidery on the yoke, paired with matching trousers and printed dupatta.',
    images: [],
    isBestSeller: false,
    isActive: true,
    createdAt: 1710000080000,
    illustrationType: 'kurta',
    gradientFrom: '#fce7f3',
    gradientTo: '#fbcfe8',
    accentColor: '#be185d',
    specs: {
      Fabric: 'Viscose Rayon Blend',
      SetContents: '1 Kurta, 1 Pant, 1 Dupatta',
      Sleeve: '3/4th Sleeves',
      Pattern: 'Thread Embroidered',
    },
  },
  {
    id: 'app-1',
    name: '4.5L Digital Touch Air Fryer 1500W with 8 Preset Menus',
    brand: 'KitchPro',
    categorySlug: 'appliances',
    categoryName: 'Appliances',
    price: 2799,
    mrp: 6999,
    discount: 60,
    rating: 4.6,
    reviewsCount: 94,
    stock: 9,
    description:
      'Healthy oil-free frying and baking with 360° rapid hot air technology, digital touch panel, and non-stick detachable basket.',
    images: [],
    isBestSeller: true,
    isActive: true,
    createdAt: 1710000075000,
    illustrationType: 'airfryer',
    gradientFrom: '#fef3c7',
    gradientTo: '#fde68a',
    accentColor: '#b45309',
    specs: {
      Capacity: '4.5 Liters',
      Power: '1500 Watts',
      Controls: 'Digital LED Touch Panel',
      Warranty: '2 Years Store & Brand Warranty',
    },
  },
  {
    id: 'app-2',
    name: 'TurboGrind 750W Heavy Duty Mixer Grinder with 4 SS Jars',
    brand: 'KitchPro',
    categorySlug: 'appliances',
    categoryName: 'Appliances',
    price: 1699,
    mrp: 3999,
    discount: 58,
    rating: 4.4,
    reviewsCount: 118,
    stock: 11,
    description:
      '100% copper motor 750W heavy duty mixer grinder with 4 food-grade stainless steel jars for wet, dry, and chutney grinding.',
    images: [],
    isBestSeller: false,
    isActive: true,
    createdAt: 1710000070000,
    illustrationType: 'mixer',
    gradientFrom: '#ffedd5',
    gradientTo: '#fed7aa',
    accentColor: '#c2410c',
    specs: {
      Motor: '750W 100% Copper Motor',
      Jars: '4 Stainless Steel Jars',
      Speed: '3 Speed Control + Pulse',
      Warranty: '2 Years Product Warranty',
    },
  },
  {
    id: 'home-1',
    name: '300 TC Glace Cotton King Size Double Bedsheet with 2 Pillow Covers',
    brand: 'CasaLoom',
    categorySlug: 'home',
    categoryName: 'Home & Decor',
    price: 399,
    mrp: 1199,
    discount: 67,
    rating: 4.3,
    reviewsCount: 240,
    stock: 22,
    description:
      'Fade-resistant super soft brushed cotton king-size bedsheet (90 x 100 inches) with 2 matching pillow covers.',
    images: [],
    isBestSeller: false,
    isActive: true,
    createdAt: 1710000065000,
    illustrationType: 'bedsheet',
    gradientFrom: '#dcfce7',
    gradientTo: '#a7f3d0',
    accentColor: '#047857',
    specs: {
      Size: 'King Size (228 cm x 254 cm)',
      ThreadCount: '300 TC Micro-Cotton',
      Package: '1 Bedsheet + 2 Pillow Covers',
      Care: 'Machine Washable',
    },
  },
  {
    id: 'beau-1',
    name: '10% Niacinamide + 1% Zinc Clarifying Face Serum (30 ml)',
    brand: 'PureDerm',
    categorySlug: 'beauty',
    categoryName: 'Beauty',
    price: 249,
    mrp: 599,
    discount: 58,
    rating: 4.5,
    reviewsCount: 175,
    stock: 19,
    description:
      'Lightweight everyday clarifying face serum formulated with 10% Niacinamide and 1% Zinc PCA for clear, balanced skin.',
    images: [],
    isBestSeller: true,
    isActive: true,
    createdAt: 1710000060000,
    illustrationType: 'serum',
    gradientFrom: '#fce7f3',
    gradientTo: '#f5d0fe',
    accentColor: '#a21caf',
    specs: {
      Volume: '30 ml Dropper Bottle',
      SkinType: 'All Skin Types',
      Formula: 'Paraben & Fragrance Free',
      ShelfLife: '24 Months',
    },
  },
  {
    id: 'sport-1',
    name: '6mm Anti-Slip Eco TPE Yoga & Exercise Mat with Carry Strap',
    brand: 'FitCore',
    categorySlug: 'sports-fitness',
    categoryName: 'Fitness',
    price: 399,
    mrp: 999,
    discount: 60,
    rating: 4.4,
    reviewsCount: 88,
    stock: 15,
    description:
      'High-density 6mm cushioned non-slip workout and yoga mat with double-sided texture and free carry strap.',
    images: [],
    isBestSeller: false,
    isActive: true,
    createdAt: 1710000055000,
    illustrationType: 'yogaMat',
    gradientFrom: '#ffedd5',
    gradientTo: '#fdba74',
    accentColor: '#c2410c',
    specs: {
      Thickness: '6 mm High Density',
      Dimensions: '183 cm x 61 cm',
      Material: 'Sweat-Resistant Eco TPE',
      InTheBox: 'Yoga Mat + Carry Strap',
    },
  },
  {
    id: 'book-1',
    name: 'Mastering Daily Habits & Deep Focus (Paperback, English)',
    brand: 'Horizon Press',
    categorySlug: 'books',
    categoryName: 'Books',
    price: 179,
    mrp: 399,
    discount: 55,
    rating: 4.7,
    reviewsCount: 320,
    stock: 40,
    description:
      'A practical guide to building lasting daily habits, eliminating distractions, and achieving deep focus in work and life.',
    images: [],
    isBestSeller: true,
    isActive: true,
    createdAt: 1710000050000,
    illustrationType: 'book',
    gradientFrom: '#ffedd5',
    gradientTo: '#fdba74',
    accentColor: '#ea580c',
    specs: {
      Format: 'Paperback (312 Pages)',
      Language: 'English',
      Paper: 'Acid-Free Cream Paper',
      Publisher: 'Horizon Press',
    },
  },
];

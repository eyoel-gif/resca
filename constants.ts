import { Product, Seller, ListingTier } from './types';

export const CATEGORIES = [
  { id: 'all', name: 'All Equipment' },
  { id: 'cooking_equipment', name: 'Commercial Cooking' },
  { id: 'refrigeration', name: 'Refrigeration & Ice' },
  { id: 'food_prep', name: 'Food Preparation' },
  { id: 'beverage', name: 'Beverage & Coffee' },
  { id: 'furniture', name: 'Furniture & Seating' },
  { id: 'work_tables', name: 'Sinks & Tables' },
  { id: 'smallwares', name: 'Smallwares' },
];

export const LISTING_PACKAGES: Record<ListingTier, { name: string; price: number; photos: number; days: number; features: string[] }> = {
  basic: {
    name: 'Starter',
    price: 50,
    photos: 1,
    days: 30,
    features: ['1 Photo', 'Standard Visibility', '30 Days Active']
  },
  standard: {
    name: 'Professional',
    price: 150,
    photos: 5,
    days: 30,
    features: ['5 Photos', 'Priority Search', '30 Days Active', 'Analytics']
  },
  premium: {
    name: 'Kitchen King',
    price: 300,
    photos: 10,
    days: 30,
    features: ['10 Photos + 3D', 'Homepage Featured', '30 Days Active', 'Dedicated Support']
  }
};

// Mock Official Suppliers
export const MOCK_SUPPLIERS: Seller[] = [
  {
    id: 'shop_1',
    name: 'Addis Catering Supplies',
    type: 'supplier',
    isVerified: true,
    rating: 4.9,
    location: 'Bole, Friendship Bldg',
    memberSince: '2020',
    logo: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=1600',
    description: 'The #1 distributor of imported German and Italian kitchen machinery in Ethiopia. All items brand new with 2-year warranty.'
  },
  {
    id: 'shop_2',
    name: 'Ethio-Steel Manufactory',
    type: 'supplier',
    isVerified: true,
    rating: 4.7,
    location: 'Kality Industrial Zone',
    memberSince: '2019',
    logo: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&q=80&w=1600',
    description: 'Proudly Ethiopian manufactured stainless steel work tables, sinks, and shelving. Custom sizes available.'
  },
  {
    id: 'shop_3',
    name: 'Barista Pro Ethiopia',
    type: 'supplier',
    isVerified: true,
    rating: 5.0,
    location: 'Piassa',
    memberSince: '2021',
    logo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1600',
    description: 'Exclusive distributors for La Marzocco and Nuova Simonelli. Complete cafe fit-outs.'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  // --- COOKING EQUIPMENT ---
  {
    id: '1',
    title: 'Rational iCombi Pro 10-Pan (Electric)',
    description: 'The absolute gold standard for Ethiopian hotel kitchens. Intelligent cooking paths, self-cleaning, 3-phase connection. Barely used, removed from a closing 5-star hotel in Bole.',
    category: 'cooking_equipment',
    price: 850000,
    reserveAmount: 85000,
    condition: 'Refurbished',
    isRescaVerified: true,
    conditionReport: {
      grade: 'A',
      inspectorName: 'Dawit M.',
      inspectionDate: '2023-10-15',
      notes: 'Unit is pristine. Heating elements tested at full load for 30 mins. Gaskets are new.',
      videoUrl: 'https://example.com/video1' 
    },
    power: 'Electric (3-Phase)',
    images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1584269600522-b5e96f4c3d4a?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Capacity': '10 x 1/1 GN',
      'Voltage': '400V',
      'Control': 'Touchscreen',
      'Cleaning': 'iCareSystem',
      'Origin': 'Germany'
    },
    seller: {
      id: 's1',
      name: 'Addis Kitchen Sol.',
      type: 'individual',
      isVerified: true,
      rating: 4.8,
      location: 'Kera Hub',
      memberSince: '2021'
    },
    status: 'available',
    location: 'G744+XX Addis Ababa',
    isFeatured: true,
    viewCount: 142
  },
  {
    id: '2',
    title: 'Vulcan 36S-6B Endurance Gas Range',
    description: 'Heavy-duty 6-burner gas range with standard oven base. Stainless steel front, sides, and high shelf. Brand new unit.',
    category: 'cooking_equipment',
    price: 185000,
    reserveAmount: 18500,
    condition: 'New',
    isRescaVerified: true,
    power: 'Gas',
    images: ['https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Burners': '6 x 30,000 BTU',
      'Oven': 'Standard (Baker\'s Depth)',
      'Width': '36 Inches',
      'Gas Type': 'LPG / Natural'
    },
    seller: MOCK_SUPPLIERS[0], // Addis Catering Supplies
    status: 'available',
    location: 'Bole, Friendship Bldg',
    isFeatured: false,
    viewCount: 65,
    listingTier: 'premium',
    expiryDate: new Date(Date.now() + 86400000 * 20).toISOString() // 20 days left
  },
  {
    id: '8',
    title: 'Pitco 35C+ Economy Gas Fryer',
    description: '35-40lb oil capacity. Stainless steel tank. Thermostat maintains 200°F-400°F. Perfect for fast food / fried chicken spots.',
    category: 'cooking_equipment',
    price: 65000,
    reserveAmount: 6500,
    condition: 'Used (Good)',
    isRescaVerified: false,
    power: 'Gas',
    images: ['https://images.unsplash.com/photo-1528738064262-9860ebcf8e3f?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Oil Capacity': '35-40 lb',
      'BTU': '90,000',
      'Burners': '3 Tube',
      'Zone': 'Cold Zone'
    },
    seller: {
      id: 's3',
      name: 'Local Fabricator #4',
      type: 'individual',
      isVerified: false,
      rating: 4.2,
      location: 'Megenagna',
      memberSince: '2023'
    },
    status: 'available',
    location: 'Megenagna',
    isFeatured: false,
    viewCount: 56
  },
  {
    id: '25',
    title: 'Electric Salamander Broiler',
    description: 'Perfect for finishing dishes, melting cheese, and browning. Adjustable height heating element.',
    category: 'cooking_equipment',
    price: 32000,
    reserveAmount: 3200,
    condition: 'Refurbished',
    isRescaVerified: true,
    power: 'Electric (1-Phase)',
    images: ['https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Width': '600mm',
      'Power': '2.5kW',
      'Mounting': 'Wall or Counter'
    },
    seller: MOCK_SUPPLIERS[0],
    status: 'available',
    location: 'Bole',
    isFeatured: false,
    viewCount: 18
  },

  // --- BEVERAGE & COFFEE ---
  {
    id: '3',
    title: 'La Marzocco Linea Classic 2-Group',
    description: 'The workhorse of the Addis cafe scene. Custom matte black finish. Dual boiler system ensures temperature stability for back-to-back shots.',
    category: 'beverage',
    price: 450000,
    reserveAmount: 45000,
    condition: 'Used (Good)',
    isRescaVerified: true,
    conditionReport: {
      grade: 'B',
      inspectorName: 'Solomon T.',
      inspectionDate: '2023-10-12',
      notes: 'Pressure stable at 9 bars. Steam wand seal replaced. Minor scratches on side panel.',
    },
    power: 'Electric (1-Phase)',
    images: ['https://images.unsplash.com/photo-1521302200778-333686514cc4?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Groups': 2,
      'Boiler': 'Dual (Steam/Brew)',
      'PID': 'Yes',
      'Origin': 'Italy'
    },
    seller: {
      id: 's2',
      name: 'Tomoca Liquidators',
      type: 'individual',
      isVerified: true,
      rating: 4.9,
      location: 'Piassa',
      memberSince: '2020'
    },
    status: 'available',
    location: 'Piassa',
    isFeatured: true,
    viewCount: 210
  },
  {
    id: '10',
    title: 'Simonelli Nuova Simonelli Appia Life',
    description: '1-Group volumetric espresso machine. High group for takeaway cups. Reliable and consistent.',
    category: 'beverage',
    price: 210000,
    reserveAmount: 21000,
    condition: 'New',
    isRescaVerified: false,
    power: 'Electric (1-Phase)',
    images: ['https://images.unsplash.com/photo-1599580630732-2d182283a009?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Groups': 1,
      'Boiler': 'Heat Exchanger',
      'Volumetric': 'Yes',
      'Color': 'Black'
    },
    seller: MOCK_SUPPLIERS[2], // Barista Pro
    status: 'available',
    location: 'Piassa',
    isFeatured: false,
    viewCount: 67
  },
  {
    id: '17',
    title: 'Vitamix The Quiet One Blender',
    description: 'Commercial blender with sound enclosure. The ultimate blender for juice bars and coffee shops. Reduced noise for customer areas.',
    category: 'beverage',
    price: 65000,
    reserveAmount: 6500,
    condition: 'Refurbished',
    isRescaVerified: true,
    conditionReport: {
      grade: 'A',
      inspectorName: 'Dawit M.',
      inspectionDate: '2023-10-20',
      notes: 'Motor brushes replaced. Container is brand new. Sound cover clear.',
    },
    power: 'Electric (1-Phase)',
    images: ['https://images.unsplash.com/photo-1570222094114-28a9d88a27e6?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Power': '3 HP Motor',
      'Programs': '6 Pre-set',
      'Enclosure': 'Magnetic Sound Cover'
    },
    seller: MOCK_SUPPLIERS[2], // Barista Pro
    status: 'available',
    location: 'Piassa',
    isFeatured: true,
    viewCount: 120
  },

  // --- REFRIGERATION ---
  {
    id: '4',
    title: 'Hoshizaki KM-520MAJ Ice Machine',
    description: 'Produces up to 234kg of crescent cube ice per day. Air-cooled. Stainless steel evaporator. Essential for any serious bar or juice house.',
    category: 'refrigeration',
    price: 145000,
    reserveAmount: 14500,
    condition: 'Refurbished',
    isRescaVerified: false,
    power: 'Electric (1-Phase)',
    images: ['https://plus.unsplash.com/premium_photo-1664304859032-9cb5799a4c5a?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Output': '234kg / 24hr',
      'Ice Type': 'Crescent Cube',
      'Condenser': 'Air-Cooled',
      'Bin': 'Sold Separately'
    },
    seller: {
      id: 's4',
      name: 'ColdChain ET',
      type: 'individual',
      isVerified: true,
      rating: 4.5,
      location: 'Bole',
      memberSince: '2022'
    },
    status: 'available',
    location: 'Bole Medhanialem',
    isFeatured: false,
    viewCount: 45
  },
  {
    id: '6',
    title: 'True T-49-HC Reach-In Refrigerator',
    description: 'Double solid door stainless steel commercial refrigerator. Hydrocarbon refrigerant (eco-friendly). Maintains 0.5°C to 3.3°C.',
    category: 'refrigeration',
    price: 195000,
    reserveAmount: 19500,
    condition: 'Refurbished',
    isRescaVerified: false,
    power: 'Electric (1-Phase)',
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Doors': '2 Solid',
      'Capacity': '49 Cu. Ft.',
      'Compressor': 'Bottom Mounted',
      'Amps': '5.4'
    },
    seller: {
      id: 's4',
      name: 'ColdChain ET',
      type: 'individual',
      isVerified: true,
      rating: 4.5,
      location: 'Bole',
      memberSince: '2022'
    },
    status: 'available',
    location: 'Bole',
    isFeatured: false,
    viewCount: 112
  },
  {
    id: '18',
    title: 'Walk-In Cooler Unit (2m x 3m)',
    description: 'Complete walk-in cold room package. Includes panels, door, and refrigeration monoblock unit. Dismantled and ready for transport.',
    category: 'refrigeration',
    price: 350000,
    reserveAmount: 35000,
    condition: 'Used (Good)',
    isRescaVerified: true,
    power: 'Electric (1-Phase)',
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Dimensions': '2m x 3m x 2.2m',
      'Temp Range': '0°C to +5°C',
      'Panels': '100mm PU'
    },
    seller: {
        id: 's4',
        name: 'ColdChain ET',
        type: 'individual',
        isVerified: true,
        rating: 4.5,
        location: 'Bole',
        memberSince: '2022'
    },
    status: 'available',
    location: 'Bole',
    isFeatured: false,
    viewCount: 40
  },

  // --- FOOD PREP ---
  {
    id: '5',
    title: 'Hobart Legacy HL200 20qt Mixer',
    description: 'The legendary mixer. Gear-driven transmission, 3 speeds, includes stainless steel bowl, beater, and whip. Safety guard intact.',
    category: 'food_prep',
    price: 120000,
    reserveAmount: 12000,
    condition: 'Used (Fair)',
    isRescaVerified: true,
    conditionReport: {
      grade: 'C',
      inspectorName: 'Dawit M.',
      inspectionDate: '2023-09-30',
      notes: 'Motor runs smooth. Gearbox has slight noise in 3rd gear. Cosmetic paint chipping.',
    },
    power: 'Electric (1-Phase)',
    images: ['https://images.unsplash.com/photo-1589989823432-84336c243eb1?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Capacity': '20 Quarts',
      'Transmission': 'Gear-Driven',
      'Speeds': '3 + Stir',
      'Attachments': 'Included'
    },
    seller: {
      id: 's1',
      name: 'Addis Kitchen Sol.',
      type: 'individual',
      isVerified: true,
      rating: 4.8,
      location: 'Kera Hub',
      memberSince: '2021'
    },
    status: 'reserved',
    location: 'Kera Hub',
    isFeatured: false,
    viewCount: 88
  },
  {
    id: '7',
    title: 'Robot Coupe R2N Food Processor',
    description: 'Continuous feed combination food processor. 3qt gray bowl. Includes slicing and grating discs. Essential for fast onion/garlic prep.',
    category: 'food_prep',
    price: 45000,
    reserveAmount: 4500,
    condition: 'New',
    isRescaVerified: true,
    power: 'Electric (1-Phase)',
    images: ['https://images.unsplash.com/photo-1585834887346-60195c86689d?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Bowl Size': '3 Quart',
      'Speed': '1725 RPM',
      'Function': 'Cutter / Veg Prep',
      'Blade': 'S-Blade'
    },
    seller: MOCK_SUPPLIERS[0], // Addis Catering Supplies
    status: 'available',
    location: 'Bole, Friendship Bldg',
    isFeatured: false,
    viewCount: 34
  },
  {
    id: '19',
    title: 'Berkel Meat Slicer 12"',
    description: 'Manual gravity feed slicer. Red finish. Razor sharp blade. Classic Italian design.',
    category: 'food_prep',
    price: 42000,
    reserveAmount: 4200,
    condition: 'Refurbished',
    isRescaVerified: true,
    power: 'Electric (1-Phase)',
    images: ['https://images.unsplash.com/photo-1606756806654-20a89d9e623c?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Blade Size': '12 Inch',
      'Operation': 'Gravity Feed',
      'Safety': 'Ring Guard'
    },
    seller: {
        id: 's1',
        name: 'Addis Kitchen Sol.',
        type: 'individual',
        isVerified: true,
        rating: 4.8,
        location: 'Kera',
        memberSince: '2021'
    },
    status: 'available',
    location: 'Kera',
    isFeatured: false,
    viewCount: 25
  },
  {
    id: '20',
    title: 'Commercial Dough Mixer 20kg',
    description: 'Spiral mixer for bakery. 2 speeds. Stainless steel bowl and hook. Heavy duty.',
    category: 'food_prep',
    price: 110000,
    reserveAmount: 11000,
    condition: 'New',
    isRescaVerified: true,
    power: 'Electric (3-Phase)',
    images: ['https://images.unsplash.com/photo-1590059397658-292305580a61?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Flour Capacity': '20kg',
      'Bowl Volume': '60 Liters',
      'Speeds': '2'
    },
    seller: MOCK_SUPPLIERS[1],
    status: 'available',
    location: 'Kality',
    isFeatured: true,
    viewCount: 60
  },

  // --- SINKS & TABLES ---
  {
    id: '9',
    title: 'Regency 30" x 72" Work Table',
    description: '16-Gauge stainless steel commercial work table with undershelf. NSF listed. Ideal for plating and prep.',
    category: 'work_tables',
    price: 18000,
    reserveAmount: 1800,
    condition: 'New',
    isRescaVerified: true,
    power: 'Manual',
    images: ['https://images.unsplash.com/photo-1605461148293-896895eb4886?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Material': 'Stainless Steel',
      'Gauge': '16 Gauge',
      'Size': '30" x 72"',
      'Shelf': 'Galvanized Undershelf'
    },
    seller: MOCK_SUPPLIERS[1], // Ethio-Steel
    status: 'available',
    location: 'Kality Industrial Zone',
    isFeatured: false,
    viewCount: 22
  },
  {
    id: '11',
    title: 'Double Bowl Sink (200cm)',
    description: 'Heavy duty industrial sink with drainboard. High splashback. Manufactured in Addis Ababa.',
    category: 'work_tables',
    price: 24000,
    reserveAmount: 2400,
    condition: 'New',
    isRescaVerified: true,
    power: 'Manual',
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Material': '304 Stainless Steel',
      'Bowls': '2',
      'Drainboard': 'Right Side'
    },
    seller: MOCK_SUPPLIERS[1], // Ethio-Steel
    status: 'available',
    location: 'Kality Industrial Zone',
    isFeatured: false,
    viewCount: 15
  },

  // --- FURNITURE ---
  {
    id: '12',
    title: 'Industrial Metal Bar Stool (Set of 4)',
    description: 'Tolix style matte black metal bar stools. Stackable and durable. Perfect for cafes and bars.',
    category: 'furniture',
    price: 12000,
    reserveAmount: 1200,
    condition: 'New',
    isRescaVerified: true,
    power: 'Manual',
    images: ['https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Material': 'Powder Coated Steel',
      'Height': '30 Inches',
      'Color': 'Matte Black',
      'Stackable': 'Yes'
    },
    seller: MOCK_SUPPLIERS[0], // Addis Catering
    status: 'available',
    location: 'Bole',
    isFeatured: false,
    viewCount: 45
  },
  {
    id: '13',
    title: 'Mahogany Restaurant Dining Table',
    description: 'Solid wood 4-seater dining table with cast iron base. Elegant finish for fine dining.',
    category: 'furniture',
    price: 18500,
    reserveAmount: 1850,
    condition: 'Used (Good)',
    isRescaVerified: false,
    power: 'Manual',
    images: ['https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Material': 'Mahogany / Cast Iron',
      'Dimensions': '120cm x 80cm',
      'Seating': '4 Persons'
    },
    seller: {
        id: 's5',
        name: 'Blue Nile Hotel (Liquidation)',
        type: 'individual',
        isVerified: true,
        rating: 4.0,
        location: 'Kazanchis',
        memberSince: '2023'
    },
    status: 'available',
    location: 'Kazanchis',
    isFeatured: false,
    viewCount: 32
  },
  {
    id: '14',
    title: 'Red Leather Booth Seating (Double)',
    description: 'Classic diner style double booth. Vinyl upholstery, easy to clean. Structural integrity excellent, minor tear on back side (hidden).',
    category: 'furniture',
    price: 35000,
    reserveAmount: 3500,
    condition: 'Used (Fair)',
    isRescaVerified: true,
    conditionReport: {
      grade: 'C',
      inspectorName: 'Solomon T.',
      inspectionDate: '2023-11-01',
      notes: 'Vinyl tear on rear panel. Foam is firm. Wood frame solid.',
    },
    power: 'Manual',
    images: ['https://images.unsplash.com/photo-1550966871-3ed3c6227685?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Material': 'Vinyl / Wood',
      'Color': 'Red',
      'Width': '120cm',
      'Back Height': 'High Back'
    },
    seller: {
        id: 's5',
        name: 'Blue Nile Hotel (Liquidation)',
        type: 'individual',
        isVerified: true,
        rating: 4.0,
        location: 'Kazanchis',
        memberSince: '2023'
    },
    status: 'available',
    location: 'Kazanchis',
    isFeatured: false,
    viewCount: 15
  },

  // --- SMALLWARES ---
  {
    id: '15',
    title: 'Stainless Steel Stock Pot (100L)',
    description: 'Heavy duty commercial stock pot with lid. Tri-ply bottom for even heating. Essential for injera stew preparation.',
    category: 'smallwares',
    price: 8500,
    reserveAmount: 850,
    condition: 'New',
    isRescaVerified: true,
    power: 'Manual',
    images: ['https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Capacity': '100 Liters',
      'Material': '18/10 Stainless Steel',
      'Induction Ready': 'Yes'
    },
    seller: MOCK_SUPPLIERS[1], // Ethio-Steel
    status: 'available',
    location: 'Kality',
    isFeatured: false,
    viewCount: 89
  },
  {
    id: '16',
    title: 'Professional Chafing Dish Set (4 Pack)',
    description: 'Full size rectangular chafing dishes. Foldable frames. Includes fuel holders and water pans. Perfect for catering.',
    category: 'smallwares',
    price: 24000,
    reserveAmount: 2400,
    condition: 'New',
    isRescaVerified: true,
    power: 'Manual',
    images: ['https://plus.unsplash.com/premium_photo-1661778638971-d6021021bc6f?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Quantity': '4 Units',
      'Size': 'Full Size (8L)',
      'Finish': 'Mirror Polish'
    },
    seller: MOCK_SUPPLIERS[0],
    status: 'available',
    location: 'Bole',
    isFeatured: false,
    viewCount: 55
  },
  {
    id: '21',
    title: 'Wusthof Pro Knife Set (7pc)',
    description: 'High carbon stainless steel knives. Ergonomic grip. Includes chef knife, paring, bread, and honing steel.',
    category: 'smallwares',
    price: 9500,
    reserveAmount: 950,
    condition: 'New',
    isRescaVerified: true,
    power: 'Manual',
    images: ['https://images.unsplash.com/photo-1593618998160-e34015e672a9?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Pieces': '7',
      'Steel': 'German High Carbon',
      'Handle': 'Non-slip'
    },
    seller: MOCK_SUPPLIERS[0],
    status: 'available',
    location: 'Bole',
    isFeatured: false,
    viewCount: 110
  },
  {
    id: '22',
    title: 'Melamine Dinnerware Set (50pcs)',
    description: 'Break-resistant melamine plates and bowls. White with blue rim. Ideal for high-traffic cafeterias.',
    category: 'smallwares',
    price: 4500,
    reserveAmount: 450,
    condition: 'New',
    isRescaVerified: true,
    power: 'Manual',
    images: ['https://images.unsplash.com/photo-1603194073383-b097b61f8a85?auto=format&fit=crop&q=80&w=800'],
    specs: {
      'Material': 'Melamine',
      'Color': 'White/Blue',
      'Pieces': '50'
    },
    seller: MOCK_SUPPLIERS[0],
    status: 'available',
    location: 'Bole',
    isFeatured: false,
    viewCount: 20
  }
];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    maximumFractionDigits: 0,
  }).format(amount);
};
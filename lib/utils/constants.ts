/* ═══════════════════════════════════════════════════════
   AURUM RESTAURANT — Constants (All Configurable Data)
   Change these values to customize for any restaurant.
   ═══════════════════════════════════════════════════════ */

import type {
  Restaurant,
  Chef,
  FeaturedDish,
  TastingMenu,
  SeasonalDish,
  Experience,
  WineProgram,
  Testimonial,
  GalleryImage,
  QuickNavCard,
  MenuItem,
} from '@/lib/types';

/* ─── Restaurant Info ─── */

export const RESTAURANT: Restaurant = {
  name: 'AURUM',
  tagline: 'From Farm to Soul',
  taglineSubtitle: 'Stories in Every Bite',
  description:
    'Premium Indian fine dining celebrating regional culinary heritage through storytelling, sustainable sourcing, and culinary excellence.',
  website: 'https://aurum-restaurant.vercel.app',
  email: 'reservations@aurum.restaurant',
  phone: '+91 98765 43210',
  whatsapp: '+919876543210',
  address: {
    street: '42, The Lodhi Road, Central Delhi',
    city: 'New Delhi',
    postalCode: '110003',
    country: 'India',
    googleMapsUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.530059!2d77.2197!3d28.5931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM1JzM1LjIiTiA3N8KwMTMnMTAuOSJF!5e0!3m2!1sen!2sin!4v1700000000000',
  },
  hours: {
    monThu: { open: '12:00', close: '23:00' },
    friSat: { open: '12:00', close: '00:00' },
    sun: { open: '12:00', close: '22:30' },
  },
  social: {
    instagram: 'https://instagram.com/aurum.restaurant',
    facebook: 'https://facebook.com/aurum.restaurant',
    tiktok: 'https://tiktok.com/@aurum.restaurant',
  },
};

/* ─── Chef ─── */

export const CHEF: Chef = {
  name: 'Arjun Mehta',
  bio: `Born in the kitchens of Lucknow, raised on the spice trails of Kerala, and trained in the Michelin-starred restaurants of London — Chef Arjun Mehta brings three decades of culinary mastery to AURUM. His journey began watching his grandmother's hands transform simple ingredients into extraordinary feasts.

After graduating from Le Cordon Bleu and apprenticing under Gordon Ramsay and Gaggan Anand, Arjun returned to India with a singular vision: to elevate regional Indian cuisine to the global stage without losing its soul. Every dish at AURUM is a love letter to the farmers, the grandmothers, and the traditions that shaped Indian cooking.

At AURUM, Chef Arjun sources directly from 23 organic farms across India. His philosophy is simple — let the ingredients speak, honour the tradition, and add just enough modernity to surprise and delight.`,
  quote:
    'I don\'t cook food. I translate stories. Every spice has a village, every recipe has a grandmother, and every plate has a journey worth telling.',
  image: '/images/chef_portrait.webp',
  kitchenImage: '/images/kitchen_action.webp',
};

/* ─── Quick Nav Cards ─── */

export const QUICK_NAV_CARDS: QuickNavCard[] = [
  {
    title: 'Farm to Table',
    description: 'Sustainable sourcing from local farmers',
    icon: 'leaf',
    scrollTo: 'chef-story',
  },
  {
    title: 'Seasonal Menus',
    description: 'Limited-time hero dishes, menu evolution',
    icon: 'calendar',
    scrollTo: 'tasting-menus',
  },
  {
    title: "Chef's Table",
    description: 'Interactive experience, 8 guests',
    icon: 'utensils',
    scrollTo: 'experiences',
  },
  {
    title: 'Private Dining',
    description: 'Celebrate with dedicated space',
    icon: 'door',
    scrollTo: 'experiences',
  },
];

/* ─── Featured Dishes ─── */

export const FEATURED_DISHES: FeaturedDish[] = [
  {
    id: 1,
    name: 'Raan-e-Sikandari',
    tagline: 'Slow-cooked lamb leg',
    description:
      'Slow-roasted for 6 hours with Himalayan spices and ghee. A celebration of traditional Awadhi craftsmanship passed down through generations.',
    price: '₹2,200',
    image: '/images/menu_main_raan.webp',
    category: 'Main',
  },
  {
    id: 2,
    name: 'Coastal Prawn Masala',
    tagline: 'Kerala spice blend',
    description:
      'Tiger prawns from the Malabar coast, simmered in coconut and kokum gravy with curry leaves and mustard seeds. The taste of the Arabian Sea.',
    price: '₹1,800',
    image: '/images/dish-scallops.webp',
    category: 'Main',
  },
  {
    id: 3,
    name: 'Dal Makhani Royale',
    tagline: 'Creamy lentils, 48-hour preparation',
    description:
      'Black lentils slow-cooked for 48 hours with hand-churned butter and cream from our partner dairy in Amritsar. Silky, smoky perfection.',
    price: '₹850',
    image: '/images/menu_main_dal.webp',
    category: 'Main',
  },
  {
    id: 4,
    name: 'Mango Saffron Kulfi',
    tagline: 'Cardamom-infused dessert',
    description:
      'Alphonso mango reduction with Kashmiri saffron, pistachio crumble, and rose petal garnish. India\'s answer to gelato, reimagined.',
    price: '₹650',
    image: '/images/menu_dessert_kulfi.webp',
    category: 'Dessert',
  },
];

/* ─── Tasting Menus ─── */

export const TASTING_MENUS: TastingMenu[] = [
  {
    courses: 3,
    price: '₹2,500',
    description: 'A focused introduction to AURUM\'s philosophy',
    items: ['Amuse-bouche', 'Signature Main Course', 'Chef\'s Dessert'],
  },
  {
    courses: 5,
    price: '₹3,500',
    description: 'A deeper exploration of regional flavours',
    items: [
      'Amuse-bouche',
      'Seasonal Starter',
      'Signature Main Course',
      'Intermezzo Sorbet',
      'Grand Dessert',
    ],
  },
  {
    courses: 7,
    price: '₹4,500',
    description: 'The full AURUM journey with wine pairings',
    items: [
      'Amuse-bouche',
      'Cold Starter',
      'Warm Starter',
      'Fish Course',
      'Main Course',
      'Cheese & Palate Cleanser',
      'Grand Dessert with Petit Fours',
    ],
  },
];

/* ─── Seasonal Dishes ─── */

export const SEASONAL_DISHES: SeasonalDish[] = [
  {
    name: 'Wild Mushroom Galouti',
    description: 'Forest-foraged mushrooms, saffron reduction, gold leaf on ulta tawa paratha',
    seasonalIngredient: 'Wild Himalayan Mushrooms',
    availableUntil: 'August 2026',
  },
  {
    name: 'Monsoon Prawn Balchão',
    description: 'Goan heritage recipe with kokum and toddy vinegar, banana leaf presentation',
    seasonalIngredient: 'Monsoon Tiger Prawns',
    availableUntil: 'September 2026',
  },
  {
    name: 'Raw Mango Pannacotta',
    description: 'Aam panna-inspired, with black salt crumble and green chilli jelly',
    seasonalIngredient: 'Raw Rajapuri Mango',
    availableUntil: 'July 2026',
  },
];

/* ─── Experiences ─── */

export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    title: "Chef's Table",
    description:
      'Watch the magic happen. Interact with Chef Arjun as dishes are plated and paired. An intimate, front-row culinary theatre experience.',
    capacity: 8,
    duration: '3 hours',
    priceRange: '₹6,500 - ₹8,500 per person',
    image: '/images/exp_chefs_table.webp',
    cta: 'Reserve Your Seat',
  },
  {
    id: 2,
    title: 'Private Dining Room',
    description:
      'Your private sanctuary for celebrations. Custom menus, dedicated sommelier, and an ambiance designed for unforgettable moments.',
    capacity: 20,
    duration: 'Flexible',
    priceRange: 'From ₹15,000 (food additional)',
    image: '/images/exp_private_dining.webp',
    cta: 'Plan Your Celebration',
  },
  {
    id: 3,
    title: 'Wine Pairing Experience',
    description:
      'Crafted by our sommelier. Each course paired with Indian and international wines. Understanding, not just drinking.',
    capacity: 12,
    duration: '2.5 hours',
    priceRange: '₹3,500 - ₹5,500 per person',
    image: '/images/exp_wine_pairing.webp',
    cta: 'Book Wine Experience',
  },
  {
    id: 4,
    title: 'Seasonal Tasting Journey',
    description:
      '7-course odyssey through seasonal ingredients. Limited availability — book early to secure your place.',
    capacity: 30,
    duration: '3 hours',
    priceRange: '₹4,500 per person',
    image: '/images/exp_tasting_menu.webp',
    cta: 'Reserve This Season',
  },
];

/* ─── Wine & Beverage Program ─── */

export const WINE_PROGRAM: WineProgram = {
  philosophy:
    'We believe wine is about connection, not prestige. Our sommelier selects wines that enhance food, not overpower it. Every pairing tells a story of terroir meeting tradition.',
  cocktails: [
    {
      name: 'Masala Chai Old Fashioned',
      description: 'Single malt whiskey, cardamom tea infusion, jaggery syrup, Angostura bitters',
      price: '₹650',
    },
    {
      name: 'Saffron Gin Fizz',
      description: 'Saffron-infused gin, citrus, rose water, champagne float, edible gold',
      price: '₹750',
    },
    {
      name: 'Mango Lassi Royale',
      description: 'Aged rum, Alphonso mango, yogurt foam, cardamom, sparkling wine finish',
      price: '₹700',
    },
  ],
  wines: [
    {
      name: 'Sula Sauvignon Blanc',
      producer: 'Sula Vineyards',
      region: 'Nashik, India',
      notes: 'Citrus, tropical notes, crisp finish',
      price: '₹1,200 - ₹1,800',
    },
    {
      name: 'Grover La Réserve',
      producer: 'Grover Zampa',
      region: 'Nandi Hills, India',
      notes: 'Dark fruits, oak, elegant tannins',
      price: '₹2,200 - ₹3,000',
    },
    {
      name: 'Cloudy Bay Sauvignon Blanc',
      producer: 'Cloudy Bay',
      region: 'Marlborough, New Zealand',
      notes: 'Gooseberry, passion fruit, zesty acidity',
      price: '₹3,500 - ₹4,200',
    },
    {
      name: 'Château Margaux',
      producer: 'Château Margaux',
      region: 'Bordeaux, France',
      notes: 'Blackcurrant, violet, silky tannins, long finish',
      price: '₹12,000 - ₹18,000',
    },
    {
      name: 'Moët & Chandon Impérial',
      producer: 'Moët & Chandon',
      region: 'Champagne, France',
      notes: 'Green apple, citrus, brioche, fine bubbles',
      price: '₹6,500 - ₹8,000',
    },
  ],
  teaPairings: [
    { tea: 'Darjeeling First Flush', pairedWith: 'Cardamom Cake' },
    { tea: 'Assam Golden Tips', pairedWith: 'Spiced Mango Dessert' },
    { tea: 'Single-Origin Coffee (Chikmagalur)', pairedWith: 'Jaggery Chocolate Tart' },
  ],
};

/* ─── Testimonials ─── */

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Not just a meal. A story. Every dish speaks. Chef Arjun understands what it means to celebrate through food.',
    author: 'Priya Sharma, Mumbai',
    occasion: 'Anniversary Celebration',
    rating: 5,
  },
  {
    quote:
      'Took my parents to AURUM for their 40th wedding anniversary. My mother cried. That\'s how you know you\'ve done something right.',
    author: 'Rahul Verma, Gurgaon',
    occasion: 'Family Celebration',
    rating: 5,
  },
  {
    quote:
      'The wine pairing was impeccable. The sommelier didn\'t just serve wine — they educated us about it. That\'s premium service.',
    author: 'Anjali Kapoor, Delhi',
    occasion: 'Celebration & Wine Experience',
    rating: 5,
  },
];

/* ─── Gallery Images ─── */

export const GALLERY_IMAGES: GalleryImage[] = [
  // Ambiance
  { src: '/images/gallery-table.webp', alt: 'Restaurant interior with warm lighting', category: 'Ambiance', span: 'wide' },
  { src: '/images/interior.webp', alt: 'Elegant table setting with candles', category: 'Ambiance', span: 'tall' },
  { src: '/images/gallery-table.webp', alt: 'Private dining room setup', category: 'Ambiance' },
  { src: '/images/exp_celebration.webp', alt: 'Bar area with ambient lighting', category: 'Ambiance' },
  { src: '/images/gallery-table.webp', alt: 'Outdoor seating area', category: 'Ambiance' },
  // Food
  { src: '/images/menu_main_raan.webp', alt: 'Raan-e-Sikandari signature dish', category: 'Food', span: 'tall' },
  { src: '/images/dish-scallops.webp', alt: 'Coastal prawn masala plating', category: 'Food' },
  { src: '/images/menu_main_dal.webp', alt: 'Dal makhani in copper bowl', category: 'Food', span: 'wide' },
  { src: '/images/menu_dessert_kulfi.webp', alt: 'Mango saffron kulfi dessert', category: 'Food' },
  { src: '/images/menu_biryani_hyderabadi.webp', alt: 'Biryani with saffron and rose petals', category: 'Food' },
  { src: '/images/menu_starter_dahipuri.webp', alt: 'Tandoori platter close-up', category: 'Food', span: 'tall' },
  { src: '/images/menu_kebab_lambchops.webp', alt: 'Kebab plating artistry', category: 'Food' },
  { src: '/images/gallery-appetizer.webp', alt: 'Paneer tikka on skewers', category: 'Food', span: 'wide' },
  { src: '/images/dish-chocolate.webp', alt: 'Gulab jamun with gold leaf', category: 'Food' },
  { src: '/images/gallery-appetizer.webp', alt: 'Thali presentation', category: 'Food' },
  // Behind the Scenes
  { src: '/images/chef_portrait.webp', alt: 'Chef plating a dish', category: 'Behind-the-Scenes', span: 'tall' },
  { src: '/images/kitchen_action.webp', alt: 'Kitchen action with flames', category: 'Behind-the-Scenes', span: 'wide' },
  { src: '/images/kitchen_action.webp', alt: 'Spice preparation on granite', category: 'Behind-the-Scenes' },
  { src: '/images/gallery-chef.webp', alt: 'Team in the kitchen', category: 'Behind-the-Scenes' },
  { src: '/images/chef_portrait.webp', alt: 'Chef inspecting ingredients', category: 'Behind-the-Scenes' },
  // Ingredients
  { src: '/images/gallery-table.webp', alt: 'Fresh spices in market', category: 'Ingredients', span: 'wide' },
  { src: '/images/gallery-appetizer.webp', alt: 'Saffron threads close-up', category: 'Ingredients', span: 'tall' },
  { src: '/images/kitchen_action.webp', alt: 'Organic vegetables from farm', category: 'Ingredients' },
  { src: '/images/gallery-pasta.webp', alt: 'Fresh herbs and greens', category: 'Ingredients' },
  { src: '/images/dish-wagyu.webp', alt: 'Artful ingredient arrangement', category: 'Ingredients' },
  // Events
  { src: '/images/exp_celebration.webp', alt: 'Private celebration setup', category: 'Events', span: 'wide' },
  { src: '/images/exp_wine_pairing.webp', alt: 'Wine tasting evening', category: 'Events', span: 'tall' },
  { src: '/images/exp_tasting_menu.webp', alt: 'Guest celebration dinner', category: 'Events' },
  { src: '/images/exp_private_dining.webp', alt: 'Group dining experience', category: 'Events' },
  { src: '/images/exp_chefs_table.webp', alt: 'Anniversary dinner setup', category: 'Events' },
];

/* ─── Menu Items (Full Menu Page) ─── */

export const MENU_ITEMS: MenuItem[] = [
  // Starters
  {
    id: 'st-1', name: 'Galouti Kebab', description: 'Melt-in-your-mouth lamb kebabs with 36 spices, served on ulta tawa paratha with mint chutney and pickled onions.', price: '₹750', image: '/images/menu_starter_galouti.webp', category: 'starters', isAvailable: true, dietaryTags: [], spiceLevel: 2, badges: ['chef-special'], story: 'A recipe passed down from the royal kitchens of Lucknow.',
  },
  {
    id: 'st-2', name: 'Dahi Puri Deconstructed', description: 'Crisp semolina shells, spiced yogurt foam, tamarind gel, pomegranate dust, sev crumble.', price: '₹550', image: '/images/menu_starter_dahipuri.webp', category: 'starters', isAvailable: true, dietaryTags: ['vegetarian'], spiceLevel: 1, badges: ['vegetarian', 'new'],
  },
  {
    id: 'st-3', name: 'Tandoori Jhinga', description: 'Jumbo prawns marinated in hung curd, Kashmiri chilli, and fenugreek. Charred in the tandoor.', price: '₹950', image: '/images/dish-scallops.webp', category: 'starters', isAvailable: true, dietaryTags: [], spiceLevel: 2, badges: [],
  },
  {
    id: 'st-4', name: 'Paneer Tikka Truffle', description: 'Artisan paneer marinated with truffle oil and saffron, grilled to smoky perfection.', price: '₹700', image: '/images/gallery-appetizer.webp', category: 'starters', isAvailable: true, dietaryTags: ['vegetarian'], spiceLevel: 1, badges: ['vegetarian', 'chef-special'],
  },
  // Kebabs & Tandoor
  {
    id: 'kb-1', name: 'Seekh Kebab Gilafi', description: 'Minced lamb wrapped in bell peppers and onions, grilled over charcoal with roomali roti.', price: '₹850', image: '/images/menu_kebab_lambchops.webp', category: 'kebabs', isAvailable: true, dietaryTags: [], spiceLevel: 2, badges: [],
  },
  {
    id: 'kb-2', name: 'Murgh Malai Tikka', description: 'Cream cheese and cashew marinated chicken, cardamom-scented, char-grilled till golden.', price: '₹750', image: '/images/menu_starter_galouti.webp', category: 'kebabs', isAvailable: true, dietaryTags: [], spiceLevel: 1, badges: ['chef-special'],
  },
  {
    id: 'kb-3', name: 'Tandoori Lamb Chops', description: 'New Zealand lamb chops, 24-hour marination with raw papaya and yogurt, smoky tandoor finish.', price: '₹1,400', image: '/images/menu_main_raan.webp', category: 'kebabs', isAvailable: true, dietaryTags: [], spiceLevel: 2, badges: [],
  },
  // Biryanis
  {
    id: 'br-1', name: 'Hyderabadi Dum Biryani', description: 'Basmati rice layered with slow-cooked lamb, saffron, fried onions, and whole spices. Sealed with dough and dum-cooked.', price: '₹1,200', image: '/images/menu_biryani_hyderabadi.webp', category: 'biryanis', isAvailable: true, dietaryTags: [], spiceLevel: 2, badges: ['chef-special'],
  },
  {
    id: 'br-2', name: 'Lucknowi Awadhi Biryani', description: 'Fragrant basmati with tender goat meat, rose water, kewra, and ittar. The subtler, more refined biryani.', price: '₹1,100', image: '/images/menu_biryani_hyderabadi.webp', category: 'biryanis', isAvailable: true, dietaryTags: [], spiceLevel: 1, badges: [],
  },
  {
    id: 'br-3', name: 'Vegetable Tahiri', description: 'Seasonal vegetables with aged basmati, whole spices, and crispy fried onions. Our vegetarian biryani tribute.', price: '₹850', image: '/images/gallery-appetizer.webp', category: 'biryanis', isAvailable: true, dietaryTags: ['vegetarian'], spiceLevel: 1, badges: ['vegetarian'],
  },
  // Mains
  {
    id: 'mn-1', name: 'Raan-e-Sikandari', description: 'Whole lamb leg, slow-roasted 6 hours with Himalayan spices and desi ghee. Carved tableside. Serves 2-3.', price: '₹2,200', image: '/images/menu_main_raan.webp', category: 'mains', isAvailable: true, dietaryTags: [], spiceLevel: 2, badges: ['chef-special'],
  },
  {
    id: 'mn-2', name: 'Coastal Prawn Masala', description: 'Tiger prawns in coconut-kokum gravy with curry leaves and mustard tempering. Kerala on a plate.', price: '₹1,800', image: '/images/dish-scallops.webp', category: 'mains', isAvailable: true, dietaryTags: [], spiceLevel: 3, badges: ['spicy'],
  },
  {
    id: 'mn-3', name: 'Dal Makhani Royale', description: 'Black lentils, 48-hour slow cook, hand-churned Amritsari butter, kasoori methi. Silky perfection.', price: '₹850', image: '/images/menu_main_dal.webp', category: 'mains', isAvailable: true, dietaryTags: ['vegetarian'], spiceLevel: 1, badges: ['vegetarian', 'chef-special'],
  },
  {
    id: 'mn-4', name: 'Paneer Lababdar', description: 'Artisan paneer in creamy tomato-cashew gravy with touch of fenugreek. Rich, indulgent, and soulful.', price: '₹750', image: '/images/gallery-appetizer.webp', category: 'mains', isAvailable: true, dietaryTags: ['vegetarian'], spiceLevel: 1, badges: ['vegetarian'],
  },
  {
    id: 'mn-5', name: 'Murgh Tikka Butter Masala', description: 'Charcoal-grilled chicken tikka simmered in our signature tomato-butter sauce. The gold standard.', price: '₹950', image: '/images/dish-wagyu.webp', category: 'mains', isAvailable: true, dietaryTags: [], spiceLevel: 1, badges: [],
  },
  // Breads
  {
    id: 'bd-1', name: 'Garlic Butter Naan', description: 'Tandoor-baked with roasted garlic and Amritsari butter.', price: '₹180', image: '/images/dish-scallops.webp', category: 'breads', isAvailable: true, dietaryTags: ['vegetarian'], spiceLevel: 0, badges: ['vegetarian'],
  },
  {
    id: 'bd-2', name: 'Truffle Kulcha', description: 'Stuffed with truffle-infused potato, topped with micro greens.', price: '₹350', image: '/images/gallery-appetizer.webp', category: 'breads', isAvailable: true, dietaryTags: ['vegetarian'], spiceLevel: 0, badges: ['vegetarian', 'new'],
  },
  {
    id: 'bd-3', name: 'Lachha Paratha', description: 'Multi-layered, flaky, golden-fried whole wheat bread with desi ghee.', price: '₹150', image: '/images/menu_biryani_hyderabadi.webp', category: 'breads', isAvailable: true, dietaryTags: ['vegetarian'], spiceLevel: 0, badges: ['vegetarian'],
  },
  // Desserts
  {
    id: 'ds-1', name: 'Mango Saffron Kulfi', description: 'Alphonso mango, Kashmiri saffron, pistachio crumble, rose petal garnish. India\'s gelato, elevated.', price: '₹650', image: '/images/menu_dessert_kulfi.webp', category: 'desserts', isAvailable: true, dietaryTags: ['vegetarian'], spiceLevel: 0, badges: ['vegetarian', 'chef-special'],
  },
  {
    id: 'ds-2', name: 'Rose Gulab Jamun', description: 'Classic milk dumplings in cardamom-rose syrup with vanilla bean ice cream and pistachio dust.', price: '₹550', image: '/images/dish-chocolate.webp', category: 'desserts', isAvailable: true, dietaryTags: ['vegetarian'], spiceLevel: 0, badges: ['vegetarian'],
  },
  {
    id: 'ds-3', name: 'Jaggery Chocolate Tart', description: 'Dark Belgian chocolate with palm jaggery, sea salt, and Chikmagalur coffee ice cream.', price: '₹700', image: '/images/menu_dessert_kulfi.webp', category: 'desserts', isAvailable: true, dietaryTags: ['vegetarian'], spiceLevel: 0, badges: ['vegetarian', 'new'],
  },
  // Beverages
  {
    id: 'bv-1', name: 'Masala Chai Old Fashioned', description: 'Single malt whiskey, cardamom tea infusion, jaggery syrup, Angostura bitters.', price: '₹650', image: '/images/menu_bev_chai_old_fashioned.webp', category: 'beverages', isAvailable: true, dietaryTags: [], spiceLevel: 0, badges: ['chef-special'],
  },
  {
    id: 'bv-2', name: 'Saffron Gin Fizz', description: 'Saffron-infused gin, citrus, rose water, champagne float, edible gold.', price: '₹750', image: '/images/menu_bev_chai_old_fashioned.webp', category: 'beverages', isAvailable: true, dietaryTags: [], spiceLevel: 0, badges: [],
  },
  {
    id: 'bv-3', name: 'Mango Lassi Royale', description: 'Aged rum, Alphonso mango, yogurt foam, cardamom, sparkling wine finish.', price: '₹700', image: '/images/menu_bev_chai_old_fashioned.webp', category: 'beverages', isAvailable: true, dietaryTags: [], spiceLevel: 0, badges: ['new'],
  },
  {
    id: 'bv-4', name: 'Darjeeling First Flush Tea', description: 'Single-estate first flush, served in traditional style with honey and lemon.', price: '₹350', image: '/images/menu_bev_chai_old_fashioned.webp', category: 'beverages', isAvailable: true, dietaryTags: ['vegetarian'], spiceLevel: 0, badges: ['vegetarian'],
  },
];

/* ─── Menu Categories ─── */

export const MENU_CATEGORIES = [
  { id: 'starters', label: 'Starters' },
  { id: 'kebabs', label: 'Kebabs & Tandoor' },
  { id: 'biryanis', label: 'Biryanis' },
  { id: 'mains', label: 'Mains' },
  { id: 'breads', label: 'Breads' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'beverages', label: 'Beverages' },
] as const;

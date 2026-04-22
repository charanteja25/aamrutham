export const whatsappPhone = '919177266273';

export const HYD_PINCODES = [
  500001,500002,500003,500004,500005,500006,500007,500008,500009,500010,
  500011,500012,500013,500014,500015,500016,500017,500018,500019,500020,
  500021,500022,500023,500024,500025,500026,500027,500028,500029,500030,
  500031,500032,500033,500034,500035,500036,500037,500038,500039,500040,
  500041,500042,500043,500044,500045,500046,500047,500048,500049,500050,
  500051,500052,500053,500054,500055,500056,500057,500058,500059,500060,
  500061,500062,500063,500064,500065,500066,500067,500068,500069,500070,
  500071,500072,500073,500074,500075,500076,500077,500078,500079,500080,
  500081,500082,500083,500084,500085,500086,500087,500088,500089,500090,
  500091,500092,500093,500094,500095,500096,500097,500098,500099,500100,
  501301,501401,501501,501505,501506,502032
];

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
}

export const products = [
  {
    id: 'mettavalasa-peechu',
    name: 'Mettavalasa Peechu',
    telugu: 'మెట్టవలస పీచు',
    meaning: 'The Fibrous King from the Hills',
    shortTag: 'Signature Variety · Bobbili Farms',
    heroTag: 'Signature Variety · Heritage',
    description:
      'Named after the elevated village near Bobbili where cool nights concentrate sugars to extraordinary levels. Thick, silky fibrous strands carry an intense floral sweetness unlike anything you have tasted.',
    fullDescription:
      'A mango meant to be sucked, not sliced — a true childhood ritual you never forget. Grown through natural farming and ripened without carbide or chemical shortcuts.',
    badges: ['Brix 20–24', 'Fibrous Pulp', 'May – June', 'Pesticide-Free'],
    packPrices: [
      { label: '6 pcs', price: 699 },
      { label: '12 pcs', price: 1299 },
      { label: '18 pcs', price: 1799 }
    ],
    category: 'premium',
    image: '/assets/varieties/mettavalasa-peechu.jpg',
    accent: 'gold',
    gradient: 'linear-gradient(160deg, #fff3cd 0%, #ffd166 45%, #f4a835 100%)',
    story: {
      heading: 'The Story of Mettavalasa Peechu',
      p1: 'Named after the elevated village of Mettavalasa near Bobbili, this variety thrives on higher ground where cooler nights help concentrate sugars to extraordinary levels.',
      quote: '“You do not eat this mango — you drink it.”',
      p2: 'The silky fibrous strands carry intense floral sweetness best experienced the traditional way: sucked straight from the skin. It is messy, fragrant, and unforgettable.'
    },
    profile: [
      ['Texture', 'Juicy · Fibrous'],
      ['Aroma', 'Intense Floral'],
      ['Taste', 'Intensely Sweet'],
      ['Best Eaten', 'Sucked from skin'],
      ['Season', 'May – June'],
      ['Size', 'Medium · 180–260g']
    ],
    nutrition: [
      ['Calories', '65 kcal'],
      ['Carbohydrates', '16g'],
      ['Natural Sugar', '14g'],
      ['Protein', '0.9g'],
      ['Dietary Fibre', '1.8g'],
      ['Rich in', 'Vitamins C + A']
    ],
    storage: [
      ['Refrigerate after ripening', 'Once ripe, store at 8–12°C and consume within 3–4 days for best flavour.'],
      ['Room temperature ripening', 'If unripe on arrival, keep at room temperature for 1–2 days until fragrant.'],
      ['Avoid direct sunlight', 'Do not leave in direct sun or extreme heat because it accelerates over-ripening.'],
      ['Handle with care', 'Keep in the box until ready to eat so the fruit does not bruise.']
    ]
  },
  {
    id: 'bobbili-peechu',
    name: 'Bobbili Peechu',
    telugu: 'బొబ్బిలి పీచు',
    meaning: 'The Pride of Bobbili',
    shortTag: 'Heritage Variety · Same Land, Generations',
    heroTag: 'Heritage Variety · Fine-Fibrous',
    description:
      'Born from the red laterite soil of Bobbili, grown on the same land for generations. Rich amber pulp and fine fibres — almost silk threads of flavour.',
    fullDescription:
      'Farmers call it the mango that tastes like memory. Best squeezed and sipped straight from the skin.',
    badges: ['Brix 19–23', 'Fine-Fibrous', 'May – June', 'Pesticide-Free'],
    packPrices: [
      { label: '6 pcs', price: 699 },
      { label: '12 pcs', price: 1299 },
      { label: '18 pcs', price: 1799 }
    ],
    category: 'premium',
    image: '/assets/varieties/bobbili-peechu.jpg',
    accent: 'leaf',
    gradient: 'linear-gradient(160deg, #fff8e1 0%, #ffcc80 50%, #ff8f00 100%)',
    story: {
      heading: 'The Story of Bobbili Peechu',
      p1: 'Grown on the same red laterite soil of Bobbili for generations, Bobbili Peechu carries the weight of history in every bite. “Peechu” refers to its fine, thread-like fibres that weave through amber pulp.',
      quote: '“The mango that tastes like memory.”',
      p2: 'Sourced from Bobbili and naturally ripened on paddy straw, it keeps the texture, sweetness, and nostalgia that commercial fruit rarely preserves.'
    },
    profile: [
      ['Texture', 'Juicy · Fine-Fibrous'],
      ['Aroma', 'Rich & Floral'],
      ['Taste', 'Deep, Complex Sweet'],
      ['Best Eaten', 'Sucked from skin'],
      ['Season', 'May – June'],
      ['Size', 'Medium · 200–280g']
    ],
    nutrition: [
      ['Calories', '60 kcal'],
      ['Carbohydrates', '15g'],
      ['Natural Sugar', '13g'],
      ['Protein', '0.8g'],
      ['Dietary Fibre', '1.6g'],
      ['Rich in', 'Vitamins C + A']
    ],
    storage: [
      ['Refrigerate after ripening', 'Once ripe, store at 8–12°C and consume within 3–5 days.'],
      ['Room temperature ripening', 'If unripe on arrival, keep at room temperature for 1–2 days until fragrant.'],
      ['Avoid direct sunlight', 'Direct heat speeds up ripening too aggressively and softens the fruit.'],
      ['Handle with care', 'Keep in the provided box to prevent bruising.']
    ]
  },
  {
    id: 'kothapalli-kobbari',
    name: 'Kothapalli Kobbari',
    telugu: 'కొత్తపల్లి కొబ్బరి',
    meaning: 'The Coconut Mango',
    shortTag: 'Exotic · Nearly Unknown Outside Vizianagaram',
    heroTag: 'Exotic · Fiberless · Rare',
    description:
      '“Kobbari” means coconut in Telugu — and this variety earns that name. Creamy, fiberless pulp carries a faint but unmistakable coconut undertone below rich mango sweetness.',
    fullDescription:
      'Originating from Kothapalli village, this is one of the most unusual mangoes in the collection — an experience, not just a fruit.',
    badges: ['Brix 21–25', 'Fiberless', 'June – July', 'Pesticide-Free'],
    packPrices: [
      { label: '6 pcs', price: 849 },
      { label: '12 pcs', price: 1599 },
      { label: '18 pcs', price: 2099 }
    ],
    category: 'premium',
    image: '/assets/varieties/kothapalli-kobbari.jpg',
    accent: 'gold',
    gradient: 'linear-gradient(160deg, #fff9e5 0%, #ffe082 50%, #ffc107 100%)',
    story: {
      heading: 'The Story of Kothapalli Kobbari',
      p1: 'Nearly unknown outside Vizianagaram district, Kothapalli Kobbari is one of the rarest mango varieties in Andhra Pradesh. It is named for the subtle coconut character hidden in the flesh.',
      quote: '“An experience, not just a fruit.”',
      p2: 'Completely fiberless and cream-textured, it has a faint but unforgettable coconut undertone beneath rich mango sweetness. It is the kind of variety people remember for years.'
    },
    profile: [
      ['Texture', 'Creamy · Fiberless'],
      ['Aroma', 'Coconut Undertone'],
      ['Taste', 'Rich + Coconut Notes'],
      ['Best Eaten', 'Sliced or spooned'],
      ['Season', 'June – July'],
      ['Size', 'Medium · 220–300g']
    ],
    nutrition: [
      ['Calories', '68 kcal'],
      ['Carbohydrates', '17g'],
      ['Natural Sugar', '15g'],
      ['Protein', '0.8g'],
      ['Dietary Fibre', '1.2g'],
      ['Rich in', 'Vitamins C + B6']
    ],
    storage: [
      ['Refrigerate after ripening', 'Store at 8–12°C after ripening and consume within 3–5 days.'],
      ['Room temperature ripening', 'Let the fruit ripen naturally for 1–2 days if it reaches you firm.'],
      ['Avoid direct sunlight', 'Avoid harsh heat during ripening because it spoils texture.'],
      ['Handle with care', 'The creamy flesh bruises easily, so keep it nested in the box.']
    ]
  },
  {
    id: 'imam-pasand',
    name: 'Imam Pasand',
    telugu: 'ఇమామ్ పసంద్',
    meaning: 'Favourite of the Imam · Also known as Himayat',
    shortTag: 'Royal · The Deccan’s Finest',
    heroTag: 'Royal · Dessert Mango · Fiberless',
    description:
      'The royal mango of the Deccan. Saffron-hued, zero-fibre, creamy pulp with sweetness that is profound yet balanced.',
    fullDescription:
      'Available for only a brief peak-season window, Imam Pasand is one of the most sought-after fruits in the collection.',
    badges: ['Brix 18–22', 'Fiberless · Creamy', 'June – July', 'Royal Variety'],
    packPrices: [
      { label: '6 pcs', price: 999 },
      { label: '12 pcs', price: 1899 },
      { label: '18 pcs', price: 2699 }
    ],
    category: 'premium',
    image: '/assets/varieties/imam-pasand.jpg',
    accent: 'leaf',
    gradient: 'linear-gradient(160deg, #fff0e0 0%, #ffab76 45%, #e07b39 100%)',
    story: {
      heading: 'The Story of Imam Pasand',
      p1: 'Known as Himayat in parts of Andhra, Imam Pasand has been revered for centuries as one of the Deccan’s royal mangoes. Large, aromatic, and creamy, it delivers dessert-like richness without heaviness.',
      quote: '“Rare. Worth every bite.”',
      p2: 'Its brief seasonal availability makes it one of the most anticipated varieties every summer. The fruit is elegant, fragrant, and deeply memorable.'
    },
    profile: [
      ['Texture', 'Creamy · Custard-like'],
      ['Aroma', 'Saffron & Floral'],
      ['Taste', 'Profound Sweetness'],
      ['Best Eaten', 'Sliced or as dessert'],
      ['Season', 'June – July'],
      ['Size', 'Large · 400–600g']
    ],
    nutrition: [
      ['Calories', '70 kcal'],
      ['Carbohydrates', '18g'],
      ['Natural Sugar', '16g'],
      ['Protein', '1g'],
      ['Dietary Fibre', '1g'],
      ['Rich in', 'Vitamins C + A']
    ],
    storage: [
      ['Refrigerate after ripening', 'Once ripe, store at 8–12°C and consume within 4–6 days.'],
      ['Room temperature ripening', 'Keep at room temperature for 2–3 days if the fruit arrives firm.'],
      ['Avoid direct sunlight', 'Heat affects the creamy texture quickly, so store in a shaded cool area.'],
      ['Handle with care', 'Large fruit bruises easily and should stay cushioned in the box.']
    ]
  },
  {
    id: 'suvarnarekha',
    name: 'Suvarnarekha',
    telugu: 'సువర్ణరేఖ',
    meaning: 'The Golden Streak',
    shortTag: 'Visakhapatnam',
    description:
      'Fiberless, aromatic pulp with bright citrusy sweetness and a golden streak across the skin.',
    badges: ['Brix 18–21', 'Fiberless', 'May – June'],
    packPrices: [{ label: '12 pcs', price: 1499 }],
    category: 'more',
    image: '/assets/varieties/suvarnarekha.jpg',
    accent: 'gold',
    gradient: 'linear-gradient(160deg, #fff4c7 0%, #ffd760 55%, #f0a82b 100%)'
  },
  {
    id: 'banganapalli',
    name: 'Banganapalli',
    telugu: 'బంగినపల్లి',
    meaning: 'The People’s Mango',
    shortTag: 'Kurnool, Andhra Pradesh',
    description:
      'Large, smooth golden skin and fiberless flesh with mild honey sweetness and universal appeal.',
    badges: ['Brix 16–20', 'Fiberless', 'April – June'],
    packPrices: [{ label: '12 pcs', price: 1399 }],
    category: 'more',
    image: '/assets/varieties/banganapalli.jpg',
    accent: 'leaf',
    gradient: 'linear-gradient(160deg, #fff1cf 0%, #ffdd87 55%, #f5a623 100%)'
  },
  {
    id: 'chinna-rasalu',
    name: 'Chinna Rasalu',
    telugu: 'చిన్న రసాలు',
    meaning: 'The Little Nectar',
    shortTag: 'Nuzvid',
    description:
      'Small but intensely sweet with syrup-like pulp. A childhood favourite in many Telugu homes.',
    badges: ['Brix 22–26', 'Juicy', 'May – July'],
    packPrices: [{ label: '12 pcs', price: 1299 }],
    category: 'more',
    image: '/assets/varieties/chinna-rasalu.jpg',
    accent: 'gold',
    gradient: 'linear-gradient(160deg, #fff3db 0%, #ffc86d 55%, #eb8d23 100%)'
  },
  {
    id: 'pedda-rasalu',
    name: 'Pedda Rasalu',
    telugu: 'పెద్ద రసాలు',
    meaning: 'The Grand Nectar',
    shortTag: 'Nuzvid',
    description:
      'A larger, richer sibling to Chinna Rasalu with deeper amber pulp and lingering sweetness.',
    badges: ['Brix 20–24', 'Full-bodied', 'May – July'],
    packPrices: [{ label: '12 pcs', price: 1499 }],
    category: 'more',
    image: '/assets/varieties/pedda-rasalu.jpg',
    accent: 'leaf',
    gradient: 'linear-gradient(160deg, #fff0d2 0%, #ffbe62 55%, #de7e16 100%)'
  },
  {
    id: 'panduri-mavidi',
    name: 'Panduri Mavidi',
    telugu: 'పాండురి మావిడి',
    meaning: 'The Village Heirloom',
    shortTag: 'Pithapuram',
    description:
      'Buttery, aromatic flesh with floral sweetness and a deep heirloom character.',
    badges: ['Brix 23–28', 'Aromatic', 'May – June'],
    packPrices: [{ label: '12 pcs', price: 1699 }],
    category: 'more',
    image: '/assets/varieties/panduri-mavidi.jpg',
    accent: 'gold',
    gradient: 'linear-gradient(160deg, #fff8e0 0%, #ffd979 55%, #eeaa2a 100%)'
  },
  {
    id: 'children-mango-pack',
    name: 'Kids Mango Pack',
    telugu: 'పిల్లల మావిడి ప్యాక్',
    meaning: 'Little Mangoes for Little Ones',
    shortTag: 'For Ages 2–10 · Fun & Healthy',
    heroTag: 'Kids Special · Pack of 6',
    description:
      'Specially curated for children! Smaller, sweeter mangoes that are perfect for little hands. No fiber, easy to eat, and absolutely delicious. A healthy summer treat your kids will love!',
    fullDescription:
      'We have handpicked the sweetest, most kid-friendly mangoes for your little ones. These are smaller in size, completely fiberless, and have just the right amount of sweetness for children ages 2-10. Perfect for lunchboxes, summer snacks, and happy little faces!',
    badges: ['Pack of 6', 'Ages 2–10', 'Fiberless', 'Kid-Friendly'],
    packPrices: [
      { label: '6 pcs', price: 499 }
    ],
    category: 'premium',
    accent: 'gold',
    gradient: 'linear-gradient(160deg, #fff5e6 0%, #ffccbc 45%, #ffab91 100%)',
    isChildrenPack: true,
    story: {
      heading: 'The Story of Our Kids Mango Pack',
      p1: 'We know how much children love mangoes — and how difficult it can be to find the right one for them. Too big, too fibrous, too messy! That is why we created the Kids Mango Pack.',
      quote: '"The sweetest mangoes for the sweetest smiles."',
      p2: 'Each mango is carefully selected to be small, fiberless, and perfectly sweet — exactly what little ones need to enjoy mango season to the fullest.'
    },
    profile: [
      ['Size', 'Small · Kid-Friendly'],
      ['Texture', 'Smooth · Fiberless'],
      ['Aroma', 'Mild & Sweet'],
      ['Taste', 'Gentle Sweetness'],
      ['Best Eaten', 'Sliced or spooned'],
      ['Perfect For', 'Ages 2–10']
    ],
    storage: [
      ['Refrigerate after ripening', 'Store at 8–12°C once ripe and consume within 3–4 days.'],
      ['Room temperature ripening', 'Keep at room temperature for 1–2 days until fragrant.'],
      ['Serve chilled', 'Serving slightly chilled makes it extra refreshing for kids!'],
      ['Handle with care', 'Keep in the box until ready to eat to prevent bruising.']
    ]
  }
];

export const featuredVarieties = products.filter((product) => product.category === 'premium').slice(0, 3);

export const homeProcessSteps = [
  {
    title: 'Jeevamrutham Farming',
    text: 'We prepare and spray Jeevamrutham — a traditional fermented organic fertilizer made from desi cow dung, desi cow urine, jaggery, and pulse flour. Zero chemicals. Our trees are nourished the way nature intended.',
    icon: '🌿',
    image: '/assets/process/jeevamrutham-prepare-and-spray.png'
  },
  {
    title: 'Pollination & Flowering',
    text: 'When the blossoms open, bees and butterflies do their ancient work. We never intervene — the flowers that survive to fruit are the strongest the tree has to offer.',
    icon: '🌼',
    image: '/assets/process/pollination-and-flowering.png'
  },
  {
    title: 'Fruit Set',
    text: 'Tiny green mangoes begin forming on every branch. We give every mango the time it needs to fully mature on the tree. No shortcuts, no forced growth — only patience and care.',
    icon: '🥭',
    image: '/assets/process/tiny-fruit-set.png'
  },
  {
    title: 'Hand-Picked at Peak',
    text: 'Our farmers examine every mango by hand — feeling for the right give, checking colour, and smelling at the stem. Only when it is perfect does it leave the tree.',
    icon: '🧺',
    image: '/assets/process/examining-ripe-mangoes.png'
  },
  {
    title: 'Natural Ripening on Straw',
    text: 'Mangoes are laid on dry paddy straw and ripen at their own pace, uniformly, with no carbide or chemical ripening agents. The result is sweetness that cannot be faked.',
    icon: '🌾',
    image: '/assets/process/ripening-process.png'
  }
];

export const homeQualityBadges = [
  'Pesticide Free',
  'Hand Graded for Quality',
  'Peak Season Harvest',
  'Naturally Ripened',
  'Own Farm · Bobbili',
  'Hyderabad Delivery'
];

export function getProductById(id) {
  return products.find((product) => product.id === id);
}

// Season Pass Products
export const seasonPassProducts = [
  {
    id: 'season-pass-12',
    name: 'Season Pass - 12 PCs/Week',
    telugu: 'సీజన్ పాస్ - 12pcs/week',
    meaning: 'Weekly Fresh Mango Delivery',
    shortTag: '12 Premium Mangoes Every Week',
    heroTag: 'Season Pass · 12 PCs/Week',
    description:
      'Get 12 premium mangoes delivered to your doorstep every week throughout the season. Fresh harvest, hand-picked and naturally ripened — delivered weekly to your home.',
    fullDescription:
      'Never miss a mango season again. Your Season Pass ensures you get the finest mangoes delivered every week, curated from our heritage farms.',
    badges: ['12 PCs Weekly', 'Fresh Harvest', 'Doorstep Delivery', 'Cancel Anytime'],
    packPrices: [
      { label: '12 PCs/Week', price: 2499 }
    ],
    category: 'season-pass',
    accent: 'gold',
    gradient: 'linear-gradient(160deg, #e8f5e9 0%, #81c784 45%, #2e7d32 100%)',
    isSeasonPass: true,
    deliveriesPerWeek: 12,
    totalWeeks: 'Season duration'
  },
  {
    id: 'season-pass-24',
    name: 'Season Pass - 24 PCs/Week',
    telugu: 'సీజన్ పాస్ - 24pcs/week',
    meaning: 'Weekly Family Size Mango Delivery',
    shortTag: '24 Premium Mangoes Every Week',
    heroTag: 'Season Pass · 24 PCs/Week',
    description:
      'Perfect for families and mango lovers. Get 24 premium mangoes delivered every week — enough to share with family and friends throughout the season.',
    fullDescription:
      'The ultimate mango experience for families. 24 hand-picked, naturally ripened mangoes delivered weekly to your doorstep.',
    badges: ['24 PCs Weekly', 'Family Size', 'Doorstep Delivery', 'Cancel Anytime'],
    packPrices: [
      { label: '24 PCs/Week', price: 4499 }
    ],
    category: 'season-pass',
    accent: 'leaf',
    gradient: 'linear-gradient(160deg, #e8f5e9 0%, #66bb6a 45%, #1b5e20 100%)',
    isSeasonPass: true,
    deliveriesPerWeek: 24,
    totalWeeks: 'Season duration'
  }
];

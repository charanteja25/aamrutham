export const whatsappPhone = '917670826759';

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
      'A mango meant to be sucked, not sliced — a true childhood ritual you never forget. Grown through natural farming and ripened without carbide or chemical shortcuts. Mettavalasa Peechu is exceptionally rich in dietary fibre — far more than most fruits — making it as nourishing as it is delicious. Its natural fibre supports digestion, sustains energy, and makes every bite genuinely good for you.',
    badges: ['Brix 20-24', 'Fibrous Pulp', 'May - June', 'Pesticide-Free', 'Bobbili Origin'],
    packPrices: [
      { label: '6 pcs', price: 600 },
      { label: '12 pcs', price: 1200 },
      { label: '18 pcs', price: 1800 }
    ],
    category: 'premium',
    accent: 'gold',
    gradient: 'linear-gradient(160deg, #fff3cd 0%, #ffd166 45%, #f4a835 100%)',
    story: {
      heading: 'The Story of Mettavalasa Peechu',
      p1: 'In the quiet, fertile lands of Mettavalasa region from Bobbili, a rare mango variety has been cherished for generations. Grown on elevated terrain and shaped by time, this fruit carries the essence of its land in every bite.\n\nThis unique variety was brought from Mettavalasa region and grafted by Sala Sitarama Swamy, who first established it in his farm — laying the foundation for a legacy that continues to thrive.',
      quote: '"These trees are not just farms — they are living history."',
      p2: 'Today, that legacy lives on in Bobbili, where over 100-year-old mango trees are carefully preserved and nurtured by Kotagiri Vamsi Krishna.'
    },
    profile: [
      ['Texture', 'Juicy · Fibrous'],
      ['Aroma', 'Intense Floral'],
      ['Taste', 'Intensely Sweet'],
      ['Best Eaten', 'Hand Peeled'],
      ['Season', 'May - June'],
      ['Size', 'Medium · 180-260g']
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
      ['Refrigerate after ripening', 'Once ripe, store at 8-12°C and consume within 3-4 days for best flavour.'],
      ['Room temperature ripening', 'If unripe on arrival, keep at room temperature for 1-2 days until fragrant.'],
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
      'Farmers call it the mango that tastes like memory. Best squeezed and sipped straight from the skin. Bobbili Peechu is one of the richest natural sources of dietary fibre among all fruits — its fine, thread-like fibres are not just texture, they are nourishment. Regular consumption supports healthy digestion and sustained energy in a way that most commercial fruit simply cannot match.',
    badges: ['Brix 19-23', 'Fine-Fibrous', 'May - June', 'Pesticide-Free', 'Bobbili Origin'],
    packPrices: [
      { label: '6 pcs', price: 500 },
      { label: '12 pcs', price: 1000 },
      { label: '18 pcs', price: 1500 }
    ],
    category: 'premium',
    accent: 'leaf',
    gradient: 'linear-gradient(160deg, #fff8e1 0%, #ffcc80 50%, #ff8f00 100%)',
    extraImages: ['/assets/varieties/bobbili-peechu-2.jpg'],
    story: {
      heading: 'The Story of Bobbili Peechu',
      p1: 'Bobbili Peechu is known for its rich, juicy flavour and distinctive texture — a mango that carries both taste and tradition in every bite.\n\nBobbili Peechu is more than a mango — it is a story rooted in the legacy of the Bobbili Samsthanam.\n\nIt is said that Raja Ravu Swetachalapathi Ramakrishna Ranga Rao was once gifted two mango saplings of a variety known as Kallem Lo Mamidi by the Timmapuram Zamindar. Struck by its exceptional taste, he later named this variety "Bobbili Peechumanu."',
      quote: '"A mango named by a king, remembered by generations."',
      p2: 'This history has been shared and preserved by Ravu Venkata Swetha Chalapathi Kumar Krishna Ranga Rao, popularly known as Baby Nayana garu, the present-day scion of the Bobbili Samsthanam and grandson of the Raja.'
    },
    profile: [
      ['Texture', 'Juicy · Fine-Fibrous'],
      ['Aroma', 'Rich & Floral'],
      ['Taste', 'Deep, Complex Sweet'],
      ['Best Eaten', 'Hand Peeled'],
      ['Season', 'May - June'],
      ['Size', 'Medium · 200-280g']
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
      ['Refrigerate after ripening', 'Once ripe, store at 8-12°C and consume within 3-5 days.'],
      ['Room temperature ripening', 'If unripe on arrival, keep at room temperature for 1-2 days until fragrant.'],
      ['Avoid direct sunlight', 'Direct heat speeds up ripening too aggressively and softens the fruit.'],
      ['Handle with care', 'Keep in the provided box to prevent bruising.']
    ]
  },
  {
    id: 'panduri-mavidi',
    name: 'Panduri Mavidi',
    telugu: 'పాండురి మావిడి',
    meaning: 'The Village Heirloom',
    shortTag: 'Signature Variety · Pithapuram',
    heroTag: 'Signature Variety · Heirloom · Aromatic',
    description:
      'Buttery, aromatic flesh with floral sweetness and a deep heirloom character.',
    badges: ['Brix 23-28', 'Aromatic', 'Intensely Sweet', 'May - June', 'Pesticide-Free'],
    packPrices: [
      { label: '6 pcs', price: 600 },
      { label: '12 pcs', price: 1150 },
      { label: '18 pcs', price: 1700 }
    ],
    category: 'premium',
    accent: 'gold',
    gradient: 'linear-gradient(160deg, #fff8e0 0%, #ffd979 55%, #eeaa2a 100%)',
    extraImages: ['/assets/varieties/panduri-mavidi-2.jpg'],
    story: {
      heading: 'The Story of Panduri Mavidi',
      p1: 'Pandurivari mango is a rare, ancient variety once grown in the royal gardens of Andhra. Kings not only enjoyed its unique taste but also carefully preserved these trees, sharing the fruit with close circles and allied kingdoms as a symbol of pride and lineage.\n\nThese trees grow up to 100 feet tall and live for hundreds of years, with some still standing today in the Godavari regions. The fruit is small in size, but rich in flavour — and unlike most mangoes, it does not change colour when it ripens.\n\nThere are many stories about its origin. One says a mango was stolen from a royal orchard and planted in the Velagathuru region, from where it spread through grafting. Even today, families in the Godavari belt continue the tradition of sharing this mango as a mark of heritage.',
      quote: '"A fruit once valued by kings, now slowly finding its way back."',
      p2: 'Over time, this variety nearly disappeared. Today, through the efforts of farmers, nurseries, and conscious growing, it is slowly being revived.\n\nAt Aamrutham, we bring this mango to you not just for its taste, but to preserve a variety once valued by kings and rooted in our land.'
    },
    profile: [
      ['Texture', 'Buttery · Smooth'],
      ['Aroma', 'Floral & Deep'],
      ['Taste', 'Dessert-Sweet'],
      ['Best Eaten', 'Hand Peeled'],
      ['Season', 'May - June'],
      ['Size', 'Medium · 180-260g']
    ],
    nutrition: [
      ['Calories', '72 kcal'],
      ['Carbohydrates', '18g'],
      ['Natural Sugar', '16g'],
      ['Protein', '1g'],
      ['Dietary Fibre', '1.3g'],
      ['Rich in', 'Vitamins A + C']
    ],
    storage: [
      ['Refrigerate after ripening', 'Store at 8-12°C once ripe and consume within 3-4 days.'],
      ['Room temperature ripening', 'Ripen at room temperature 1-2 days if firm on arrival.'],
      ['Avoid direct sunlight', 'High sugar content means it over-ripens quickly in heat.'],
      ['Handle with care', 'Butter-soft flesh bruises easily — leave in box until ready.']
    ]
  },
  {
    id: 'kothapalli-kobbari',
    name: 'Kothapalli Kobbari',
    telugu: 'కొత్తపల్లి కొబ్బరి',
    meaning: 'The Coconut Mango',
    shortTag: 'Exotic · Nearly Unknown Outside Vizianagaram',
    heroTag: 'Exotic · Full of Fibre · Rare',
    description:
      '"Kobbari" means coconut in Telugu — and this variety earns that name. Creamy, fiberless pulp carries a faint but unmistakable coconut undertone below rich mango sweetness.',
    fullDescription:
      'Originating from Kothapalli village, this is one of the most unusual mangoes in the collection — an experience, not just a fruit. Kothapalli Kobbari is remarkably high in dietary fibre, setting it apart from most fruits. Its fibre-dense flesh supports digestion, aids gut health, and makes it one of the healthiest mangoes you can eat — a rare combination of extraordinary flavour and genuine nutritional benefit.',
    badges: ['Brix 21-25', 'Full of Fibre', 'June - July', 'Pesticide-Free'],
    packPrices: [
      { label: '6 pcs', price: 500 },
      { label: '12 pcs', price: 950 },
      { label: '18 pcs', price: 1400 }
    ],
    category: 'premium',
    accent: 'gold',
    gradient: 'linear-gradient(160deg, #fff9e5 0%, #ffe082 50%, #ffc107 100%)',
    extraImages: ['/assets/varieties/kothapalli-kobbari-2.jpg', '/assets/varieties/kothapalli-kobbari-3.jpg'],
    story: {
      heading: 'The Story of Kothapalli Kobbari',
      p1: 'From the coastal belt of Kakinada, in a small village called Kothapalli, comes a mango unlike any other. Centuries ago, the entire Kothapalli region of East Godavari district had only a single tree of this variety — and from that one tree, a legacy was born.\n\nKnown as Kothapalli Kobbari, this rare regional cultivar carries a signature that surprises everyone who tastes it — a gentle, natural aroma reminiscent of tender coconut. In Telugu, "Kobbari" means coconut, and this mango lives up to its name with every bite.',
      quote: '"One tree. One village. One flavour the world almost never knew."',
      p2: 'What makes this variety truly special is its versatility. With its thin peel, high fibre content, and small seed, the raw mango is prized for pickling — the high fibre gives the pickle an exceptionally long shelf life, making it a favourite among pickle makers. When ripe, it is rich and aromatic, and was traditionally presented as a gift to VIPs — a fruit reserved for those worth honouring.'
    },
    profile: [
      ['Texture', 'Creamy · Full of Fibre'],
      ['Aroma', 'Coconut Undertone'],
      ['Taste', 'Rich + Coconut Notes'],
      ['Best Eaten', 'Hand Peeled'],
      ['Season', 'June - July'],
      ['Size', 'Medium · 220-300g']
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
      ['Refrigerate after ripening', 'Store at 8-12°C after ripening and consume within 3-5 days.'],
      ['Room temperature ripening', 'Let the fruit ripen naturally for 1-2 days if it reaches you firm.'],
      ['Avoid direct sunlight', 'Avoid harsh heat during ripening because it spoils texture.'],
      ['Handle with care', 'The creamy flesh bruises easily, so keep it nested in the box.']
    ]
  },
  {
    id: 'imam-pasand',
    name: 'Imam Pasand',
    telugu: 'ఇమామ్ పసంద్',
    meaning: 'Favourite of the Imam · Also known as Himayat',
    shortTag: "Royal · The Deccan's Finest",
    heroTag: 'Royal · Dessert Mango · Cut Variety',
    description:
      'The royal mango of the Deccan. Saffron-hued, zero-fibre, creamy pulp with sweetness that is profound yet balanced.',
    fullDescription:
      'Available for only a brief peak-season window, Imam Pasand is one of the most sought-after fruits in the collection.',
    badges: ['Brix 18-22', 'Fiberless · Creamy', 'June - July', 'Royal Variety'],
    packPrices: [
      { label: '6 pcs', price: 600 },
      { label: '12 pcs', price: 1200 },
      { label: '18 pcs', price: 1800 }
    ],
    category: 'premium',
    accent: 'leaf',
    gradient: 'linear-gradient(160deg, #fff0e0 0%, #ffab76 45%, #e07b39 100%)',
    extraImages: ['/assets/varieties/imam-pasand-2.jpg', '/assets/varieties/imam-pasand-3.jpg'],
    story: {
      heading: 'The Story of Imam Pasand',
      p1: 'Imam Pasand — also known as Himayat in Andhra Pradesh and Telangana — is one of the most celebrated mango varieties in India. Its name translates to "The Favourite of the Imam," a title that speaks to centuries of royal reverence.\n\nSome accounts trace this variety to the courts of Mughal Emperor Humayun, where it was called "Humayun Pasand." Others say it was the Nawabs of Hyderabad who embraced and cultivated it most devotedly, making it a prized delicacy of the Deccan. Whether Mughal or Nizam, this mango has always belonged to royalty.',
      quote: '"Not just a mango — a fruit fit for emperors."',
      p2: 'What sets Imam Pasand apart is everything about it. The fruit is large — often 450 to 800 grams — with a deep golden-yellow flesh that is buttery, completely fiberless, and offers maximum pulp thanks to its distinctively thin skin and small seed. The taste is profoundly sweet with a gentle hint of tartness, and the floral aroma is unlike anything else in the season.\n\nIt ripens only in May and June, making it one of the rarest and most anticipated fruits of summer. At Aamrutham, we grow it the way it deserves — naturally, without shortcuts, from trees that carry this legacy forward.'
    },
    profile: [
      ['Texture', 'Creamy · Custard-like'],
      ['Aroma', 'Saffron & Floral'],
      ['Taste', 'Profound Sweetness'],
      ['Best Eaten', 'Cut Variety'],
      ['Season', 'June - July'],
      ['Size', 'Large · 400-600g']
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
      ['Refrigerate after ripening', 'Once ripe, store at 8-12°C and consume within 4-6 days.'],
      ['Room temperature ripening', 'Keep at room temperature for 2-3 days if the fruit arrives firm.'],
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
    heroTag: 'Heritage · Fiberless · Aromatic',
    description:
      'Fiberless, aromatic pulp with bright citrusy sweetness and a golden streak across the skin.',
    badges: ['Brix 18-21', 'Fiberless', 'May - June', 'Pesticide-Free'],
    packPrices: [
      { label: '6 pcs', price: 350 },
      { label: '12 pcs', price: 600 },
      { label: '18 pcs', price: 900 }
    ],
    category: 'more',
    accent: 'gold',
    gradient: 'linear-gradient(160deg, #fff4c7 0%, #ffd760 55%, #f0a82b 100%)',
    extraImages: ['/assets/varieties/suvarnarekha-2.jpg', '/assets/varieties/suvarnarekha-3.jpg', '/assets/varieties/suvarnarekha-4.jpg'],
    story: {
      heading: 'The Story of Suvarnarekha',
      p1: 'Named for the golden streak that runs across its skin when ripe, Suvarnarekha is one of the most aromatic varieties from the Visakhapatnam region. Its bright citrusy sweetness stands apart from the richer, heavier premium varieties.',
      quote: '"A mango that smells like summer before you even taste it."',
      p2: 'Fiberless and aromatic, Suvarnarekha is best eaten chilled — the citrus notes deepen beautifully when cool.'
    },
    profile: [
      ['Texture', 'Smooth · Fiberless'],
      ['Aroma', 'Bright & Citrusy'],
      ['Taste', 'Sweet with Citrus Notes'],
      ['Best Eaten', 'Chilled · Sliced'],
      ['Season', 'May - June'],
      ['Size', 'Medium · 200-280g']
    ],
    nutrition: [
      ['Calories', '62 kcal'],
      ['Carbohydrates', '16g'],
      ['Natural Sugar', '13g'],
      ['Protein', '0.8g'],
      ['Dietary Fibre', '1.4g'],
      ['Rich in', 'Vitamins C + A']
    ],
    storage: [
      ['Refrigerate after ripening', 'Store at 8-12°C once ripe and consume within 3-4 days.'],
      ['Room temperature ripening', 'If firm on arrival, keep at room temperature for 1-2 days.'],
      ['Avoid direct sunlight', 'Heat accelerates over-ripening and dulls the citrus aroma.'],
      ['Handle with care', 'Keep in the box until ready to eat to prevent bruising.']
    ]
  },
  {
    id: 'banganapalli',
    name: 'Banganapalli',
    telugu: 'బంగినపల్లి',
    meaning: 'The People\'s Mango',
    shortTag: 'Kurnool, Andhra Pradesh',
    heroTag: 'GI-Tagged · The People\'s Mango',
    description:
      'Large, smooth golden skin and fiberless flesh with mild honey sweetness and universal appeal.',
    badges: ['Brix 16-20', 'Fiberless', 'April - June', 'GI-Tagged'],
    packPrices: [
      { label: '6 pcs', price: 500 },
      { label: '12 pcs', price: 900 },
      { label: '18 pcs', price: 1300 }
    ],
    category: 'more',
    accent: 'leaf',
    gradient: 'linear-gradient(160deg, #fff1cf 0%, #ffdd87 55%, #f5a623 100%)',
    extraImages: ['/assets/varieties/banganapalli-2.jpg', '/assets/varieties/banganapalli-3.jpg', '/assets/varieties/banganapalli-4.jpg'],
    story: {
      heading: 'The Story of Banganapalli',
      p1: 'GI-tagged and beloved across Telugu households, Banganapalli — also called Benishan — has been the everyday mango of Andhra Pradesh for generations. Its large size, smooth golden skin, and mild honey sweetness make it universally loved.',
      quote: '"The mango that belongs to everyone."',
      p2: 'Ours are grown without pesticides on the same natural farming principles that define every variety at Aamrutham. A familiar taste made honest.'
    },
    profile: [
      ['Texture', 'Smooth · Fiberless'],
      ['Aroma', 'Mild & Honey'],
      ['Taste', 'Gentle Sweetness'],
      ['Best Eaten', 'Sliced · Chilled'],
      ['Season', 'April - June'],
      ['Size', 'Large · 350-500g']
    ],
    nutrition: [
      ['Calories', '60 kcal'],
      ['Carbohydrates', '15g'],
      ['Natural Sugar', '13g'],
      ['Protein', '0.7g'],
      ['Dietary Fibre', '1.2g'],
      ['Rich in', 'Vitamins A + C']
    ],
    storage: [
      ['Refrigerate after ripening', 'Store at 8-12°C once ripe and consume within 4-5 days.'],
      ['Room temperature ripening', 'Keep at room temperature 1-2 days if firm on arrival.'],
      ['Avoid direct sunlight', 'Avoid heat to prevent over-ripening.'],
      ['Handle with care', 'Large fruit bruises easily — keep in the box until ready.']
    ]
  },
  {
    id: 'chinna-rasalu',
    name: 'Chinna Rasalu',
    telugu: 'చిన్న రసాలు',
    meaning: 'The Little Nectar',
    shortTag: 'Nuzvid',
    heroTag: 'Heritage · Small · Intensely Sweet',
    description:
      'Small but intensely sweet with syrup-like pulp. A childhood favourite in many Telugu homes.',
    badges: ['Brix 22-26', 'Juicy', 'May - July', 'Pesticide-Free'],
    packPrices: [
      { label: '6 pcs', price: 350 },
      { label: '12 pcs', price: 600 },
      { label: '18 pcs', price: 900 }
    ],
    category: 'more',
    accent: 'gold',
    gradient: 'linear-gradient(160deg, #fff3db 0%, #ffc86d 55%, #eb8d23 100%)',
    extraImages: ['/assets/varieties/chinna-rasalu-2.jpg', '/assets/varieties/chinna-rasalu-3.jpg'],
    story: {
      heading: 'The Story of Chinna Rasalu',
      p1: 'Small in size but enormous in flavour, Chinna Rasalu has been a staple of Telugu summer childhoods for generations. "Rasalu" means nectar, and the name is earned — the syrup-like pulp is among the sweetest of any mango variety.',
      quote: '"Big flavour. Small mango. Unforgettable summer."',
      p2: 'Its high Brix count (22-26) puts it at the top of the sweetness scale. A handful of these is a summer ritual worth reliving every year.'
    },
    profile: [
      ['Texture', 'Juicy · Soft'],
      ['Aroma', 'Sweet & Fruity'],
      ['Taste', 'Syrup-like Sweetness'],
      ['Best Eaten', 'Sucked or squeezed'],
      ['Season', 'May - July'],
      ['Size', 'Small · 100-150g']
    ],
    nutrition: [
      ['Calories', '70 kcal'],
      ['Carbohydrates', '18g'],
      ['Natural Sugar', '16g'],
      ['Protein', '0.9g'],
      ['Dietary Fibre', '1.5g'],
      ['Rich in', 'Vitamins C + B6']
    ],
    storage: [
      ['Refrigerate after ripening', 'Store at 8-12°C once ripe and consume within 2-3 days.'],
      ['Room temperature ripening', 'Let ripen 1 day at room temperature if firm on arrival.'],
      ['Avoid direct sunlight', 'Small fruit ripens fast — keep cool and shaded.'],
      ['Handle with care', 'Soft flesh bruises easily; keep in the box until ready.']
    ]
  },
  {
    id: 'pedda-rasalu',
    name: 'Pedda Rasalu',
    telugu: 'పెద్ద రసాలు',
    meaning: 'The Grand Nectar',
    shortTag: 'Nuzvid',
    heroTag: 'Heritage · Full-Bodied · Rich',
    description:
      'A larger, richer sibling to Chinna Rasalu with deeper amber pulp and lingering sweetness.',
    badges: ['Brix 20-24', 'Full-bodied', 'May - July', 'Pesticide-Free'],
    packPrices: [
      { label: '6 pcs', price: 400 },
      { label: '12 pcs', price: 750 },
      { label: '18 pcs', price: 1150 }
    ],
    category: 'more',
    accent: 'leaf',
    gradient: 'linear-gradient(160deg, #fff0d2 0%, #ffbe62 55%, #de7e16 100%)',
    story: {
      heading: 'The Story of Pedda Rasalu',
      p1: 'The older, larger sibling of Chinna Rasalu, Pedda Rasalu delivers all the nectar-sweetness but with a deeper amber pulp and fuller body. From Nuzvid — the heartland of Andhra\'s finest heritage mangoes.',
      quote: '"The same lineage. Twice the presence."',
      p2: 'With a Brix of 20-24, it carries that characteristic lingering sweetness that finishes long after the last bite. A full-season mango worth seeking out.'
    },
    profile: [
      ['Texture', 'Juicy · Full-bodied'],
      ['Aroma', 'Deep & Sweet'],
      ['Taste', 'Rich Lingering Sweetness'],
      ['Best Eaten', 'Sliced or sucked'],
      ['Season', 'May - July'],
      ['Size', 'Medium-Large · 200-300g']
    ],
    nutrition: [
      ['Calories', '66 kcal'],
      ['Carbohydrates', '17g'],
      ['Natural Sugar', '15g'],
      ['Protein', '0.9g'],
      ['Dietary Fibre', '1.5g'],
      ['Rich in', 'Vitamins C + A']
    ],
    storage: [
      ['Refrigerate after ripening', 'Store at 8-12°C once ripe and consume within 3-4 days.'],
      ['Room temperature ripening', 'Ripen at room temperature 1-2 days if firm on arrival.'],
      ['Avoid direct sunlight', 'Keep shaded — direct heat degrades the flavour quickly.'],
      ['Handle with care', 'Medium flesh — keep in box until ready to eat.']
    ]
  },
  {
    id: 'children-mango-pack',
    name: 'Kids Mango Pack',
    telugu: 'పిల్లల మావిడి ప్యాక్',
    meaning: 'Little Mangoes for Little Ones',
    shortTag: 'For Ages 2-10 · Fun & Healthy',
    heroTag: 'Kids Special · Pack of 6',
    description:
      'Specially curated for children! Smaller, sweeter mangoes that are perfect for little hands. No fiber, easy to eat, and absolutely delicious. A healthy summer treat your kids will love!',
    fullDescription:
      'We have handpicked the sweetest, most kid-friendly mangoes for your little ones. These are smaller in size, completely fiberless, and have just the right amount of sweetness for children ages 2-10. Perfect for lunchboxes, summer snacks, and happy little faces!',
    badges: ['Pack of 6', 'Ages 2-10', 'Fiberless', 'Kid-Friendly'],
    packPrices: [
      { label: '6 pcs', price: 400 },
      { label: '12 pcs', price: 750 },
      { label: '18 pcs', price: 1100 }
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
      ['Perfect For', 'Ages 2-10']
    ],
    storage: [
      ['Refrigerate after ripening', 'Store at 8-12°C once ripe and consume within 3-4 days.'],
      ['Room temperature ripening', 'Keep at room temperature for 1-2 days until fragrant.'],
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

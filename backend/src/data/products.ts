import { Product } from '../types';

export const products: Product[] = [
  {
    id: 'kothapalli-kobbari',
    name: 'Kothapalli Kobbari',
    nameTe: 'కొత్తపల్లి కొబ్బరి',
    description: 'A rare coconut-flavored mango variety from the Bobbili region. Known for its unique taste and aroma that resembles tender coconut.',
    descriptionTe: 'బొబ్బిలి ప్రాంతం నుండి వచ్చే అరుదైన కొబ్బరి రుచి గల మామిడి రకం. దీని ప్రత్యేక రుచి మరియు సువాసన తక్కువ వయసున్న కొబ్బరిని పోలి ఉంటుంది.',
    price: 899,
    originalPrice: 1099,
    image: '/assets/Kothapalli-Kobbari.jpg',
    images: ['/assets/Kothapalli-Kobbari.jpg'],
    category: 'premium',
    inStock: true,
    unit: 'kg',
    unitTe: 'కేజీ',
    packs: [
      { id: 'pack-2kg', name: '2 kg Pack', nameTe: '2 కేజీ ప్యాక్', quantity: 2, price: 899, originalPrice: 1099, savings: 200 },
      { id: 'pack-5kg', name: '5 kg Pack', nameTe: '5 కేజీ ప్యాక్', quantity: 5, price: 2099, originalPrice: 2749, savings: 650 },
      { id: 'pack-10kg', name: '10 kg Pack', nameTe: '10 కేజీ ప్యాక్', quantity: 10, price: 3999, originalPrice: 5499, savings: 1500 }
    ]
  },
  {
    id: 'imam-pasand',
    name: 'Imam Pasand',
    nameTe: 'ఇమామ్ పసంద్',
    description: 'The "Imam\'s Choice" - a legendary mango variety known for its incredibly sweet, fiberless pulp and distinctive shape.',
    descriptionTe: '"ఇమామ్ ఎంపిక" - అద్భుతమైన తీపి, పీచు లేని గుజ్జు మరియు ప్రత్యేక ఆకారానికి ప్రసిద్ధి చెందిన పురాణ మామిడి రకం.',
    price: 999,
    originalPrice: 1299,
    image: '/assets/imam-pasand.jpg',
    images: ['/assets/imam-pasand.jpg'],
    category: 'premium',
    inStock: true,
    unit: 'kg',
    unitTe: 'కేజీ',
    packs: [
      { id: 'pack-2kg', name: '2 kg Pack', nameTe: '2 కేజీ ప్యాక్', quantity: 2, price: 999, originalPrice: 1299, savings: 300 },
      { id: 'pack-5kg', name: '5 kg Pack', nameTe: '5 కేజీ ప్యాక్', quantity: 5, price: 2399, originalPrice: 3249, savings: 850 },
      { id: 'pack-10kg', name: '10 kg Pack', nameTe: '10 కేజీ ప్యాక్', quantity: 10, price: 4499, originalPrice: 6499, savings: 2000 }
    ]
  },
  {
    id: 'bobbili-peechu',
    name: 'Bobbili Peetha',
    nameTe: 'బొబ్బిలి పీఠా',
    description: 'A heritage variety from the Bobbili royal family orchards. Medium-sized with a unique sweet-tart flavor profile.',
    descriptionTe: 'బొబ్బిలి రాజ కుటుంబ తోటల నుండి వచ్చే వారసత్వ రకం. ప్రత్యేకమైన తీపి-పులుపు రుచి ప్రొఫైల్‌తో మధ్యస్థ పరిమాణం.',
    price: 799,
    originalPrice: 999,
    image: '/assets/bobbili-peechu.jpg',
    images: ['/assets/bobbili-peechu.jpg'],
    category: 'heritage',
    inStock: true,
    unit: 'kg',
    unitTe: 'కేజీ',
    packs: [
      { id: 'pack-2kg', name: '2 kg Pack', nameTe: '2 కేజీ ప్యాక్', quantity: 2, price: 799, originalPrice: 999, savings: 200 },
      { id: 'pack-5kg', name: '5 kg Pack', nameTe: '5 కేజీ ప్యాక్', quantity: 5, price: 1899, originalPrice: 2499, savings: 600 },
      { id: 'pack-10kg', name: '10 kg Pack', nameTe: '10 కేజీ ప్యాక్', quantity: 10, price: 3599, originalPrice: 4999, savings: 1400 }
    ]
  },
  {
    id: 'mettavalasa-peechu',
    name: 'Mettavalasa Peetha',
    nameTe: 'మెట్టవలస పీఠా',
    description: 'A rare variety from the Mettavalasa region. Known for its exceptional sweetness and buttery texture.',
    descriptionTe: 'మెట్టవలస ప్రాంతం నుండి వచ్చే అరుదైన రకం. అసాధారణ తీపి మరియు వెన్న లాంటి టెక్స్చర్‌కు ప్రసిద్ధి.',
    price: 849,
    originalPrice: 1049,
    image: '/assets/mettavalasa-peechu.jpg',
    images: ['/assets/mettavalasa-peechu.jpg'],
    category: 'heritage',
    inStock: true,
    unit: 'kg',
    unitTe: 'కేజీ',
    packs: [
      { id: 'pack-2kg', name: '2 kg Pack', nameTe: '2 కేజీ ప్యాక్', quantity: 2, price: 849, originalPrice: 1049, savings: 200 },
      { id: 'pack-5kg', name: '5 kg Pack', nameTe: '5 కేజీ ప్యాక్', quantity: 5, price: 1999, originalPrice: 2624, savings: 625 },
      { id: 'pack-10kg', name: '10 kg Pack', nameTe: '10 కేజీ ప్యాక్', quantity: 10, price: 3799, originalPrice: 5249, savings: 1450 }
    ]
  }
];
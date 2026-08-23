export interface Product {
  slug: string;
  name: string;
  price: number;
  descriptor?: string;
  description?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  isNewArrival?: boolean;
  isFeatured?: boolean;
  collection?: string;
}

export function productImage(slug: string, index: number): string {
  return `/images/products/${slug}-${index}.jpg`;
}

export const products: Product[] = [
  {
    slug: 'the-veridian-solitaire',
    name: 'The Veridian Solitaire',
    price: 425000,
    descriptor: 'Emerald-cut solitaire, 18k gold',
    description:
      'Crafted from 100% recycled 18k yellow gold. The center stone is responsibly sourced, conflict-free emerald. Shell-shaped prongs cradle the stone, while a tapered band ensures a comfortable fit through the natural rhythms of the day — one continuous, light-filled moment.',
    status: 'in_stock',
    isFeatured: true,
    isNewArrival: true,
    collection: 'The Eternity Collection',
  },
  {
    slug: 'emerald-cut-solitaire-ring',
    name: 'Emerald Cut Solitaire Ring',
    price: 450000,
    descriptor: 'Emerald-cut solitaire, 18k gold',
    description: 'A refined emerald-cut stone set in hand-finished 18k gold with a clean tapered band.',
    status: 'in_stock',
    isFeatured: true,
    collection: 'The Eternity Collection',
  },
  {
    slug: 'diamond-tennis-bracelet',
    name: 'Diamond Tennis Bracelet',
    price: 820000,
    descriptor: 'Continuous diamond line',
    description: 'A seamless line of matched diamonds in a delicate claw setting — the definitive evening piece.',
    status: 'in_stock',
    isFeatured: true,
    collection: 'Lumina Pearls',
  },
  {
    slug: 'classic-gold-chain',
    name: 'Classic Gold Chain',
    price: 185000,
    descriptor: 'Hand-linked Cuban chain, 18k gold',
    description: 'A substantial Cuban link chain with a polished finish and a hidden clasp for an uninterrupted line.',
    status: 'in_stock',
    isFeatured: true,
    collection: 'Aura Gold',
  },
  {
    slug: 'sapphire-drop-earrings',
    name: 'Sapphire Drop Earrings',
    price: 310000,
    descriptor: 'Sapphire drops, 18k gold',
    description: 'Articulated sapphire drops that catch light with every movement, balanced for all-day wear.',
    status: 'in_stock',
    isFeatured: true,
    collection: 'Lumina Pearls',
  },
  {
    slug: 'the-architect-ring',
    name: 'The Architect Ring',
    price: 125000,
    descriptor: 'Structural gold band',
    description: 'A bold architectural band with clean geometric lines, designed for everyday presence.',
    status: 'in_stock',
    collection: 'The Eternity Collection',
  },
  {
    slug: 'emerald-linea-necklace',
    name: 'Emerald Linea Necklace',
    price: 89000,
    descriptor: 'Emerald accent chain',
    description: 'A delicate gold chain with a singular emerald pendant — quiet luxury at its finest.',
    status: 'in_stock',
    collection: 'The Eternity Collection',
  },
  {
    slug: 'structural-hoops',
    name: 'Structural Hoops',
    price: 45000,
    descriptor: 'Geometric gold hoops',
    description: 'Sculpted gold hoops with a structural profile, designed to sit close and catch light.',
    status: 'low_stock',
    collection: 'Aura Gold',
  },
  {
    slug: 'monolith-cuff',
    name: 'Monolith Cuff',
    price: 180000,
    descriptor: 'Sculptural open cuff',
    description: 'An open sculptural cuff shaped for a close, confident fit — the strongest line in the gold series.',
    status: 'in_stock',
    collection: 'Aura Gold',
  },
  {
    slug: 'constellation-ring',
    name: 'Constellation Ring',
    price: 210000,
    descriptor: 'Gemstone cluster',
    description: 'A constellation of small gemstones set in a hand-finished gold bezel, designed to stand alone or stack.',
    status: 'in_stock',
    collection: 'The Eternity Collection',
  },
  {
    slug: 'foundry-chain',
    name: 'Foundry Chain',
    price: 340000,
    descriptor: 'Substantial link chain',
    description: 'A bold link chain with a polished finish, designed for everyday wear and layering.',
    status: 'in_stock',
    collection: 'Aura Gold',
  },
  {
    slug: 'onyx-drop-earrings',
    name: 'Onyx Drop Earrings',
    price: 65000,
    descriptor: 'Onyx drops, 18k gold',
    description: 'Polished onyx drops suspended from gold studs — movement and drama in equal measure.',
    status: 'in_stock',
    collection: 'Lumina Pearls',
  },
  {
    slug: 'heritage-signet',
    name: 'Heritage Signet',
    price: 110000,
    descriptor: '18k gold signet',
    description: 'A hand-polished signet ring with a softly domed face, designed for everyday presence.',
    status: 'in_stock',
    collection: 'The Eternity Collection',
  },
  {
    slug: 'aura-ring',
    name: 'Aura Ring',
    price: 125000,
    descriptor: 'Slim profile band',
    description: 'A slim, hand-polished band with a softened square profile, weighted to sit perfectly alongside your other rings.',
    status: 'in_stock',
    isNewArrival: true,
    collection: 'The Eternity Collection',
  },
  {
    slug: 'structure-cuff',
    name: 'Structure Cuff',
    price: 210000,
    descriptor: 'Sculptural cuff',
    description: 'A sculptural gold cuff with clean lines — designed to catch light and layer effortlessly.',
    status: 'in_stock',
    isNewArrival: true,
    collection: 'Aura Gold',
  },
  {
    slug: 'linear-drop-earrings',
    name: 'Linear Drop Earrings',
    price: 85000,
    descriptor: 'Linear gold drops',
    description: 'Polished gold drops with a clean linear profile — modern and versatile.',
    status: 'in_stock',
    isNewArrival: true,
    collection: 'Aura Gold',
  },
  {
    slug: 'vertex-necklace',
    name: 'Vertex Necklace',
    price: 340000,
    descriptor: 'Geometric pendant',
    description: 'A geometric pendant on a delicate gold chain — modern luxury, quietly stated.',
    status: 'in_stock',
    isNewArrival: true,
    collection: 'The Eternity Collection',
  },
];

export const collections = [
  {
    slug: 'the-eternity-collection',
    name: 'The Eternity Collection',
    copy: 'Heirloom silhouettes, refined for the way we live now.',
  },
  {
    slug: 'aura-gold',
    name: 'Aura Gold',
    copy: 'Warm gold essentials, composed for everyday wear.',
  },
  {
    slug: 'lumina-pearls',
    name: 'Lumina Pearls',
    copy: 'Light and luminosity — the modern pearl, reconsidered.',
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(minorUnits: number): string {
  return new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(minorUnits / 100));
}

// Boutique — tableaux encadrés prêts à poser
export interface BoutiqueProduct {
  id: string;
  title: string;
  artist: string;
  style: string;
  description: string;
  imageUrl: string;
  dimensions: string;
  mouldure: string;
  passepartout: string | null;
  protection: string;
  priceFCFA: number;
  badge?: string;
}

export const BOUTIQUE_STYLES = [
  'Tous',
  'Art Abstrait',
  'Photographie',
  'Botanique',
  'Portrait',
  'Paysage',
  'Architecture',
];

export const BOUTIQUE_PRODUCTS: BoutiqueProduct[] = [
  {
    id: 'harmonie-doree-a3',
    title: 'Harmonie Dorée',
    artist: 'Collection FrameItUp',
    style: 'Art Abstrait',
    description: 'Explosion de couleurs chaudes sur fond ivoire. Moulure chêne naturel huilé, passe-partout blanc cœur.',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=90',
    dimensions: '30 × 40 cm',
    mouldure: 'Chêne naturel huilé 22mm',
    passepartout: 'Blanc cœur 30mm',
    protection: 'Verre antireflet minéral',
    priceFCFA: 42000,
    badge: 'Bestseller',
  },
  {
    id: 'sahel-sunset',
    title: 'Coucher de Sahel',
    artist: 'Collection FrameItUp',
    style: 'Photographie',
    description: 'La lumière rasante du crépuscule sur la savane. Tirage fine art 250g, couleurs profondes et lumineuses.',
    imageUrl: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=90',
    dimensions: '40 × 60 cm',
    mouldure: 'Acajou rouge poli 18mm',
    passepartout: null,
    protection: 'Plexiglas poli au diamant',
    priceFCFA: 58000,
    badge: 'Nouveau',
  },
  {
    id: 'botanique-tropicale',
    title: 'Botanique Tropicale',
    artist: 'Collection FrameItUp',
    style: 'Botanique',
    description: "Illustration botanique inspirée des flores d'Afrique équatoriale. Rendu détaillé et texturé.",
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88df5691cc06?w=800&q=90',
    dimensions: '30 × 40 cm',
    mouldure: 'Chêne naturel huilé 22mm',
    passepartout: 'Ivoire 25mm',
    protection: 'Verre antireflet minéral',
    priceFCFA: 38000,
  },
  {
    id: 'portrait-contemporain',
    title: 'Portrait Contemporain',
    artist: 'Collection FrameItUp',
    style: 'Portrait',
    description: 'Étude de lumière en noir et blanc. La moulure laquée noire sublime la profondeur du regard.',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=90',
    dimensions: '40 × 50 cm',
    mouldure: 'Laque noire mate 20mm',
    passepartout: 'Blanc cœur 30mm',
    protection: 'Verre antireflet minéral',
    priceFCFA: 52000,
  },
  {
    id: 'lignes-urbaines',
    title: 'Lignes Urbaines',
    artist: 'Collection FrameItUp',
    style: 'Architecture',
    description: "La géométrie de la ville moderne capturée à l'heure bleue. Cadre aluminium brossé discret.",
    imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=90',
    dimensions: '50 × 70 cm',
    mouldure: 'Aluminium argent brossé 15mm',
    passepartout: null,
    protection: 'Plexiglas poli au diamant',
    priceFCFA: 74000,
    badge: 'Grand format',
  },
  {
    id: 'cascade-lumiere',
    title: 'Cascade de Lumière',
    artist: 'Collection FrameItUp',
    style: 'Paysage',
    description: "La puissance apaisante de l'eau en longue exposition. Rendu soyeux sur papier Hahnemühle 250g.",
    imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=90',
    dimensions: '40 × 60 cm',
    mouldure: 'Wengé africain 25mm',
    passepartout: 'Lin naturel 20mm',
    protection: 'Verre antireflet minéral',
    priceFCFA: 62000,
  },
  {
    id: 'abidjan-lagune',
    title: "Lagune d'Abidjan",
    artist: 'Collection FrameItUp',
    style: 'Photographie',
    description: "La lagune Ébrié au lever du soleil, reflets dorés sur l'eau calme. Une ode à la Côte d'Ivoire.",
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=90',
    dimensions: '50 × 70 cm',
    mouldure: 'Chêne doré 28mm',
    passepartout: 'Blanc cœur 35mm',
    protection: 'Verre antireflet minéral',
    priceFCFA: 84000,
    badge: 'Édition limitée',
  },
  {
    id: 'texture-savane',
    title: 'Textures de Savane',
    artist: 'Collection FrameItUp',
    style: 'Art Abstrait',
    description: 'Matières et teintes ocre de la savane ouest-africaine en macro. Une œuvre tactile et envoûtante.',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=90',
    dimensions: '30 × 30 cm',
    mouldure: 'Noyer foncé 18mm',
    passepartout: null,
    protection: 'Plexiglas poli au diamant',
    priceFCFA: 34000,
  },
  {
    id: 'fleurs-sauvages',
    title: 'Fleurs Sauvages',
    artist: 'Collection FrameItUp',
    style: 'Botanique',
    description: 'Composition florale délicate à la manière des botanistes du XVIIIe. Fond crème, rendu précis.',
    imageUrl: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=800&q=90',
    dimensions: '30 × 40 cm',
    mouldure: 'Doré antique 22mm',
    passepartout: 'Crème saumon 30mm',
    protection: 'Verre antireflet minéral',
    priceFCFA: 44000,
    badge: 'Coup de cœur',
  },
];


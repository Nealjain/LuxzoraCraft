export interface ImageData {
  id: string;
  src: string;
  alt: string;
  description: string;
  category: string;
}

export const imageData: ImageData[] = [
  {
    id: "pexels-1",
    src: "/images/pexels-1.jpg",
    alt: "Elegant diamond jewelry collection featuring rings and necklaces",
    description: "Exquisite collection of diamond jewelry pieces showcasing brilliant cut stones in platinum settings, representing the pinnacle of luxury craftsmanship.",
    category: "featured"
  },
  {
    id: "pexels-2",
    src: "/images/pexels-2.jpg",
    alt: "Luxury gold jewelry with precious gemstones",
    description: "Stunning array of gold jewelry featuring precious gemstones, each piece meticulously crafted to embody elegance and sophistication.",
    category: "featured"
  },
  {
    id: "pexels-3",
    src: "/images/pexels-3.jpg",
    alt: "Premium jewelry display with mixed precious metals",
    description: "Premium jewelry collection displaying the perfect harmony of mixed precious metals and gemstones, designed for the discerning connoisseur.",
    category: "featured"
  },
  {
    id: "pexels-4",
    src: "/images/pexels-4.jpg",
    alt: "Artisan jewelry craftsmanship and detailed metalwork",
    description: "Masterful demonstration of artisan jewelry craftsmanship, showcasing intricate metalwork and attention to detail in every piece.",
    category: "featured"
  },
  {
    id: "pexels-5",
    src: "/images/pexels-5.jpg",
    alt: "Fine jewelry with exceptional gemstone quality",
    description: "Fine jewelry collection highlighting exceptional gemstone quality and precision setting techniques, perfect for special occasions.",
    category: "featured"
  },
  {
    id: "diamond-ring-1",
    src: "/images/products/ring-1.jpg",
    alt: "Classic diamond solitaire engagement ring",
    description: "Timeless diamond solitaire engagement ring featuring a brilliant cut center stone in a platinum setting, symbolizing eternal love and commitment.",
    category: "rings"
  },
  {
    id: "diamond-ring-2",
    src: "/images/products/ring-2.jpg",
    alt: "Vintage-inspired diamond ring with halo setting",
    description: "Vintage-inspired diamond ring with intricate halo setting, combining classic elegance with contemporary brilliance.",
    category: "rings"
  },
  {
    id: "diamond-ring-3",
    src: "/images/products/ring-3.jpg",
    alt: "Modern diamond ring with unique band design",
    description: "Modern diamond ring featuring a unique band design with pavé diamonds, perfect for the contemporary jewelry enthusiast.",
    category: "rings"
  },
  {
    id: "luxury-ring",
    src: "/images/products/ring.jpg",
    alt: "Luxury cocktail ring with statement gemstone",
    description: "Stunning luxury cocktail ring featuring a statement gemstone surrounded by diamonds, designed to make an unforgettable impression.",
    category: "rings"
  },
  {
    id: "elegant-necklace-1",
    src: "/images/products/necklace-1.jpg",
    alt: "Elegant pearl necklace with gold clasp",
    description: "Sophisticated pearl necklace with lustrous cultured pearls and an elegant gold clasp, perfect for formal occasions.",
    category: "necklaces"
  },
  {
    id: "luxury-necklaces",
    src: "/images/products/necklaces.jpg",
    alt: "Collection of luxury necklaces with various gemstones",
    description: "Curated collection of luxury necklaces featuring various precious gemstones, each piece telling its own story of elegance.",
    category: "necklaces"
  },
  {
    id: "designer-necklaces-1",
    src: "/images/products/necklaces-1.jpg",
    alt: "Designer necklaces with contemporary styling",
    description: "Contemporary designer necklaces showcasing innovative styling and premium materials, perfect for the modern woman.",
    category: "necklaces"
  },
  {
    id: "statement-necklaces-3",
    src: "/images/products/necklaces-3.jpg",
    alt: "Statement necklaces with bold designs",
    description: "Bold statement necklaces featuring dramatic designs and exceptional craftsmanship, ideal for making a powerful impression.",
    category: "necklaces"
  },
  {
    id: "luxury-bracelet",
    src: "/images/products/bracelet.jpg",
    alt: "Luxury diamond tennis bracelet",
    description: "Breathtaking diamond tennis bracelet featuring perfectly matched stones in a continuous line of brilliance and luxury.",
    category: "bracelets"
  },
  {
    id: "gold-bracelet-3",
    src: "/images/products/bracelet-3.jpg",
    alt: "Gold bracelet with intricate chain design",
    description: "Exquisite gold bracelet with intricate chain design, combining traditional craftsmanship with modern elegance.",
    category: "bracelets"
  },
  {
    id: "designer-bracelets-2",
    src: "/images/products/bracelets-2.jpg",
    alt: "Designer bracelets with mixed metals",
    description: "Sophisticated designer bracelets featuring mixed metals and innovative design elements, perfect for layering.",
    category: "bracelets"
  },
  {
    id: "luxury-earrings",
    src: "/images/products/earrings.jpg",
    alt: "Luxury drop earrings with diamonds",
    description: "Stunning luxury drop earrings featuring cascading diamonds that catch and reflect light beautifully.",
    category: "earrings"
  },
  {
    id: "elegant-earrings-1",
    src: "/images/products/earrings-1.jpg",
    alt: "Elegant pearl and diamond earrings",
    description: "Timeless pearl and diamond earrings combining classic beauty with contemporary design for sophisticated elegance.",
    category: "earrings"
  },
  {
    id: "designer-earrings-2",
    src: "/images/products/earrings-2.jpg",
    alt: "Designer earrings with geometric patterns",
    description: "Modern designer earrings featuring geometric patterns and premium materials, perfect for the fashion-forward individual.",
    category: "earrings"
  },
  {
    id: "statement-earrings-3",
    src: "/images/products/earrings-3.jpg",
    alt: "Statement earrings with bold gemstone accents",
    description: "Dramatic statement earrings with bold gemstone accents, designed to elevate any outfit with luxury and style.",
    category: "earrings"
  }
];

export const getImagesByCategory = (category: string): ImageData[] => {
  return imageData.filter(image => image.category === category);
};

export const getImageById = (id: string): ImageData | undefined => {
  return imageData.find(image => image.id === id);
};

export const getAllCategories = (): string[] => {
  const categories = new Set(imageData.map(image => image.category));
  return Array.from(categories);
};

export const getFeaturedImages = (): ImageData[] => {
  return getImagesByCategory('featured');
};

export const getRandomImagesByCategory = (category: string, count: number): ImageData[] => {
  const categoryImages = getImagesByCategory(category);
  const shuffled = [...categoryImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

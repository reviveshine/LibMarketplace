import { Product, Category, User, Review } from '../types'

// Mock users
export const mockUsers: User[] = [
  {
    id: 1,
    email: 'mary.johnson@email.com',
    name: 'Mary Johnson',
    type: 'seller',
    userId: 'SEL001',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b25683ef?w=100&h=100&fit=crop&crop=face',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    email: 'john.doe@email.com',
    name: 'John Doe',
    type: 'buyer',
    userId: 'BUY001',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 3,
    email: 'grace.davis@email.com',
    name: 'Grace Davis',
    type: 'seller',
    userId: 'SEL002',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    createdAt: '2024-01-20T00:00:00Z'
  }
]

// Mock categories
export const mockCategories: Category[] = [
  {
    id: 'textiles',
    name: '🧵 Textiles & Clothing',
    description: 'Traditional fabrics, kente cloth, and modern clothing',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=400&h=300&fit=crop',
    productCount: 15
  },
  {
    id: 'food',
    name: '🌾 Food & Beverages',
    description: 'Local coffee, palm oil, spices, and traditional foods',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    productCount: 25
  },
  {
    id: 'crafts',
    name: '🎨 Arts & Crafts',
    description: 'Handmade sculptures, masks, and traditional art',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    productCount: 12
  },
  {
    id: 'jewelry',
    name: '💎 Jewelry & Accessories',
    description: 'Traditional and modern jewelry, accessories',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
    productCount: 8
  },
  {
    id: 'music',
    name: '🥁 Music & Instruments',
    description: 'Traditional drums, musical instruments, and music',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    productCount: 6
  },
  {
    id: 'health',
    name: '🌿 Health & Beauty',
    description: 'Natural skincare, traditional medicines, and beauty products',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop',
    productCount: 10
  }
]

// Mock reviews
export const mockReviews: Review[] = [
  {
    id: 1,
    userId: 2,
    userName: 'John Doe',
    productId: 1,
    rating: 5,
    comment: 'Beautiful authentic kente cloth! The quality is excellent and shipping was fast.',
    createdAt: '2024-07-15T00:00:00Z'
  },
  {
    id: 2,
    userId: 2,
    userName: 'John Doe',
    productId: 2,
    rating: 4,
    comment: 'Great coffee! Rich flavor that reminds me of home.',
    createdAt: '2024-07-10T00:00:00Z'
  }
]

// Mock products with proper typing
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Traditional Kente Cloth',
    description: 'Handwoven authentic kente cloth from Liberian artisans. Each piece tells a story through its intricate patterns and vibrant colors. Perfect for special occasions or cultural celebrations.',
    price: 89.99,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=300&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=500&h=400&fit=crop&sat=-10',
      'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=500&h=400&fit=crop&hue=30'
    ],
    category: 'textiles',
    seller: mockUsers[0],
    rating: 4.8,
    reviews: [mockReviews[0]],
    features: ['Handwoven', 'Traditional patterns', 'Premium cotton', 'Authentic Liberian design'],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-07-15T00:00:00Z'
  },
  {
    id: 2,
    name: 'Nimba County Coffee',
    description: 'Premium arabica coffee beans from the lush mountains of Nimba County. Grown at high altitude and carefully processed to bring out the rich, full-bodied flavor that Liberian coffee is known for.',
    price: 24.99,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&h=400&fit=crop'
    ],
    category: 'food',
    seller: mockUsers[0],
    rating: 4.6,
    reviews: [mockReviews[1]],
    features: ['100% Arabica', 'High altitude grown', 'Single origin', 'Medium roast'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-07-10T00:00:00Z'
  },
  {
    id: 3,
    name: 'Carved Wooden Elephant',
    description: 'Beautiful elephant sculpture representing Liberian wildlife. Hand-carved by skilled artisans from sustainable local wood. A perfect piece for home decoration or as a meaningful gift.',
    price: 45.00,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop&rot=45',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop&rot=90'
    ],
    category: 'crafts',
    seller: mockUsers[2],
    rating: 4.9,
    reviews: [],
    features: ['Hand-carved', 'Sustainable wood', 'Traditional design', 'Home decoration'],
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Pure Palm Oil',
    description: 'Authentic red palm oil from Liberian palm trees. Rich in vitamins and perfect for traditional cooking. Extracted using traditional methods to preserve all the natural goodness.',
    price: 19.99,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=400&fit=crop&brightness=20',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=400&fit=crop&contrast=20'
    ],
    category: 'food',
    seller: mockUsers[0],
    rating: 4.5,
    reviews: [],
    features: ['100% Pure', 'Traditional extraction', 'Rich in vitamins', 'Authentic taste'],
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z'
  },
  {
    id: 5,
    name: 'Traditional Talking Drum',
    description: 'Authentic talking drum handcrafted by local musicians. Used for traditional communication and music. Each drum is unique and produces distinct tones for different messages.',
    price: 125.00,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=400&fit=crop&rot=30',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=400&fit=crop&angle=45'
    ],
    category: 'music',
    seller: mockUsers[2],
    rating: 5.0,
    reviews: [],
    features: ['Handcrafted', 'Traditional design', 'Authentic sound', 'Cultural significance'],
    createdAt: '2024-01-30T00:00:00Z',
    updatedAt: '2024-05-20T00:00:00Z'
  },
  {
    id: 6,
    name: 'Liberian Flag Jewelry',
    description: 'Beautiful jewelry featuring Liberian flag colors. Made with high-quality materials and designed to showcase national pride. Perfect for special occasions or everyday wear.',
    price: 35.99,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=400&fit=crop&sat=20',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=400&fit=crop&brightness=10'
    ],
    category: 'jewelry',
    seller: mockUsers[2],
    rating: 4.7,
    reviews: [],
    features: ['Flag colors', 'High quality', 'Patriotic design', 'Versatile wear'],
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z'
  }
]


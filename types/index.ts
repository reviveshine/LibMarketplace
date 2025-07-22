// Core data types for LibMarketplace
export interface User {
  id: number
  email: string
  name: string
  type: 'buyer' | 'seller' | 'admin'
  userId: string
  verified: boolean
  avatar?: string
  phone?: string
  address?: Address
  createdAt?: string
}

export interface Address {
  street: string
  city: string
  county: string
  country: string
  postalCode?: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image: string
  images?: string[]
  category: string
  seller: User
  rating: number
  reviews: Review[]
  features?: string[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  image: string
  productCount: number
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  userId: number
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: number
  userId: number
  userName: string
  productId: number
  rating: number
  comment: string
  createdAt: string
}

export interface Message {
  id: number
  senderId: number
  receiverId: number
  content: string
  read: boolean
  createdAt: string
}

export interface Notification {
  id: number
  userId: number
  type: 'order' | 'message' | 'review' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface WishlistItem {
  id: number
  userId: number
  productId: number
  product: Product
  createdAt: string
}

// Form interfaces
export interface LoginForm {
  email: string
  password: string
  remember: boolean
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  type: 'buyer' | 'seller'
  phone: string
  acceptTerms: boolean
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Search and Filter types
export interface SearchFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  sortBy?: 'price' | 'rating' | 'name' | 'newest'
  sortOrder?: 'asc' | 'desc'
}
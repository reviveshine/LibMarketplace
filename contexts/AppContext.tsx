import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Types
export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image: string
  category?: string
  seller?: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface User {
  id: number
  name: string
  email: string
  type: 'buyer' | 'seller' | 'admin'
  userId: string
  verified: boolean
  avatar?: string
}

interface AppState {
  user: User | null
  cartItems: CartItem[]
  wishlist: Product[]
  loading: boolean
  error: string | null
}

// Actions
type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

// Initial state
const initialState: AppState = {
  user: null,
  cartItems: [],
  wishlist: [],
  loading: false,
  error: null
}

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    
    case 'ADD_TO_CART':
      const existingItem = state.cartItems.find(item => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }
      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }]
      }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload)
      }
    
    case 'UPDATE_CART_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cartItems: state.cartItems.filter(item => item.id !== action.payload.id)
        }
      }
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    
    case 'CLEAR_CART':
      return { ...state, cartItems: [] }
    
    case 'ADD_TO_WISHLIST':
      const existingWishlistItem = state.wishlist.find(item => item.id === action.payload.id)
      if (existingWishlistItem) {
        return state
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      }
    
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload)
      }
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    default:
      return state
  }
}

// Context
const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
} | null>(null)

// Provider
interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load user from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          dispatch({ type: 'SET_USER', payload: user })
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('user')
        }
      }

      // Load cart from localStorage
      const cartData = localStorage.getItem('cart')
      if (cartData) {
        try {
          const cart = JSON.parse(cartData)
          cart.forEach((item: CartItem) => {
            dispatch({ type: 'ADD_TO_CART', payload: item })
            if (item.quantity > 1) {
              dispatch({ 
                type: 'UPDATE_CART_QUANTITY', 
                payload: { id: item.id, quantity: item.quantity }
              })
            }
          })
        } catch (error) {
          console.error('Error parsing cart data:', error)
          localStorage.removeItem('cart')
        }
      }

      // Load wishlist from localStorage
      const wishlistData = localStorage.getItem('wishlist')
      if (wishlistData) {
        try {
          const wishlist = JSON.parse(wishlistData)
          wishlist.forEach((item: Product) => {
            dispatch({ type: 'ADD_TO_WISHLIST', payload: item })
          })
        } catch (error) {
          console.error('Error parsing wishlist data:', error)
          localStorage.removeItem('wishlist')
        }
      }
    }
  }, [])

  // Save cart to localStorage when it changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(state.cartItems))
    }
  }, [state.cartItems])

  // Save wishlist to localStorage when it changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist))
    }
  }, [state.wishlist])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

// Hook
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Helper hooks
export function useAuth() {
  const { state, dispatch } = useApp()
  
  const login = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user))
    dispatch({ type: 'SET_USER', payload: user })
  }
  
  const logout = () => {
    localStorage.removeItem('user')
    dispatch({ type: 'SET_USER', payload: null })
    dispatch({ type: 'CLEAR_CART' })
  }
  
  return {
    user: state.user,
    login,
    logout,
    isAuthenticated: !!state.user
  }
}

export function useCart() {
  const { state, dispatch } = useApp()
  
  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
  }
  
  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
  }
  
  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: productId, quantity } })
  }
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  
  const cartTotal = state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartCount = state.cartItems.reduce((count, item) => count + item.quantity, 0)
  
  return {
    cartItems: state.cartItems,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
}

export function useWishlist() {
  const { state, dispatch } = useApp()
  
  const addToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product })
  }
  
  const removeFromWishlist = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId })
  }
  
  const isInWishlist = (productId: number) => {
    return state.wishlist.some(item => item.id === productId)
  }
  
  return {
    wishlist: state.wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  }
}
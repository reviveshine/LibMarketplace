import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string;
  name: string;
  email: string;
  type: 'seller' | 'buyer' | 'admin';
  status: 'pending' | 'verified' | 'rejected';
  sellerId?: string;
  buyerId?: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('libmarketplace_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Demo users for testing
    const demoUsers = [
      {
        id: '1',
        name: 'reviveshine',
        email: 'reviveshine@mylibmarketplace.com',
        type: 'seller' as const,
        status: 'verified' as const,
        sellerId: 'RSH001',
        phone: '+231-555-0001',
        address: 'Nimba County, Liberia'
      },
      {
        id: '2',
        name: 'John Buyer',
        email: 'buyer@test.com',
        type: 'buyer' as const,
        status: 'verified' as const,
        buyerId: 'BUY001',
        phone: '+231-555-0002',
        address: 'Monrovia, Liberia'
      },
      {
        id: '3',
        name: 'Admin User',
        email: 'admin@mylibmarketplace.com',
        type: 'admin' as const,
        status: 'verified' as const,
        phone: '+231-555-0000',
        address: 'Monrovia, Liberia'
      }
    ]

    // Simple demo authentication
    const foundUser = demoUsers.find(u => u.email === email)
    if (foundUser && password === 'demo123') {
      setUser(foundUser)
      localStorage.setItem('libmarketplace_user', JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true)
    
    // Generate ID based on user type
    const userId = Date.now().toString()
    const typePrefix = userData.type === 'seller' ? 'RSH' : 'BUY'
    const generatedId = `${typePrefix}${String(Date.now()).slice(-3)}`

    const newUser: User = {
      id: userId,
      name: userData.name,
      email: userData.email,
      type: userData.type,
      status: 'pending', // All new users start as pending
      phone: userData.phone,
      address: userData.address,
      ...(userData.type === 'seller' ? { sellerId: generatedId } : { buyerId: generatedId })
    }

    // In a real app, this would make an API call
    setUser(newUser)
    localStorage.setItem('libmarketplace_user', JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('libmarketplace_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
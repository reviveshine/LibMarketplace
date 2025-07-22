import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '../components/ProductCard'
import { AppProvider } from '../contexts/AppContext'

// Mock product data
const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'This is a test product description',
  price: 29.99,
  stock: 10,
  image: 'https://example.com/image.jpg',
  category: 'Test Category'
}

// Wrapper component with context
const renderWithContext = (component: React.ReactElement) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  )
}

describe('ProductCard Component', () => {
  it('renders product information correctly', () => {
    renderWithContext(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('This is a test product description')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    expect(screen.getByText('Stock: 10')).toBeInTheDocument()
  })

  it('displays product image with correct alt text', () => {
    renderWithContext(<ProductCard product={mockProduct} />)
    
    const image = screen.getByAltText('Test Product')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('shows add to cart button', () => {
    renderWithContext(<ProductCard product={mockProduct} />)
    
    const addToCartButton = screen.getByText(/add to cart/i)
    expect(addToCartButton).toBeInTheDocument()
  })

  it('shows ask seller button', () => {
    renderWithContext(<ProductCard product={mockProduct} />)
    
    const askButton = screen.getByText(/ask/i)
    expect(askButton).toBeInTheDocument()
  })

  it('handles add to cart click', () => {
    renderWithContext(<ProductCard product={mockProduct} />)
    
    const addToCartButton = screen.getByText(/add to cart/i)
    fireEvent.click(addToCartButton)
    
    // The button should still be present after clicking
    expect(addToCartButton).toBeInTheDocument()
  })

  it('renders compact variant correctly', () => {
    renderWithContext(<ProductCard product={mockProduct} variant="compact" />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
    
    // In compact mode, description might be hidden or truncated
    const image = screen.getByAltText('Test Product')
    expect(image).toHaveClass('h-32') // Compact variant has smaller height
  })

  it('disables actions when showActions is false', () => {
    renderWithContext(<ProductCard product={mockProduct} showActions={false} />)
    
    expect(screen.queryByText(/add to cart/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/ask/i)).not.toBeInTheDocument()
  })
})
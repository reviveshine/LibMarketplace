// LibMarketplace JavaScript Application

function libMarketplace() {
    return {
        currentSection: 'products',
        showCart: false,
        showMessages: false,
        newMessage: '',
        cartItems: [],
        contactForm: { name: '', email: '', phone: '', subject: 'general', message: '', newsletter: false },
        products: [
            { 
                id: 1, 
                name: 'Traditional Kente Cloth', 
                description: 'Handwoven authentic kente cloth from Liberian artisans', 
                price: 89.99, 
                stock: 15, 
                image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=300&h=200&fit=crop' 
            },
            { 
                id: 2, 
                name: 'Nimba County Coffee', 
                description: 'Premium arabica coffee beans from Nimba mountains', 
                price: 24.99, 
                stock: 50, 
                image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop' 
            },
            { 
                id: 3, 
                name: 'Carved Wooden Elephant', 
                description: 'Beautiful elephant sculpture representing Liberian wildlife', 
                price: 45.00, 
                stock: 8, 
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' 
            },
            { 
                id: 4, 
                name: 'Pure Palm Oil', 
                description: 'Authentic red palm oil from Liberian palm trees', 
                price: 19.99, 
                stock: 30, 
                image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop' 
            },
            { 
                id: 5, 
                name: 'Traditional Talking Drum', 
                description: 'Authentic talking drum handcrafted by local musicians', 
                price: 125.00, 
                stock: 5, 
                image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop' 
            },
            { 
                id: 6, 
                name: 'Liberian Flag Jewelry', 
                description: 'Beautiful jewelry featuring Liberian flag colors', 
                price: 35.99, 
                stock: 20, 
                image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop' 
            }
        ],
        messages: [
            { id: 1, from: 'reviveshine (RSH001)', text: 'Welcome! How can I help you find authentic Liberian products?', time: '2 hours ago' },
            { id: 2, from: 'System', text: 'Browse products or message RSH001 directly for inquiries.', time: '1 hour ago' }
        ],
        
        get cartTotal() {
            return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
        },
        
        addToCart(product) {
            const existing = this.cartItems.find(item => item.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                this.cartItems.push({...product, quantity: 1});
            }
        },
        
        removeFromCart(productId) {
            this.cartItems = this.cartItems.filter(item => item.id !== productId);
        },
        
        updateQuantity(productId, newQuantity) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
                return;
            }
            const item = this.cartItems.find(item => item.id === productId);
            if (item) item.quantity = newQuantity;
        },
        
        checkout() {
            alert(`Order placed! Total: $${this.cartTotal}. RSH001 will contact you within 24 hours.`);
            this.cartItems = [];
            this.showCart = false;
        },
        
        messageAboutProduct(product) {
            this.showMessages = true;
            this.messages.unshift({
                id: Date.now(),
                from: 'You',
                text: `Hi, I'm interested in the ${product.name}. Can you tell me more?`,
                time: 'just now'
            });
        },
        
        sendQuickMessage() {
            if (!this.newMessage.trim()) return;
            this.messages.unshift({
                id: Date.now(),
                from: 'You',
                text: this.newMessage,
                time: 'just now'
            });
            this.newMessage = '';
        },
        
        sendMessage() {
            if (!validateForm(this.contactForm)) {
                return;
            }
            alert(`Thank you ${this.contactForm.name}! Message sent to RSH001. We'll respond within 24 hours.`);
            this.contactForm = { name: '', email: '', phone: '', subject: 'general', message: '', newsletter: false };
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Additional initialization code can go here
    console.log('LibMarketplace application initialized');
});

// Navigation helpers for multi-page setup
function navigateToPage(page) {
    window.location.href = page;
}

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm(formData) {
    if (!formData.name || !formData.email || !formData.message) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    if (!validateEmail(formData.email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    return true;
}

// Local storage helpers
function saveCartToStorage(cartItems) {
    localStorage.setItem('libmarketplace_cart', JSON.stringify(cartItems));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('libmarketplace_cart');
    return saved ? JSON.parse(saved) : [];
}

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { libMarketplace, navigateToPage, validateForm };
}
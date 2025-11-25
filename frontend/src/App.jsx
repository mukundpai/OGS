import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Oracle from './components/Oracle';
import Footer from './components/Footer';
import AllProducts from './pages/AllProducts';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Gallery from './pages/Gallery';
import Profile from './pages/Profile';
import Cart from './pages/Cart';

const Home = ({ addToCart }) => (
  <>
    <Hero />
    <div className="marquee-container">
      <div className="marquee-content">
        300 GSM ART PAPER /// MATTE & GLOSS FINISH /// MUSEUM GRADE FRAMES /// LIMITED EDITION PRINTS /// F1 & GP /// ANIME /// BOLLYWOOD LEGENDS /// CRICKET ICONS /// WORLDWIDE SHIPPING /// 300 GSM ART PAPER ///
      </div>
    </div>
    <ProductGrid addToCart={addToCart} />
    <Oracle />
  </>
);

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    triggerToast(`ADDED TO CART: ${product.title}`);
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <div className="noise-overlay"></div>

          <div className={`toast ${showToast ? 'show' : ''}`}>
            <span dangerouslySetInnerHTML={{ __html: toastMessage }}></span>
          </div>

          <Navbar cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} />

          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/shop" element={<AllProducts />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
            <Route path="/checkout" element={<Checkout cartItems={cartItems} clearCart={clearCart} />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

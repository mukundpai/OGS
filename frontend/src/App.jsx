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

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
    triggerToast("SYSTEM: Item added to cart.");
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const Home = () => (
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

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <div className="noise-overlay"></div>

          <div className={`toast ${showToast ? 'show' : ''}`}>
            <span dangerouslySetInnerHTML={{ __html: toastMessage }}></span>
          </div>

          <Navbar cartCount={cartCount} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<AllProducts />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

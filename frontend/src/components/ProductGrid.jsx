import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductGrid = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => {
                // Filter products with badges (featured/best products) and limit to 8
                const featuredProducts = data
                    .filter(product => product.badge) // Only products with badges
                    .slice(0, 8); // Limit to 8 products

                // If we don't have 8 featured products, fill with regular products
                if (featuredProducts.length < 8) {
                    const remainingProducts = data
                        .filter(product => !product.badge)
                        .slice(0, 8 - featuredProducts.length);
                    setProducts([...featuredProducts, ...remainingProducts]);
                } else {
                    setProducts(featuredProducts);
                }

                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="container section text-center">LOADING ARCHIVE...</div>;
    }

    return (
        <section id="collection" className="section container">
            <div className="flex justify-between items-end mb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>LATEST<br />ARCHIVE</h2>
                <div className="font-mono text-xs text-right hidden-mobile text-gray">
                    DISPLAYING 1-{products.length}<br />
                    SERIES: ICONS
                </div>
            </div>

            <div className="grid">
                {products.map(product => (
                    <div
                        key={product.id}
                        className="product-card"
                        onClick={() => navigate(`/product/${product.id}`)}
                    >
                        <div
                            className="product-image"
                            style={product.image_url ? {
                                backgroundImage: `url(http://localhost:5000${product.image_url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            } : {}}
                        >
                            {!product.image_url && (
                                <div className={product.image_pattern}></div>
                            )}
                            <div className="product-overlay">
                                <button
                                    className="add-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(product);
                                    }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                            {product.badge && (
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '10px',
                                    background: product.badge_color || '#000',
                                    color: product.badge_text_color || '#fff',
                                    fontSize: '10px',
                                    fontFamily: 'var(--font-mono)',
                                    padding: '4px 8px',
                                    fontWeight: 'bold',
                                    letterSpacing: '0.05em'
                                }}>
                                    {product.badge}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 style={{ fontWeight: 700 }}>{product.title}</h3>
                                <p className="font-mono text-xs text-gray">{product.subtitle}</p>
                            </div>
                            <span className="font-mono">{product.price}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductGrid;

import React, { useState, useEffect } from 'react';

const ProductGrid = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
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
                    DISPLAYING 1-{products.length} OF 108<br />
                    SERIES: ICONS
                </div>
            </div>

            <div className="grid">
                {products.map(product => (
                    <div key={product.id} className="product-card" onClick={addToCart}>
                        <div className={`product-image ${product.image_pattern}`}>
                            <div className="product-overlay">
                                <span className="add-btn">Add to Cart</span>
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
                                    padding: '4px 8px'
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

import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
            <div className={`product-image ${product.image_pattern}`} style={product.image_url ? { backgroundImage: `url(http://localhost:5000${product.image_url})`, backgroundSize: 'cover' } : {}}>
                <div className="product-overlay">
                    <span className="add-btn">View Details</span>
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
    );
};

export default ProductCard;

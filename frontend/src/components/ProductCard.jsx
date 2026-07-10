import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
            <div className={`product-image ${product.image_pattern}`} style={product.image_url ? { backgroundImage: `url(${product.image_url})`, backgroundSize: 'cover' } : {}}>
                <div className="product-overlay">
                    <span className="add-btn">View Details</span>
                </div>
                {product.badge && (
                    <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: product.badge_color || '#000',
                        color: product.badge_text_color || '#fff',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        padding: '4px 8px',
                        borderRadius: '2px',
                        fontWeight: 'bold',
                        letterSpacing: '0.05em',
                        zIndex: 5
                    }}>
                        {product.badge}
                    </div>
                )}
            </div>
            <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base leading-tight truncate">{product.title}</h3>
                    <p className="font-mono text-xs text-gray truncate">{product.subtitle}</p>
                </div>
                <span className="font-mono text-xs sm:text-sm text-white whitespace-nowrap">{product.price}</span>
            </div>
        </div>
    );
};

export default ProductCard;

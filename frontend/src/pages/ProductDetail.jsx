import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import Accordion from '../components/Accordion';
import ReviewSection from '../components/ReviewSection';
import ProductCard from '../components/ProductCard';

const ProductDetail = ({ addToCart }) => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [frameType, setFrameType] = useState('Black');
    const [size, setSize] = useState('A3');

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data));

        // Fetch related products (mock logic: just fetch all and take first 4)
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => setRelatedProducts(data.slice(0, 4)));
    }, [id]);

    if (!product) return <div className="container section text-center" style={{ paddingTop: '100px' }}>LOADING...</div>;

    return (
        <div className="container section" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xxs font-mono text-gray mb-6 uppercase">
                <Link to="/" className="hover:text-white">Home</Link>
                <ChevronRight size={10} />
                <Link to="/shop" className="hover:text-white">{product.category} Posters</Link>
                <ChevronRight size={10} />
                <span className="text-white">{product.title}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-16 mb-16 items-start">
                {/* Left Column: Image with Measurements */}
                <div className="flex-1 lg:max-w-500 relative lg:pr-8">
                    <div className="bg-white p-4 shadow-2xl relative">
                        {/* Height Measurement - Left Side */}
                        <div style={{
                            position: 'absolute',
                            left: '-40px',
                            top: '16px',
                            bottom: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                        }}>
                            <div style={{ width: '1px', flex: 1, background: '#fff' }}></div>
                            <span style={{
                                fontSize: '10px',
                                fontFamily: 'var(--font-mono)',
                                color: '#fff',
                                background: '#000',
                                padding: '2px 4px',
                                whiteSpace: 'nowrap'
                            }}>42.0 cm</span>
                            <div style={{ width: '1px', flex: 1, background: '#fff' }}></div>
                        </div>

                        {/* Width Measurement - Bottom */}
                        <div style={{
                            position: 'absolute',
                            left: '16px',
                            right: '16px',
                            bottom: '-30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                        }}>
                            <div style={{ height: '1px', flex: 1, background: '#fff' }}></div>
                            <span style={{
                                fontSize: '10px',
                                fontFamily: 'var(--font-mono)',
                                color: '#fff',
                                background: '#000',
                                padding: '2px 4px',
                                whiteSpace: 'nowrap'
                            }}>29.7 cm</span>
                            <div style={{ height: '1px', flex: 1, background: '#fff' }}></div>
                        </div>

                        <div className={`product-image ${product.image_pattern}`} style={{
                            width: '100%',
                            aspectRatio: '1/1.414',
                            backgroundImage: product.image_url ? `url(http://localhost:5000${product.image_url})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
                            border: '2px solid #000'
                        }}></div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold mb-1 leading-tight">{product.title}</h1>
                    <p className="text-lg text-gray mb-4">{product.subtitle}</p>

                    <div className="text-2xl font-bold text-white mb-6">{product.price}</div>

                    <div className="mb-8">
                        <label className="block text-xxs font-bold uppercase mb-2">Poster Size</label>
                        <div className="flex gap-3">
                            {['A3', 'A2', 'A1'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSize(s)}
                                    className={`px-4 py-2 border text-xs font-mono uppercase transition-all ${size === s ? 'border-white text-white bg-gray-900' : 'border-gray-700 text-gray hover:border-white'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 mb-8">
                        <button onClick={addToCart} className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 uppercase tracking-wider flex items-center justify-center gap-2 transition-colors text-sm">
                            <ShoppingCart size={18} />
                            Add to Cart
                        </button>
                        <button className="w-full bg-transparent border border-gray-700 hover:border-white text-white font-bold py-3 uppercase tracking-wider transition-colors text-sm">
                            Buy Now
                        </button>
                    </div>

                    {/* Accordions */}
                    <div className="border-t border-gray-800">
                        <Accordion title="Product Details" defaultOpen={true}>
                            <p className="text-sm text-gray-400">Premium 200gsm matte art paper for a high-quality finish. Printed using state-of-the-art Giclée printing technology for vibrant, lasting colors. Frame made from sustainably sourced solid wood.</p>
                        </Accordion>
                        <Accordion title="The Story">
                            <p className="text-sm text-gray-400">Capture the historic moment with this exclusive tribute poster. Designed by fans, for fans. This piece celebrates the legacy of {product.category} culture.</p>
                        </Accordion>
                        <Accordion title="Shipping Info">
                            <p className="text-sm text-gray-400">Ships in 3-5 business days. Worldwide shipping available. Packaged in protective tubes to ensure safe delivery.</p>
                        </Accordion>
                    </div>
                </div>
            </div>

            <ReviewSection />

            {/* Related Products */}
            <div className="mt-16">
                <h2 className="text-xl font-bold mb-6">You Might Also Like</h2>
                <div className="grid">
                    {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

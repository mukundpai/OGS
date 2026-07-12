import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = ({ cartItems, updateQuantity, removeFromCart }) => {
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => {
        const price = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
        return acc + (price * item.quantity);
    }, 0);

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-black mb-4">YOUR CART IS EMPTY</h1>
                <p className="text-gray-500 font-mono mb-8">Looks like you haven't added any art yet.</p>
                <button
                    onClick={() => navigate('/shop')}
                    className="bg-white text-black px-8 py-3 font-bold hover:bg-gray-200 transition-colors inline-flex items-center space-x-2"
                >
                    <span>BROWSE THE ARCHIVE</span>
                    <ArrowRight size={18} />
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-12">CART ({cartItems.length})</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-8">
                    {cartItems.map(item => {
                        const price = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
                        return (
                            <div key={item.cartItemId} className="flex gap-6 border-b border-white/10 pb-8">
                                {/* Image */}
                                <div className="flex-shrink-0 relative overflow-hidden bg-gray-900" style={{ width: '100px', height: '130px' }}>
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className={`w-full h-full ${item.image_pattern}`}></div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg">{item.title}</h3>
                                            <p className="font-mono font-bold">₹{(price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <p className="text-gray-500 font-mono text-xs">{item.subtitle}</p>
                                        <p className="text-gray-500 font-mono text-xs mt-1">SIZE: {item.size || 'A3'} / FRAME: {item.frame || 'Standard'}</p>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center border border-white/20">
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                                className="p-2 hover:bg-white/10 transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="px-4 font-mono text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                                className="p-2 hover:bg-white/10 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.cartItemId)}
                                            className="text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 p-8 border border-white/10 sticky top-32">
                        <h2 className="font-mono text-sm tracking-widest text-gray-400 mb-6">ORDER SUMMARY</h2>

                        <div className="space-y-4 mb-8 border-b border-white/10 pb-8">
                            <div className="flex justify-between font-mono text-sm">
                                <span className="text-gray-400">Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-mono text-sm">
                                <span className="text-gray-400">Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="flex justify-between font-bold text-xl mb-8">
                            <span>TOTAL</span>
                            <span>₹{subtotal.toFixed(2)}</span>

                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-white text-black py-4 font-bold hover:bg-gray-200 transition-colors flex justify-center items-center space-x-2"
                        >
                            <span>PROCEED TO CHECKOUT</span>
                            <ArrowRight size={18} />
                        </button>

                        <p className="text-center text-gray-500 text-[10px] font-mono mt-4">
                            SECURE CHECKOUT • WORLDWIDE SHIPPING
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

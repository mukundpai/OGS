import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Checkout = ({ cartItems, clearCart }) => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [status, setStatus] = useState('idle'); // idle, processing, success
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [formData, setFormData] = useState({
        fullName: user?.full_name || '',
        email: user?.email || '',
        address: '',
        city: '',
        zip: '',
        cardNumber: '',
        expiry: '',
        cvc: '',
        upiId: ''
    });

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping for now
    const total = subtotal + shipping;

    useEffect(() => {
        if (cartItems.length === 0 && status !== 'success') {
            navigate('/cart');
        }
    }, [cartItems, navigate, status]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        setStatus('processing');

        // Simulate payment processing
        setTimeout(() => {
            fetch('http://localhost:5000/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cartItems,
                    total: total,
                    shipping_address: formData,
                    payment_method: paymentMethod
                })
            })
                .then(res => res.json())
                .then(data => {
                    setStatus('success');
                    clearCart();
                })
                .catch(err => {
                    console.error(err);
                    setStatus('idle');
                    alert('Payment failed. Please try again.');
                });
        }, 2000);
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
                    <CheckCircle size={40} className="text-black" />
                </div>
                <h1 className="text-4xl font-black mb-4">ORDER CONFIRMED</h1>
                <p className="text-gray-500 font-mono mb-8 max-w-md">
                    Thank you for your patronage. Your art is being prepared for shipment. A confirmation email has been sent to {formData.email}.
                </p>
                <button
                    onClick={() => navigate('/profile')}
                    className="bg-white text-black px-8 py-3 font-bold hover:bg-gray-200 transition-colors"
                >
                    VIEW ORDER STATUS
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-6">
            <h1 className="text-4xl font-black tracking-tighter mb-12">CHECKOUT</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Left Column: Forms */}
                <div>
                    <form id="checkout-form" onSubmit={handleCheckout} className="space-y-12">
                        {/* Shipping Info */}
                        <div>
                            <h2 className="font-mono text-sm tracking-widest text-gray-400 mb-6 border-b border-white/10 pb-2">SHIPPING DETAILS</h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="FULL NAME"
                                    className="oracle-input w-full"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="EMAIL"
                                    className="oracle-input w-full"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="STREET ADDRESS"
                                    className="oracle-input w-full"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="CITY"
                                        className="oracle-input"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="zip"
                                        placeholder="ZIP CODE"
                                        className="oracle-input"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div>
                            <h2 className="font-mono text-sm tracking-widest text-gray-400 mb-6 border-b border-white/10 pb-2">PAYMENT METHOD</h2>

                            {/* Payment Tabs */}
                            <div className="flex space-x-4 mb-8">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex-1 py-3 border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-white bg-white/10' : 'border-white/20 text-gray-500 hover:border-white/50'
                                        }`}
                                >
                                    <CreditCard size={20} />
                                    <span className="text-[10px] font-mono font-bold">CARD</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`flex-1 py-3 border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'upi' ? 'border-white bg-white/10' : 'border-white/20 text-gray-500 hover:border-white/50'
                                        }`}
                                >
                                    <Smartphone size={20} />
                                    <span className="text-[10px] font-mono font-bold">UPI</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('netbanking')}
                                    className={`flex-1 py-3 border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'netbanking' ? 'border-white bg-white/10' : 'border-white/20 text-gray-500 hover:border-white/50'
                                        }`}
                                >
                                    <Building size={20} />
                                    <span className="text-[10px] font-mono font-bold">NET BANKING</span>
                                </button>
                            </div>

                            {/* Payment Fields */}
                            <div className="bg-white/5 p-6 border border-white/10">
                                {paymentMethod === 'card' && (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            placeholder="CARD NUMBER"
                                            className="oracle-input w-full"
                                            maxLength="19"
                                            required
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="expiry"
                                                placeholder="MM/YY"
                                                className="oracle-input"
                                                maxLength="5"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="cvc"
                                                placeholder="CVC"
                                                className="oracle-input"
                                                maxLength="3"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'upi' && (
                                    <div className="space-y-4">
                                        <p className="text-xs text-gray-400 font-mono mb-2">ENTER YOUR UPI ID (e.g. name@okhdfcbank)</p>
                                        <input
                                            type="text"
                                            name="upiId"
                                            placeholder="UPI ID"
                                            className="oracle-input w-full"
                                            required
                                        />
                                    </div>
                                )}

                                {paymentMethod === 'netbanking' && (
                                    <div className="space-y-4">
                                        <p className="text-xs text-gray-400 font-mono mb-2">SELECT YOUR BANK</p>
                                        <select className="oracle-input w-full bg-black">
                                            <option>HDFC Bank</option>
                                            <option>ICICI Bank</option>
                                            <option>SBI</option>
                                            <option>Axis Bank</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 mt-4 text-gray-500">
                                <Lock size={12} />
                                <span className="text-[10px] font-mono">PAYMENTS ARE SECURE AND ENCRYPTED</span>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Column: Order Summary */}
                <div>
                    <div className="bg-white p-8 text-black sticky top-32">
                        <h2 className="font-black text-2xl mb-8">ORDER SUMMARY</h2>

                        <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-20 bg-gray-200 flex-shrink-0 relative overflow-hidden">
                                        {item.image_url ? (
                                            <img
                                                src={`http://localhost:5000${item.image_url}`}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gray-300`}></div>
                                        )}
                                        <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-1">
                                            x{item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm uppercase">{item.title}</h4>
                                        <p className="text-xs text-gray-600 font-mono">{item.size} / {item.frame}</p>
                                        <p className="text-sm font-bold mt-1">${item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-black/10 pt-6 space-y-2 mb-8">
                            <div className="flex justify-between font-mono text-sm">
                                <span>SUBTOTAL</span>
                                <span>${subtotal}</span>
                            </div>
                            <div className="flex justify-between font-mono text-sm">
                                <span>SHIPPING</span>
                                <span>FREE</span>
                            </div>
                        </div>

                        <div className="flex justify-between font-black text-xl mb-8 border-t border-black pt-6">
                            <span>TOTAL</span>
                            <span>${total}</span>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="w-full bg-black text-white py-4 font-bold hover:bg-gray-800 transition-colors flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={status === 'processing'}
                        >
                            {status === 'processing' ? (
                                <span className="animate-pulse">PROCESSING PAYMENT...</span>
                            ) : (
                                <span>PAY ${total}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

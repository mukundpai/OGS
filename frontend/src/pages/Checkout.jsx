import React, { useState } from 'react';

const Checkout = () => {
    const [status, setStatus] = useState('idle'); // idle, processing, success

    const handleCheckout = (e) => {
        e.preventDefault();
        setStatus('processing');
        setTimeout(() => {
            fetch('http://localhost:5000/api/checkout', { method: 'POST', body: JSON.stringify({}) })
                .then(res => res.json())
                .then(data => setStatus('success'));
        }, 2000);
    };

    if (status === 'success') {
        return (
            <div className="container section text-center" style={{ paddingTop: '120px' }}>
                <h1 className="text-xl font-bold mb-4">ORDER CONFIRMED</h1>
                <p className="font-mono text-gray">THANK YOU FOR YOUR PATRONAGE.</p>
            </div>
        );
    }

    return (
        <div className="container section" style={{ paddingTop: '120px', maxWidth: '600px' }}>
            <h1 className="text-xl font-bold mb-8">CHECKOUT</h1>
            <form onSubmit={handleCheckout} className="flex flex-col gap-4">
                <input type="text" placeholder="FULL NAME" className="oracle-input" required />
                <input type="email" placeholder="EMAIL" className="oracle-input" required />
                <input type="text" placeholder="ADDRESS" className="oracle-input" required />
                <div className="flex gap-4">
                    <input type="text" placeholder="CITY" className="oracle-input" required />
                    <input type="text" placeholder="ZIP" className="oracle-input" required />
                </div>
                <button type="submit" className="cta-btn justify-center mt-8" disabled={status === 'processing'}>
                    {status === 'processing' ? 'PROCESSING...' : 'PLACE ORDER'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;

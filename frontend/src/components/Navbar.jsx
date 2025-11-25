import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount }) => {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="container flex justify-between items-center w-full">
                <Link to="/" className="logo">
                    OG LABS<span style={{ fontSize: '0.5em', verticalAlign: 'top', opacity: 0.5 }}>®</span>
                </Link>

                <div className="nav-links hidden-mobile">
                    <Link to="/shop">[ The Wall ]</Link>
                    <Link to="/gallery">[ The Exhibit ]</Link>
                    <a href="/#oracle">[ The Oracle ]</a>
                </div>

                <button className="relative" onClick={() => navigate('/checkout')}>
                    <ShoppingBag width={24} height={24} />
                    <span id="cart-count" style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: '#fff',
                        color: '#000',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '2px'
                    }}>{cartCount}</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

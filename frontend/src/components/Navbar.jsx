import React, { useState } from 'react';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ cartCount }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

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

                <div className="flex items-center space-x-6">
                    <button className="relative" onClick={() => navigate('/cart')}>
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

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            className="hover:text-gray-300 transition-colors"
                            onMouseEnter={() => setShowUserMenu(true)}
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <User width={24} height={24} />
                        </button>

                        {/* Dropdown */}
                        {showUserMenu && (
                            <div
                                className="absolute right-0 top-full mt-2 w-48 bg-black border border-white/20 shadow-xl z-50 py-2"
                                onMouseLeave={() => setShowUserMenu(false)}
                            >
                                {user ? (
                                    <>
                                        <div className="px-4 py-2 border-b border-white/10 mb-2">
                                            <p className="text-[10px] text-gray-500 font-mono">SIGNED IN AS</p>
                                            <p className="text-xs font-bold truncate">{user.full_name}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm hover:bg-white/10 font-mono"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            PROFILE
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 font-mono text-red-500"
                                        >
                                            LOGOUT
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block px-4 py-2 text-sm hover:bg-white/10 font-mono"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            LOGIN
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="block px-4 py-2 text-sm hover:bg-white/10 font-mono"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            SIGNUP
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

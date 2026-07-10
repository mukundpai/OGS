import React, { useState } from 'react';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ cartCount }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container flex justify-between items-center w-full">
                <Link to="/" className="logo">
                    OG LABS<span style={{ fontSize: '0.5em', verticalAlign: 'top', opacity: 0.5 }}>®</span>
                </Link>

                <div className="nav-links">
                    <Link to="/shop" className={isActive('/shop') ? 'text-white' : ''}>

                        [ THE WALL ]
                    </Link>
                    <Link to="/gallery" className={isActive('/gallery') ? 'text-white' : ''}>
                        [ THE EXHIBIT ]
                    </Link>
                    <a href="/#oracle">[ THE ORACLE ]</a>
                </div>

                <div className="flex items-center gap-8">
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
                                className="absolute top-full mt-2 bg-black border border-white/20 shadow-xl z-50 py-2"
                                style={{ width: '300px', right: '0' }}
                                onMouseLeave={() => setShowUserMenu(false)}
                            >
                                {user ? (
                                    <>
                                        <div className="px-6 py-3 border-b border-white/10 mb-2">
                                            <p className="text-xs text-gray-500 font-mono mb-1">SIGNED IN AS</p>
                                            <p className="text-sm font-bold truncate">{user.full_name}</p>
                                        </div>
                                        {user.is_super_user && (
                                            <div className="px-6 py-2">
                                                <Link
                                                    to="/admin"
                                                    className="block w-full py-3 text-center border border-yellow-500 text-yellow-500 font-bold font-mono text-sm hover:bg-yellow-500 hover:text-black transition-all duration-300"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    ADMIN PANEL
                                                </Link>
                                            </div>
                                        )}
                                        <div className="px-6 py-2">
                                            <Link
                                                to="/profile"
                                                className="block w-full py-3 text-center border border-white text-white font-bold font-mono text-sm hover:bg-white hover:text-black transition-all duration-300"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                PROFILE
                                            </Link>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-6 py-3 text-base hover:bg-white/10 font-mono text-red-500"
                                        >
                                            LOGOUT
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block px-6 py-3 text-base hover:bg-white/10 font-mono"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            LOGIN
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="block px-6 py-3 text-base hover:bg-white/10 font-mono"
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

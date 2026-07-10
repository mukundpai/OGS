import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, User, LogOut, Loader } from 'lucide-react';

const Profile = () => {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
                    <div>
                        <p className="font-mono text-xs text-gray-500 mb-2">MEMBER PROFILE</p>
                        <h1 className="text-4xl font-black tracking-tighter">{user.full_name.toUpperCase()}</h1>
                        <p className="font-mono text-sm text-gray-400 mt-2">{user.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-xs font-mono text-red-500 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={14} />
                        <span>LOGOUT</span>
                    </button>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Stats / Info */}
                    <div className="space-y-8">
                        <div className="bg-white/5 p-6 border border-white/10">
                            <div className="flex items-center space-x-3 mb-4 text-gray-400">
                                <User size={18} />
                                <span className="font-mono text-xs tracking-widest">ACCOUNT STATUS</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-bold">ACTIVE MEMBER</span>
                            </div>
                            {user.is_super_user && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="mt-4 w-full bg-white text-black text-xs font-bold py-3 font-mono hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <span>ACCESS ADMIN PANEL</span>
                                    <Package size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-8">
                            <Package size={18} className="text-gray-400" />
                            <h2 className="font-mono text-sm tracking-widest text-gray-400">ORDER HISTORY</h2>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader className="animate-spin text-gray-600" />
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order.id} className="group border border-white/10 p-6 hover:border-white/30 transition-colors bg-black">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="font-mono text-xs text-gray-500 mb-1">ORDER ID</p>
                                                <p className="font-mono font-bold text-lg">{order.id}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono text-xs text-gray-500 mb-1">DATE</p>
                                                <p className="font-mono text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end pt-4 border-t border-white/5">
                                            <div>
                                                <span className={`inline-flex items-center px-2 py-1 text-[10px] font-mono uppercase border ${order.status === 'completed' ? 'border-green-500/50 text-green-500' : 'border-gray-500 text-gray-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="font-mono text-xl font-bold">₹{order.total_amount}</p>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border border-dashed border-white/10">
                                <p className="text-gray-500 font-mono text-sm">No orders yet.</p>
                                <button
                                    onClick={() => navigate('/shop')}
                                    className="mt-4 text-white text-xs font-bold underline hover:text-gray-300"
                                >
                                    START SHOPPING
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

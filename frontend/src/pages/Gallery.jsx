import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GalleryCard from '../components/GalleryCard';
import UploadModal from '../components/UploadModal';
import { Plus, Filter, Loader } from 'lucide-react';

const Gallery = () => {
    const { user, token } = useAuth();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [filter, setFilter] = useState('newest'); // newest, popular, featured
    const [uploadStatus, setUploadStatus] = useState(null); // success, error

    useEffect(() => {
        fetchGallery();
    }, [filter]);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/gallery?sort=${filter}`);
            const data = await res.json();
            setSubmissions(data.submissions || []);
        } catch (err) {
            console.error("Error fetching gallery:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (formData) => {
        if (!token) {
            throw new Error("Please login to upload");
        }

        const res = await fetch('/api/gallery/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Upload failed");
        }

        setUploadStatus('success');
        setTimeout(() => setUploadStatus(null), 5000);
    };

    const handleLike = async (id) => {
        if (!token) return; // Silent fail if not logged in, or show toast

        try {
            await fetch(`/api/gallery/${id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (err) {
            console.error("Error liking submission:", err);
        }
    };

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20">
            {/* Hero Section */}
            <div className="container mx-auto px-4 sm:px-6 mb-12 sm:mb-16 text-center">
                <p className="font-mono text-gray-400 text-xs tracking-widest mb-3 sm:mb-4">COMMUNITY SHOWCASE</p>
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 sm:mb-6">THE EXHIBIT</h1>
                <p className="text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-8 font-light text-sm sm:text-base leading-relaxed">
                    See how our community brings culture to their spaces.
                    Verified customers can share their setups to be featured.
                </p>

                <button
                    onClick={() => setShowUploadModal(true)}
                    className="group relative px-6 sm:px-8 py-2 sm:py-3 overflow-hidden border border-white/20 hover:border-white transition-colors duration-300"
                >
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <div className="relative flex items-center space-x-2 group-hover:text-black transition-colors duration-300">
                        <Plus size={16} />
                        <span className="font-mono text-xs sm:text-sm tracking-widest">UPLOAD YOUR WALL</span>
                    </div>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12 flex flex-col sm:flex-row sm:justify-center gap-4 sm:gap-12 border-b border-white/5 pb-4 sm:pb-6 overflow-x-auto">
                {['newest', 'popular', 'featured'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`text-xs font-mono tracking-[0.2em] uppercase transition-all duration-300 whitespace-nowrap ${filter === f
                            ? 'text-white border-b border-white pb-4 sm:pb-6 -mb-4 sm:-mb-6.5'
                            : 'text-gray-600 hover:text-white'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Gallery Grid */}
            <div className="container mx-auto px-4 sm:px-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="animate-spin text-gray-500" />
                    </div>
                ) : submissions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                        {submissions.map(sub => (
                            <GalleryCard
                                key={sub.id}
                                submission={sub}
                                onLike={handleLike}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 sm:py-20 border border-dashed border-white/10 rounded-lg">
                        <p className="text-gray-500 font-mono text-sm">No submissions yet. Be the first!</p>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <UploadModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onUpload={handleUpload}
            />

            {/* Success Toast */}
            {uploadStatus === 'success' && (
                <div className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 bg-green-500 text-black px-4 sm:px-6 py-3 sm:py-4 font-mono text-xs sm:text-sm font-bold animate-in slide-in-from-bottom duration-300 z-50 rounded">
                    SUBMISSION RECEIVED! PENDING APPROVAL.
                </div>
            )}
        </div>
    );
};

export default Gallery;

import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

const UploadModal = ({ isOpen, onClose, onUpload }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        location: '',
        caption: '',
        products_featured: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            if (selected.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select an image');
            return;
        }

        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('image', file);
        data.append('location', formData.location);
        data.append('caption', formData.caption);
        data.append('products_featured', formData.products_featured);
        data.append('rating', formData.rating || 5);

        try {
            await onUpload(data);
            onClose();
        } catch (err) {
            setError(err.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111] border border-white/10 w-full max-w-2xl p-4 sm:p-6 md:p-8 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-4 sm:mb-6 tracking-tighter pr-8">UPLOAD YOUR WALL</h2>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Image Upload Area */}
                    <div className="relative border-2 border-dashed border-white/10 rounded-lg p-4 sm:p-6 md:p-8 text-center hover:border-white/30 transition-colors cursor-pointer group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="Preview" className="max-h-32 sm:max-h-48 mx-auto rounded-sm shadow-lg" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-xs sm:text-sm font-mono">Change Image</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="mx-auto w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <Upload size={20} className="text-gray-400 group-hover:text-white sm:size-24" />
                                </div>
                                <p className="text-xs sm:text-sm text-gray-400 font-mono">Click or drag image here</p>
                                <p className="text-xs text-gray-600 font-mono">Max 5MB (JPG, PNG)</p>
                            </div>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-2">LOCATION (OPTIONAL)</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-2 sm:p-3 text-sm focus:border-white/30 outline-none transition-colors rounded"
                            placeholder="e.g. Bangalore, India"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-2">CAPTION</label>
                        <textarea
                            value={formData.caption}
                            onChange={e => setFormData({ ...formData, caption: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-2 sm:p-3 text-sm focus:border-white/30 outline-none transition-colors h-24 resize-none rounded"
                            placeholder="Tell us about your setup..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-2">RATING</label>
                        <div className="flex space-x-1 sm:space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill={star <= (formData.rating || 5) ? "white" : "none"}
                                        stroke="white"
                                        strokeWidth="2"
                                        className="sm:w-6 sm:h-6"
                                    >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs font-mono bg-red-500/10 p-2 sm:p-3 border border-red-500/20 rounded">
                            ERROR: {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-2 sm:py-3 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rounded text-sm sm:text-base"
                    >
                        {loading ? (
                            <span className="font-mono animate-pulse">UPLOADING...</span>
                        ) : (
                            <>
                                <span>SUBMIT FOR APPROVAL</span>
                                <Upload size={16} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadModal;

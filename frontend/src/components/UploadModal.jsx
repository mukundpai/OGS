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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111] border border-white/10 w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-black mb-6 tracking-tighter">UPLOAD YOUR WALL</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload Area */}
                    <div className="relative border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-white/30 transition-colors cursor-pointer group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-sm shadow-lg" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-sm font-mono">Change Image</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <Upload size={24} className="text-gray-400 group-hover:text-white" />
                                </div>
                                <p className="text-sm text-gray-400 font-mono">Click or drag image here</p>
                                <p className="text-xs text-gray-600 font-mono">Max 5MB (JPG, PNG)</p>
                            </div>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-1">LOCATION (OPTIONAL)</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-2 text-sm focus:border-white/30 outline-none transition-colors"
                            placeholder="e.g. Bangalore, India"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-1">CAPTION</label>
                        <textarea
                            value={formData.caption}
                            onChange={e => setFormData({ ...formData, caption: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-2 text-sm focus:border-white/30 outline-none transition-colors h-24 resize-none"
                            placeholder="Tell us about your setup..."
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs font-mono bg-red-500/10 p-2 border border-red-500/20">
                            ERROR: {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-3 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

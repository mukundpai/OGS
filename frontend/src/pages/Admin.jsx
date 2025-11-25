import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Upload, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '', subtitle: '', price: '', category: 'F1', image_pattern: 'pattern-1', image_url: ''
    });

    // Check auth and fetch products
    useEffect(() => {
        if (!user || !user.is_super_user) {
            navigate('/');
            return;
        }
        fetchProducts();
    }, [user, navigate]);

    const fetchProducts = () => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return null;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);

        try {
            const response = await fetch('http://localhost:5000/api/products/upload', {
                method: 'POST',
                body: formDataUpload
            });
            const data = await response.json();
            setUploading(false);
            return data.image_url;
        } catch (error) {
            console.error('Upload error:', error);
            setUploading(false);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Upload image if file is selected
        let imageUrl = formData.image_url;
        if (imageFile) {
            imageUrl = await uploadImage();
            if (!imageUrl) {
                alert('Failed to upload image');
                return;
            }
        }

        const productData = { ...formData, image_url: imageUrl };

        if (editingId) {
            // Update existing product
            fetch(`http://localhost:5000/api/products/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            })
                .then(res => res.json())
                .then(() => {
                    alert('Product Updated!');
                    resetForm();
                    fetchProducts();
                });
        } else {
            // Create new product
            fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            })
                .then(res => res.json())
                .then(() => {
                    alert('Product Added!');
                    resetForm();
                    fetchProducts();
                });
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        setFormData({
            title: product.title,
            subtitle: product.subtitle,
            price: product.price_raw,
            category: product.category,
            image_pattern: product.image_pattern,
            image_url: product.image_url || ''
        });
        setImagePreview(product.image_url ? `http://localhost:5000${product.image_url}` : null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        fetch(`http://localhost:5000/api/products/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                alert('Product Deleted!');
                fetchProducts();
            });
    };

    const resetForm = () => {
        setFormData({
            title: '', subtitle: '', price: '', category: 'F1', image_pattern: 'pattern-1', image_url: ''
        });
        setEditingId(null);
        setImageFile(null);
        setImagePreview(null);
    };

    return (
        <div className="container section" style={{ paddingTop: '120px', maxWidth: '1200px' }}>
            <h1 className="text-2xl font-bold mb-8">ADMIN PANEL // PRODUCT MANAGEMENT</h1>

            {/* Add/Edit Form */}
            <div className="mb-12 p-6 border border-gray-700" style={{ background: '#0a0a0a' }}>
                <h2 className="text-xl font-bold mb-6">{editingId ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="TITLE"
                            className="oracle-input"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="SUBTITLE"
                            className="oracle-input"
                            value={formData.subtitle}
                            onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="number"
                            placeholder="PRICE"
                            className="oracle-input"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            required
                        />

                        <select
                            className="oracle-input"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="F1">F1</option>
                            <option value="MotoGP">MotoGP</option>
                            <option value="Anime">Anime</option>
                            <option value="Cinema">Cinema</option>
                            <option value="Cricket">Cricket</option>
                        </select>

                        <select
                            className="oracle-input"
                            value={formData.image_pattern}
                            onChange={e => setFormData({ ...formData, image_pattern: e.target.value })}
                        >
                            <option value="pattern-1">Pattern 1</option>
                            <option value="pattern-2">Pattern 2</option>
                            <option value="pattern-3">Pattern 3</option>
                            <option value="pattern-4">Pattern 4</option>
                        </select>
                    </div>

                    {/* Image Upload Section */}
                    <div className="border border-gray-700 p-4">
                        <label className="block text-xs font-bold uppercase mb-2">Product Image</label>

                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors border border-gray-600">
                                <Upload size={18} />
                                <span className="text-xs uppercase">Choose Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>

                            {imagePreview && (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-24 w-24 object-cover border border-gray-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 rounded-full p-1"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {imageFile && (
                            <p className="text-xs text-gray-400 mt-2">
                                Selected: {imageFile.name}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            type="submit"
                            className="flex-1 cta-btn justify-center"
                            disabled={uploading}
                        >
                            {uploading ? 'UPLOADING...' : (editingId ? 'UPDATE PRODUCT' : 'ADD TO DATABASE')}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-3 border border-gray-700 hover:border-white transition-colors text-xs uppercase"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Products List */}
            <div>
                <h2 className="text-xl font-bold mb-6">ALL PRODUCTS ({products.length})</h2>

                <div className="grid gap-4">
                    {products.map(product => (
                        <div
                            key={product.id}
                            className="flex gap-4 p-4 border border-gray-800 hover:border-gray-600 transition-colors"
                            style={{ background: '#0a0a0a' }}
                        >
                            {/* Product Image */}
                            <div
                                className={`w-24 h-24 flex-shrink-0 ${product.image_pattern}`}
                                style={{
                                    backgroundImage: product.image_url ? `url(http://localhost:5000${product.image_url})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    border: '1px solid #333'
                                }}
                            ></div>

                            {/* Product Info */}
                            <div className="flex-1">
                                <h3 className="font-bold text-sm">{product.title}</h3>
                                <p className="text-xs text-gray-400">{product.subtitle}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {product.category} | {product.price}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 items-start">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="p-2 hover:bg-gray-800 transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="p-2 hover:bg-red-900 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;

import React, { useState } from 'react';

const Admin = () => {
    const [formData, setFormData] = useState({
        title: '', subtitle: '', price: '', category: 'F1', image_pattern: 'pattern-1'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(() => alert('Product Added!'));
    };

    return (
        <div className="container section" style={{ paddingTop: '120px', maxWidth: '600px' }}>
            <h1 className="text-xl font-bold mb-8">ADMIN // ADD PRODUCT</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="text" placeholder="TITLE" className="oracle-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                <input type="text" placeholder="SUBTITLE" className="oracle-input" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} required />
                <input type="number" placeholder="PRICE" className="oracle-input" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />

                <select className="oracle-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option value="F1">F1</option>
                    <option value="MotoGP">MotoGP</option>
                    <option value="Anime">Anime</option>
                    <option value="Cinema">Cinema</option>
                    <option value="Cricket">Cricket</option>
                </select>

                <select className="oracle-input" value={formData.image_pattern} onChange={e => setFormData({ ...formData, image_pattern: e.target.value })}>
                    <option value="pattern-1">Pattern 1</option>
                    <option value="pattern-2">Pattern 2</option>
                    <option value="pattern-3">Pattern 3</option>
                    <option value="pattern-4">Pattern 4</option>
                </select>

                <button type="submit" className="cta-btn justify-center mt-8">ADD TO DATABASE</button>
            </form>
        </div>
    );
};

export default Admin;

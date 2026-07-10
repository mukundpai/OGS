import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('default');

    useEffect(() => {
        let url = '/api/products?';
        if (category !== 'All') url += `category=${category}&`;
        if (sort !== 'default') url += `sort=${sort}`;

        fetch(url)
            .then(res => res.json())
            .then(data => setProducts(data));
    }, [category, sort]);

    return (
        <div className="container section" style={{ paddingTop: '120px' }}>
            {/* Header - Responsive Layout */}
            <div className="mb-8 sm:mb-12">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter mb-6 sm:mb-8">ARCHIVE // ALL</h1>
                
                {/* Filters - Stack on mobile, horizontal on desktop */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <select 
                        className="font-mono bg-black text-white border border-gray-800 p-2.5 sm:p-3 text-sm flex-1 sm:flex-none rounded focus:outline-none focus:border-white transition-colors" 
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="All">ALL CATEGORIES</option>
                        <option value="F1">F1</option>
                        <option value="MotoGP">MOTOGP</option>
                        <option value="Anime">ANIME</option>
                        <option value="Cinema">CINEMA</option>
                        <option value="Cricket">CRICKET</option>
                    </select>
                    <select 
                        className="font-mono bg-black text-white border border-gray-800 p-2.5 sm:p-3 text-sm flex-1 sm:flex-none rounded focus:outline-none focus:border-white transition-colors" 
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="default">SORT</option>
                        <option value="asc">PRICE: LOW TO HIGH</option>
                        <option value="desc">PRICE: HIGH TO LOW</option>
                    </select>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
        </div>
    );
};

export default AllProducts;

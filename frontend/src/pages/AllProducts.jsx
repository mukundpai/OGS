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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-bold">ARCHIVE // ALL</h1>
                <div className="flex gap-4">
                    <select className="font-mono bg-black text-white border border-gray-800 p-2" onChange={(e) => setCategory(e.target.value)}>
                        <option value="All">ALL CATEGORIES</option>
                        <option value="F1">F1</option>
                        <option value="MotoGP">MOTOGP</option>
                        <option value="Anime">ANIME</option>
                        <option value="Cinema">CINEMA</option>
                        <option value="Cricket">CRICKET</option>
                    </select>
                    <select className="font-mono bg-black text-white border border-gray-800 p-2" onChange={(e) => setSort(e.target.value)}>
                        <option value="default">SORT</option>
                        <option value="asc">PRICE: LOW TO HIGH</option>
                        <option value="desc">PRICE: HIGH TO LOW</option>
                    </select>
                </div>
            </div>

            <div className="grid">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
        </div>
    );
};

export default AllProducts;

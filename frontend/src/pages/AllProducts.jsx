import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import CustomSelect from '../components/CustomSelect';

const categoryOptions = [
    { value: 'All', label: 'ALL CATEGORIES' },
    { value: 'F1', label: 'F1' },
    { value: 'MotoGP', label: 'MOTOGP' },
    { value: 'Anime', label: 'ANIME' },
    { value: 'Cinema', label: 'CINEMA' },
    { value: 'Cricket', label: 'CRICKET' },
    { value: 'Split Posters', label: 'SPLIT POSTERS' }
];

const sortOptions = [
    { value: 'default', label: 'SORT' },
    { value: 'asc', label: 'PRICE: LOW TO HIGH' },
    { value: 'desc', label: 'PRICE: HIGH TO LOW' }
];

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
                    <CustomSelect 
                        className="flex-1 sm:flex-none sm:min-w-[200px]"
                        value={category}
                        onChange={setCategory}
                        options={categoryOptions}
                    />
                    <CustomSelect 
                        className="flex-1 sm:flex-none sm:min-w-[200px]"
                        value={sort}
                        onChange={setSort}
                        options={sortOptions}
                    />
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

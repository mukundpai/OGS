import React from 'react';
import { Star } from 'lucide-react';

const ReviewSection = () => {
    const reviews = [
        { id: 1, user: "Alex R.", rating: 5, text: "The quality is insane! The colors are so vibrant and it looks incredible on my wall. A must-have for any F1 fan." },
        { id: 2, user: "Jenna S.", rating: 5, text: "Arrived quickly and was well-packaged. The oak frame is really high quality. Looks much more expensive than it was." },
        { id: 3, user: "Marcus T.", rating: 4, text: "Great print, but shipping took a day longer than expected. Still worth it." }
    ];

    return (
        <div className="mt-20 border-t border-gray-800 pt-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                <div className="flex items-center gap-2">
                    <div className="flex text-white">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#fff" stroke="none" />)}
                    </div>
                    <span className="text-sm text-gray font-mono">4.8 (124 reviews)</span>
                    <button className="ml-4 border border-gray-700 px-4 py-2 text-xs font-mono uppercase hover:bg-white hover:text-black transition-colors">Write a Review</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map(review => (
                    <div key={review.id} className="bg-gray-900/30 p-6 border border-gray-800 rounded-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-bold text-sm">{review.user}</span>
                            <div className="flex">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="#fff" stroke="none" />)}
                            </div>
                        </div>
                        <p className="text-gray text-xs font-mono leading-relaxed">"{review.text}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewSection;

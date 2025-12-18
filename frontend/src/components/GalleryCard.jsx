import React, { useState } from 'react';
import { Heart, MapPin } from 'lucide-react';

const GalleryCard = ({ submission, onLike }) => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(submission.likes);

    const handleLike = (e) => {
        e.stopPropagation();
        if (!liked) {
            setLiked(true);
            setLikesCount(prev => prev + 1);
            onLike(submission.id);
        }
    };

    return (
        <div className="gallery-card mb-6 break-inside-avoid relative group cursor-pointer">
            <div className="relative overflow-hidden rounded-sm mb-4">
                <img
                    src={submission.image_url}
                    alt={submission.caption}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Featured Badge */}
                {submission.is_featured && (
                    <div className="absolute top-2 left-2 bg-white text-black text-[8px] font-bold px-1.5 py-0.5 font-mono uppercase tracking-widest z-10">
                        Featured
                    </div>
                )}
            </div>

            {/* Content Below Image */}
            <div className="space-y-3">
                {/* Rating Stars */}
                <div className="flex space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill={i < (submission.rating || 5) ? "white" : "#333"}
                            stroke="none"
                        >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    ))}
                </div>

                <p className="text-gray-300 font-mono text-xs line-clamp-2 leading-relaxed h-8">{submission.caption}</p>

                <div className="flex justify-between items-end border-t border-white/10 pt-3">
                    <div>
                        <p className="text-white font-bold text-xs uppercase tracking-wider">{submission.user_name}</p>
                        {submission.location && (
                            <div className="flex items-center text-gray-500 text-[10px] mt-1 font-mono">
                                <MapPin size={10} className="mr-1" />
                                {submission.location}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-1 ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                    >
                        <Heart size={14} fill={liked ? "currentColor" : "none"} />
                        <span className="font-mono text-[10px]">{likesCount}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GalleryCard;

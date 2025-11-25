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
            <div className="relative overflow-hidden rounded-sm">
                <img
                    src={`http://localhost:5000${submission.image_url}`}
                    alt={submission.caption}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-white font-mono text-sm line-clamp-2 mb-2">{submission.caption}</p>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-white font-bold text-sm">{submission.user_name}</p>
                            {submission.location && (
                                <div className="flex items-center text-gray-400 text-xs mt-1">
                                    <MapPin size={12} className="mr-1" />
                                    {submission.location}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleLike}
                            className={`flex items-center space-x-1 ${liked ? 'text-red-500' : 'text-white hover:text-red-500'} transition-colors`}
                        >
                            <Heart size={16} fill={liked ? "currentColor" : "none"} />
                            <span className="font-mono text-xs">{likesCount}</span>
                        </button>
                    </div>
                </div>

                {/* Featured Badge */}
                {submission.is_featured && (
                    <div className="absolute top-2 right-2 bg-white text-black text-[10px] font-bold px-2 py-1 font-mono uppercase tracking-wider">
                        Featured
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryCard;

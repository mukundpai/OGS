import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <header className="hero">
            <div className="hero-bg">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="hero-pat" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <rect width="100%" height="100%" fill="#111" />
                            <path d="M0 0h40v40H0z" fill="none" stroke="#222" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hero-pat)" />
                    <rect width="100%" height="100%" fill="radial-gradient(circle at 50% 50%, transparent 0%, #050505 100%)" />
                </svg>
            </div>

            <div className="floating-container hidden-mobile">
                <img src="https://images.unsplash.com/photo-1600199850220-0829609b680d?q=80&w=200&auto=format&fit=crop" alt="F1 Poster" className="float-item" style={{ width: '200px', height: '300px', top: '15%', left: '10%', animation: 'float-1 8s ease-in-out infinite' }} />
                <img src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=180&auto=format&fit=crop" alt="Neon Poster" className="float-item" style={{ width: '180px', height: '260px', top: '25%', right: '15%', animation: 'float-2 7s ease-in-out infinite' }} />
                <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=150&auto=format&fit=crop" alt="Cinema Poster" className="float-item" style={{ width: '150px', height: '220px', bottom: '15%', left: '25%', animation: 'float-3 9s ease-in-out infinite' }} />
            </div>

            <div className="hero-overlay"></div>

            <div className="container z-20 relative">
                <p className="font-mono text-gray tracking-wider text-xs mb-4">OG LABS // DEFINING WALLS</p>

                <div className="glitch-wrapper">
                    <h1 className="glitch" data-text="CULTURE">CULTURE</h1>
                </div>

                <h1 className="text-xl md:text-6xl font-black tracking-tighter mb-12" style={{ WebkitTextStroke: '1px #fff', color: 'transparent' }}>
                    ON PAPER
                </h1>

                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <button onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })} className="cta-btn">
                        SHOP THE DROP <ArrowRight width={16} />
                    </button>
                    <button className="font-mono text-xs uppercase" style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '1rem 2rem', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                        VIEW_FRAMES.MP4
                    </button>
                </div>
            </div>

            <div className="absolute" style={{ bottom: '40px', left: '40px', opacity: 0.5 }}>
                <p className="font-mono text-xs hidden-mobile">
                    EST 2025. BANGALORE.<br />
                    STATUS: SHIPPING WORLDWIDE
                </p>
            </div>
        </header>
    );
};

export default Hero;

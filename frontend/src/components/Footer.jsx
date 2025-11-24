import React from 'react';

const Footer = () => {
    return (
        <footer id="footer">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                    <div>
                        <h2 className="logo">OG LABS</h2>
                        <p className="text-gray text-sm mt-4" style={{ maxWidth: '300px' }}>Transforming boring walls into shrines of culture.</p>
                    </div>
                    <div className="flex gap-12 text-sm font-bold">
                        <ul className="flex flex-col gap-4">
                            <li className="text-gray font-mono text-xs mb-2">CATALOG</li>
                            <li><a href="#">POSTERS</a></li>
                            <li><a href="#">FRAMES</a></li>
                            <li><a href="#">CARDS</a></li>
                        </ul>
                        <ul className="flex flex-col gap-4">
                            <li className="text-gray font-mono text-xs mb-2">SOCIAL</li>
                            <li><a href="#">INSTAGRAM</a></li>
                            <li><a href="#">PINTEREST</a></li>
                            <li><a href="#">TIKTOK</a></li>
                        </ul>
                    </div>
                </div>
                <div className="text-gray font-mono text-xs flex justify-between border-top pt-4" style={{ borderTop: '1px solid #222', paddingTop: '1rem' }}>
                    <p>&copy; 2025 OG LABS.</p>
                    <div className="flex gap-4">
                        <a href="#">PRIVACY</a>
                        <a href="#">RETURNS</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

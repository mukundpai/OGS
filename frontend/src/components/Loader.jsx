import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ message = "RETRIEVING ARCHIVES..." }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[60vh] gap-6 text-white" style={{ paddingTop: '80px' }}>
            <div className="relative flex items-center justify-center">
                <div className="absolute w-16 h-16 border border-gray-800 rounded-full animate-[spin_4s_linear_infinite]"></div>
                <Loader2 size={32} className="animate-spin text-white z-10" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse z-20"></div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
                <p className="font-mono text-[10px] tracking-[0.4em] text-gray-500 uppercase">System Status</p>
                <p className="font-mono text-sm tracking-widest text-white animate-pulse">{message}</p>
            </div>
            
            {/* Scanning bar */}
            <div className="w-64 h-[1px] bg-gray-900 mt-4 relative overflow-hidden">
                <div 
                    className="absolute top-0 h-full w-1/3 bg-white" 
                    style={{
                        animation: 'scan 2s ease-in-out infinite alternate'
                    }}
                ></div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { left: -33%; }
                    100% { left: 100%; }
                }
            `}</style>
        </div>
    );
};

export default Loader;

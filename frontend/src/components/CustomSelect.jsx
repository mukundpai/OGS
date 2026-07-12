import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div 
                className="font-mono bg-black text-white border border-gray-800 p-2.5 sm:p-3 text-sm rounded cursor-pointer hover:border-white transition-colors flex items-center justify-between gap-4"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedOption ? selectedOption.label : ''}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#0a0a0a] border border-gray-800 rounded z-50 shadow-2xl max-h-60 overflow-y-auto">
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            className={`font-mono text-sm p-3 cursor-pointer transition-colors ${
                                value === opt.value 
                                    ? 'bg-white text-black font-bold' 
                                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;

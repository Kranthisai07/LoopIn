import React from 'react';

export const Logo = ({ size = 40, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M30 50C30 38.9543 38.9543 30 50 30C61.0457 30 70 38.9543 70 50M30 50C30 61.0457 38.9543 70 50 70C61.0457 70 70 61.0457 70 50M30 50H20C14.4772 50 10 54.4772 10 60V80C10 85.5228 14.4772 90 20 90H80C85.5228 90 90 85.5228 90 80V60C90 54.4772 85.5228 50 80 50H70"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="50" cy="50" r="12" fill={color} />
    </svg>
);

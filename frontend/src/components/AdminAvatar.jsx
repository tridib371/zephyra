import React from 'react';

/**
 * Permanent Official Zephyra Admin & Platform Shield Crest Emblem
 */
export const AdminAvatar = ({ className = "h-12 w-12", size = 48 }) => {
    return (
        <div className={`relative shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A0F08] via-[#2A1408] to-[#0E1116] border-2 border-[#F5C36B] shadow-[0_0_15px_rgba(245,195,107,0.35)] overflow-hidden ${className}`}>
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,143,107,0.3)_0%,_transparent_70%)] animate-pulse" />
            
            {/* Detailed Vector Admin Shield & Z Crest */}
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 w-full h-full p-1.5"
            >
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE599" />
                        <stop offset="50%" stopColor="#F5C36B" />
                        <stop offset="100%" stopColor="#D97B4F" />
                    </linearGradient>
                    <linearGradient id="coralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF8F6B" />
                        <stop offset="100%" stopColor="#EA580C" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Outer Shield Outline */}
                <path
                    d="M50 8L82 20V48C82 70 50 88 50 88C50 88 18 70 18 48V20L50 8Z"
                    fill="#150E09"
                    stroke="url(#goldGradient)"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                />

                {/* Inner Shield Infill Accent */}
                <path
                    d="M50 16L74 25V46C74 63 50 78 50 78C50 78 26 63 26 46V25L50 16Z"
                    fill="url(#coralGradient)"
                    opacity="0.22"
                />

                {/* Crown Stars / Insignia */}
                <circle cx="50" cy="25" r="2.5" fill="url(#goldGradient)" />
                <circle cx="41" cy="28" r="1.8" fill="url(#goldGradient)" />
                <circle cx="59" cy="28" r="1.8" fill="url(#goldGradient)" />

                {/* Stylized Zephyra "Z" Lightning Glyph */}
                <path
                    d="M36 37H64L42 56H64V63H36L58 44H36V37Z"
                    fill="url(#goldGradient)"
                    filter="url(#glow)"
                />
            </svg>

            {/* Micro Badge for Admin status */}
            <span className="absolute -bottom-0.5 right-0.5 bg-[#EA580C] text-[#FFE599] text-[7px] font-black uppercase tracking-tighter px-1 rounded-sm border border-black z-20 shadow-xs">
                HQ
            </span>
        </div>
    );
};

export default AdminAvatar;

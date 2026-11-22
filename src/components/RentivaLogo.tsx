import React from 'react';

interface RentivaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RentivaLogo: React.FC<RentivaLogoProps> = ({ size = 'md', className = '' }) => {
  const dim = size === 'lg' ? 'w-16 h-16 rounded-2xl' : size === 'sm' ? 'w-7 h-7 rounded-lg' : 'w-9 h-9 rounded-xl';
  return (
    <div
      className={`${dim} bg-gradient-to-br from-[#0F264C] via-[#1C3879] to-[#0D9488] flex items-center justify-center shadow-sm shrink-0 ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" className="w-[68%] h-[68%] text-white" fill="none">
        <path
          d="M12 30V10h9.5c4.1 0 7 2.4 7 6.2 0 3-1.9 5.2-4.9 5.9L29 30h-5.3l-4.6-7.2H16.5V30H12Zm4.5-11.2h4.7c1.9 0 3.1-1 3.1-2.6 0-1.6-1.2-2.5-3.1-2.5h-4.7v5.1Z"
          fill="currentColor"
        />
        <path
          d="M7 22.5c3.2 3.8 14.5 4.2 26-3.2"
          stroke="#5EEAD4"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M29.5 17.5l4.2 1.2-1.5 4.1"
          stroke="#5EEAD4"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

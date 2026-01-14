import React from 'react';

interface UserIconProps {
  size?: 'normal' | 'large';
}

const UserIcon: React.FC<UserIconProps> = ({ size = 'normal' }) => {
  const sizeClass = size === 'large' ? 'w-20 h-20' : 'w-24 h-24';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${sizeClass} text-gray-text`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
};

export default UserIcon;
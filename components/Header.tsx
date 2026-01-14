import React, { useState } from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import PasswordModal from './PasswordModal';

interface HeaderProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  showBack: boolean;
  onBack: () => void;
  theme: 'home' | 'detail';
}

const Header: React.FC<HeaderProps> = ({ isAdmin, setIsAdmin, showBack, onBack, theme }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const isHome = theme === 'home';

  const handleAdminToggle = () => {
    if (!isAdmin) {
      setIsPasswordModalOpen(true);
    } else {
      setIsAdmin(false);
    }
  };

  const handlePasswordSubmit = (password: string) => {
    if (password === '1923') {
      setIsAdmin(true);
    } else {
      alert('パスワードが違います。');
    }
    setIsPasswordModalOpen(false);
  };

  const titleGradientToClass = isHome ? 'to-old-accent' : 'to-accent';
  const titleShadowClass = isHome
    ? 'drop-shadow-[0_2px_4px_rgba(56,178,172,0.4)]'
    : 'drop-shadow-[0_2px_4px_rgba(0,245,212,0.3)]';

  return (
    <>
      <header className={isHome
        ? "bg-old-slate/50 backdrop-blur-lg shadow-lg sticky top-0 z-10 border-b border-old-light-slate/20"
        : "bg-slate/50 backdrop-blur-lg shadow-lg sticky top-0 z-10 border-b border-accent/20"
      }>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              {showBack && (
                <button
                  onClick={onBack}
                  className={isHome 
                    ? "text-old-gray-text hover:text-white transition-colors duration-200 mr-4 p-2 rounded-full hover:bg-old-light-slate/50"
                    : "text-gray-text hover:text-white transition-colors duration-200 mr-4 p-2 rounded-full hover:bg-light-slate/50"
                  }
                  aria-label="Back to player list"
                >
                  <ArrowLeftIcon />
                </button>
              )}
              <h1 className={`text-5xl font-heading font-bold tracking-wider uppercase bg-gradient-to-r from-white ${titleGradientToClass} bg-clip-text text-transparent ${titleShadowClass}`}>
                Grit Log
                <span className="text-lg text-accent-light font-sans normal-case tracking-tight ml-3 hidden sm:inline">For the Resolute</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium ${isHome ? 'text-old-gray-text' : 'text-gray-text'}`}>管理者モード</span>
              <label htmlFor="admin-toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="admin-toggle"
                    className="sr-only"
                    checked={isAdmin}
                    onChange={handleAdminToggle}
                  />
                  <div className={`block ${isHome ? 'bg-old-light-slate' : 'bg-light-slate'} w-14 h-8 rounded-full`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${isAdmin ? `transform translate-x-6 ${isHome ? 'bg-old-accent' : 'bg-accent'}` : ''}`}></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </header>
      {isPasswordModalOpen && (
        <PasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handlePasswordSubmit}
          theme={theme}
        />
      )}
    </>
  );
};

export default Header;
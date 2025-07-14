import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuToggle }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00809D] focus:border-transparent"
            />
          </div>
          <button className="relative p-2 text-gray-600 hover:text-[#00809D] transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#FF7601] text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
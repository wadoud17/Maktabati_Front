import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Store,
  Truck,
  Receipt,
  FileText,
  Calculator,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const adminMenuItems = [
    { path: '/', label: 'Tableau de bord', icon: Home },
    { path: '/produits', label: 'Produits', icon: Package },
    { path: '/categories', label: 'Catégories', icon: BarChart3 },
    { path: '/fournisseurs', label: 'Fournisseurs', icon: Truck },
    { path: '/clients', label: 'Clients', icon: Users },
    { path: '/utilisateurs', label: 'Utilisateurs', icon: Settings },
    { path: '/dettes', label: 'Gestion des Dettes', icon: CreditCard },
    { path: '/achats', label: 'Achat Produits', icon: ShoppingCart },
    { path: '/information', label: 'Information Société', icon: FileText },
  ];

  const caissierMenuItems = [
    { path: '/caisse', label: 'POS - Caisse', icon: Calculator },
    { path: '/facture', label: 'Impression Facture', icon: Receipt },
  ];

  const menuItems = user?.typeUser === 'Admin' ? adminMenuItems : caissierMenuItems;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#00809D] to-[#006b84] text-white">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <Store className="h-8 w-8 text-[#FCECDD]" />
          <div>
            <h1 className="text-xl font-bold">Maktabati</h1>
            <p className="text-sm text-[#FCECDD]/80">Gestion de caisse</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#FF7601] text-white shadow-lg transform scale-105'
                  : 'text-[#FCECDD] hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-[#FF7601] rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">
                {user?.nom?.[0]}{user?.prenom?.[0]}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.nom} {user?.prenom}</p>
              <p className="text-xs text-[#FCECDD]/80 capitalize">{user?.typeUser}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 text-[#FCECDD] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  TrendingUp, 
  CreditCard, 
  Folder, 
  FileText,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  ChevronRight,
  IndianRupee,
  CreditCard as PayoutIcon,
  ArrowUpDown,
  Plus,
  List,
  Minus,
  Building2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isInvestorOpen, setIsInvestorOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(true);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const navigationItems = [
    { 
      name: 'Dashboard', 
      icon: Home, 
      path: '/dashboard',
      hasSubmenu: false 
    },
    { 
      name: 'User', 
      icon: Users, 
      path: '/users',
      hasSubmenu: false 
    },
    { 
      name: 'Investor', 
      icon: TrendingUp, 
      path: '/investors',
      hasSubmenu: true,
      isOpen: isInvestorOpen,
      setIsOpen: setIsInvestorOpen,
      submenuItems: [
        { name: 'View Investors', path: '/investors' },
        { name: 'Add Investor', path: '/investors/add' },
        { name: 'Reports', path: '/investors/reports' }
      ]
    },
    { 
      name: 'Transaction', 
      icon: CreditCard, 
      path: '/transactions',
      hasSubmenu: true,
      isOpen: isTransactionOpen,
      setIsOpen: setIsTransactionOpen,
      submenuItems: [
        { name: 'Profit & Loss', path: '/profit-loss', icon: IndianRupee },
        { name: 'Payouts', path: '/payouts', icon: PayoutIcon },
        { name: 'All Bulk Transaction', path: '/bulk-transactions', icon: ArrowUpDown },
        { name: 'Transactions', path: '/transactions', icon: List },
        { name: 'Pending Transaction', path: '/pending-transactions', icon: CreditCard },
        { name: 'Add Transaction', path: '/add-transaction', icon: Plus },
        { name: 'List Add Funds', path: '/add-funds', icon: Plus },
        { name: 'List Withdraw Funds', path: '/withdraw-funds', icon: Minus }
      ]
    },
    { 
      name: 'Account', 
      icon: Folder, 
      path: '/account-settings',
      hasSubmenu: true,
      isOpen: isAccountOpen,
      setIsOpen: setIsAccountOpen,
      submenuItems: [
        { name: 'All Accounts', path: '/all-accounts', icon: Building2 },
        { name: 'Account Settings', path: '/account-settings' },
        { name: 'Profile', path: '/profile' },
        { name: 'Security', path: '/security' }
      ]
    },
    { 
      name: 'Tally Export', 
      icon: FileText, 
      path: '/tally-export',
      hasSubmenu: false 
    }
  ];

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActiveItem = (path: string) => {
    return location.pathname === path;
  };

  const isActiveSubmenu = (submenuItems: any[]) => {
    return submenuItems?.some(item => location.pathname === item.path);
  };

  const isParentActive = (item: any) => {
    if (item.hasSubmenu) {
      return isActiveSubmenu(item.submenuItems);
    }
    return isActiveItem(item.path);
  };

  return (
    <div className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-72'
    } flex flex-col shadow-lg`}>
      
      {/* Header with Logo and Toggle */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <img 
                  src="/image.png" 
                  alt="AINFINITY Logo" 
                  className="h-8 w-auto object-contain"
                />
                <div className="ml-3">
                  <p className="text-xs text-gray-500 font-medium">Dashboard</p>
                </div>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <img 
                src="/image.png" 
                alt="AINFINITY Logo" 
                className="h-6 w-auto object-contain"
              />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && user && (
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <User size={24} className="text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {user.name}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                @{user.userName}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-100 to-orange-100 text-cyan-700 mt-1">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <div key={item.name}>
            <button
              onClick={() => {
                if (!item.hasSubmenu) {
                  handleNavigation(item.path);
                } else {
                  if (item.setIsOpen) {
                    item.setIsOpen(!item.isOpen);
                  }
                  // Also navigate to the main path for parent items
                  if (item.path) {
                    handleNavigation(item.path);
                  }
                }
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isParentActive(item)
                  ? 'bg-gradient-to-r from-cyan-50 to-orange-50 border border-cyan-200 shadow-sm'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon 
                  size={20} 
                  className={`${
                    isParentActive(item)
                      ? 'text-cyan-600' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  } transition-colors`} 
                />
                {!isCollapsed && (
                  <span className={`text-sm font-medium ${
                    isParentActive(item)
                      ? 'text-gray-900' 
                      : 'text-gray-700 group-hover:text-gray-900'
                  } transition-colors`}>
                    {item.name}
                  </span>
                )}
              </div>
              {!isCollapsed && item.hasSubmenu && (
                <ChevronRight 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-200 ${
                    item.isOpen ? 'rotate-90' : ''
                  }`} 
                />
              )}
            </button>
            
            {/* Submenu */}
            {!isCollapsed && item.hasSubmenu && item.isOpen && item.submenuItems && (
              <div className="ml-6 mt-2 space-y-1">
                {item.submenuItems.map((subItem) => (
                  <button
                    key={subItem.path}
                    onClick={() => handleNavigation(subItem.path)}
                    className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors flex items-center space-x-2 ${
                      isActiveItem(subItem.path)
                        ? 'text-cyan-600 bg-cyan-50 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {subItem.icon && <subItem.icon size={16} />}
                    <span>{subItem.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-red-50 hover:text-red-600 text-gray-600 group ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} className="group-hover:text-red-600 transition-colors" />
          {!isCollapsed && (
            <span className="text-sm font-medium group-hover:text-red-600 transition-colors">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
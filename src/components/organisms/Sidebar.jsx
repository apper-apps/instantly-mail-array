import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
const navigation = [
    { name: 'Campaigns', to: '/campaigns', icon: 'Mail' },
    { name: 'Templates', to: '/templates', icon: 'FileText' },
    { name: 'A/B Testing', to: '/ab-testing', icon: 'TestTube' },
    { name: 'Email Validator', to: '/email-validator', icon: 'CheckCircle' },
    { name: 'Leads', to: '/leads', icon: 'Users' },
    { name: 'Inbox', to: '/inbox', icon: 'MessageSquare' },
    { name: 'Analytics', to: '/analytics', icon: 'BarChart3' },
    { name: 'Accounts', to: '/accounts', icon: 'Settings' },
    { name: 'Settings', to: '/settings', icon: 'Cog' }
  ];

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.to}
      onClick={mobile ? onClose : undefined}
      className={({ isActive }) =>
        `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <ApperIcon 
        name={item.icon} 
        className={`mr-3 h-5 w-5 ${
          location.pathname === item.to ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
        }`} 
      />
      {item.name}
    </NavLink>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-white shadow-lg border-r border-gray-200 h-full">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-3">
            <ApperIcon name="Zap" className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Instantly Mail
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* User Profile */}
{/* User Profile */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              title="Logout"
>
              <ApperIcon name="LogOut" className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-3">
                    <ApperIcon name="Zap" className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                    Instantly Mail
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-1">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} mobile />
                ))}
              </nav>

              {/* User Profile */}
{/* User Profile */}
              <div className="px-4 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                    title="Logout"
                  >
<ApperIcon name="LogOut" className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;
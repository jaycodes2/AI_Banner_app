import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiUser, FiShare2, FiLogOut, FiImage } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: FiShare2, label: 'Share', action: () => {}, color: 'text-blue-500' },
    { icon: FiUser, label: 'Profile', action: () => navigate('/profile'), color: 'text-green-500' },
    { icon: FiLogOut, label: 'Logout', action: logout, color: 'text-red-500' },
  ];

  return (
    <div className="w-80 flex-shrink-0 h-screen bg-black border-r border-white/10 relative overflow-hidden">

      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 pointer-events-none"></div>
      <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-40 left-8 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Sidebar content */}
      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Top Section */}
          <div className="p-6 border-b border-white/10">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
              <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl animate-pulse-glow">
                <FiImage className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-1 text-gradient-rainbow">BannerCraft AI</h2>
              <p className="text-sm text-white/70">Welcome back, <span className="text-blue-400 font-semibold">{user?.name?.split(' ')[0] || 'Creator'}</span>! ✨</p>
            </motion.div>
            <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative flex items-center justify-center gap-3 px-6 py-4 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-2xl hover:shadow-rainbow transition-all duration-500 font-semibold overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <FiPlus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Create New Banner</span>
            </motion.button>
          </div>

          {/* Bottom Menu */}
          <div className="border-t border-white/10 p-6 mt-auto">
            <div className="space-y-3">
              {menuItems.map((item) => (
                <button key={item.label} onClick={item.action} className="flex items-center gap-4 px-5 py-4 w-full glass border border-white/20 hover:border-white/40 rounded-2xl transition-all duration-300 hover:shadow-glow">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="font-semibold text-white">{item.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-white/40">Made with ✨ by BannerCraft AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
import React, { useState, useRef } from 'react';
import { sidebarStyles, cn } from '../assets/dummyStyles';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Home, Wallet, Receipt, User, ChevronLeft, ChevronRight, HelpCircle, LogOut, Mail, Globe, X, Menu } from 'lucide-react';

const MENU_ITEMS = [
    { path: '/', name: 'Dashboard', text: 'Dashboard', icon: <Home size={22} /> },
    { path: '/expenses', name: 'Expenses', text: 'Expenses', icon: <Wallet size={22} /> },
    { path: '/income', name: 'Income', text: 'Income', icon: <Receipt size={22} /> },
    { path: '/profile', name: 'Profile', text: 'Profile', icon: <User size={22} /> },
];

const Sidebar = ({ user, isCollapsed, setIsCollapsed }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const sidebarRef = useRef(null);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const { name: username = "User", email = "user@example.com" } = user || {};
    const initial = username.charAt(0).toUpperCase();

    const handleLogout = () => {
        navigate('/login');
    };

    const renderMenuItem = (item) => {
        const isActive = pathname === item.path;
        return (
            <li key={item.path}>
                <button
                    onClick={() => navigate(item.path)}
                    className={cn(
                        "flex items-center gap-4 w-full p-3 rounded-xl transition-colors font-medium",
                        isActive
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                >
                    <span className="min-w-[22px]">{item.icon}</span>
                    {!isCollapsed && <span>{item.name}</span>}
                </button>
            </li>
        );
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.div
                ref={sidebarRef}
                className={cn(
                    "hidden md:flex h-screen bg-white border-r border-gray-200 flex-col justify-between transition-all duration-300 z-20",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                <div>
                    {/* Top Header / Logo & Collapse Button Area */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        {!isCollapsed && (
                            <span className="font-bold text-xl text-indigo-600">Monthstack</span>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                        >
                            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                    </div>

                    {/* User Profile Section at Top */}
                    <div className={cn(
                        "p-4 border-b border-gray-100",
                        isCollapsed ? "flex justify-center" : "flex items-center"
                    )}>
                        <div className={sidebarStyles.userInitials.base}>
                            {initial}
                        </div>
                        {!isCollapsed && (
                            <motion.div
                                className="ml-3 overflow-hidden"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                            >
                                <h2 className="text-sm font-bold text-gray-800 truncate">
                                    {username}
                                </h2>
                                <p className="text-xs text-gray-500 truncate">
                                    {email}
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto py-4 px-4 custom-scrollbar">
                        <ul className={sidebarStyles.menuList?.base || "space-y-2"}>
                            {MENU_ITEMS.map(renderMenuItem)}
                        </ul>
                    </div>
                </div>

                {/* Footer Section with Support and Logout */}
                <div className={cn(
                    sidebarStyles.footerContainer.base,
                    isCollapsed ? sidebarStyles.footerContainer.collapsed : sidebarStyles.footerContainer.expanded
                )}>
                    <button
                        onClick={() => setShowSupportModal(true)}
                        className={cn(
                            sidebarStyles.footerLink.base,
                            "w-full text-left cursor-pointer",
                            isCollapsed && sidebarStyles.footerLink.collapsed
                        )}
                    >
                        <HelpCircle size={20} className="text-gray-500 min-w-[20px]" />
                        {!isCollapsed && <span>Support</span>}
                    </button>

                    <button
                        onClick={handleLogout}
                        className={cn(
                            sidebarStyles.logoutButton.base,
                            isCollapsed && sidebarStyles.logoutButton.collapsed
                        )}
                    >
                        <LogOut size={20} className="text-gray-500 min-w-[20px]" />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </motion.div>

            {/* Mobile Toggle Button */}
            <motion.button
                onClick={() => setMobileOpen((prev) => !prev)}
                className={sidebarStyles.mobileMenuButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>

            {/* Mobile Drawer Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className={sidebarStyles.mobileOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className={sidebarStyles.mobileBackdrop}
                            onClick={() => setMobileOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        
                        <motion.div
                            ref={sidebarRef}
                            className={sidebarStyles.mobileSidebar.base}
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        >
                            <div className="relative h-full flex flex-col justify-between">
                                <div>
                                    <div className={sidebarStyles.mobileHeader}>
                                        <div className={sidebarStyles.mobileUserContainer}>
                                            <div className={sidebarStyles.userInitials.base}>
                                                {initial}
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-800">{username}</h2>
                                                <p className="text-sm text-gray-500">{email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setMobileOpen(false)}
                                            className={sidebarStyles.mobileCloseButton}
                                        >
                                            <X size={24} className="text-gray-600" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto py-4">
                                        <ul className={sidebarStyles.mobileMenuList}>
                                            {MENU_ITEMS.map(({ text, path, icon }) => (
                                                <motion.li key={text} whileTap={{ scale: 0.98 }}>
                                                    <Link
                                                        to={path}
                                                        onClick={() => setMobileOpen(false)}
                                                        className={cn(
                                                            sidebarStyles.mobileMenuItem.base,
                                                            pathname === path 
                                                                ? sidebarStyles.mobileMenuItem.active 
                                                                : sidebarStyles.mobileMenuItem.inactive
                                                        )}
                                                    >
                                                        <span className={pathname === path ? sidebarStyles.menuIcon.active : sidebarStyles.menuIcon.inactive}>
                                                            {icon}
                                                        </span>
                                                        <span>{text}</span>
                                                    </Link>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Mobile Footer Section */}
                                <div className={sidebarStyles.mobileFooter}>
                                    <button
                                        onClick={() => {
                                            setShowSupportModal(true);
                                            setMobileOpen(false);
                                        }}
                                        className={sidebarStyles.mobileFooterLink}
                                    >
                                        <HelpCircle size={20} className="text-gray-500" />
                                        <span>Support</span>
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className={sidebarStyles.mobileLogoutButton}
                                    >
                                        <LogOut size={20} className="text-gray-500" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Support / Contact Popup Modal */}
            <AnimatePresence>
                {showSupportModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
                        >
                            <button
                                onClick={() => setShowSupportModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-xl font-bold text-gray-800 mb-2">Contact & Support</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                If you need any help or want to connect with me, feel free to reach out through the channels below:
                            </p>

                            <div className="space-y-4">
                                <a
                                    href="mailto:riddhithorat09@gmail.com"
                                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-gray-100"
                                >
                                    <Mail size={20} className="text-indigo-600" />
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Email</p>
                                        <p className="text-sm font-semibold text-gray-800">riddhithorat09@gmail.com</p>
                                    </div>
                                </a>

                                <a
                                    href="https://www.linkedin.com/in/riddhi-thorat-a15a96378"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-gray-100"
                                >
                                    <Globe size={20} className="text-indigo-600" />
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">LinkedIn</p>
                                        <p className="text-sm font-semibold text-gray-800">Riddhi Thorat</p>
                                    </div>
                                </a>

                                <a
                                    href="https://github.com/Riddhi15Thorat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-gray-100"
                                >
                                    <Globe size={20} className="text-indigo-600" />
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">GitHub</p>
                                        <p className="text-sm font-semibold text-gray-800">Riddhi15Thorat</p>
                                    </div>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  HelpCircle,
  Building2,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useCallFlow } from '../../context/CallFlowContext';

export const TopNav: React.FC = () => {
  const {
    activeTab,
    theme,
    toggleTheme,
    setIsSearchOpen,
    setIsHelpOpen,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    setSelectedCallId,
    setActiveTab,
    resetDemoData,
  } = useCallFlow();

  const [showOrgMenu, setShowOrgMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [currentOrg, setCurrentOrg] = useState('Apex Global Sales (US-West)');

  const unreadCount = notifications.filter(n => !n.read).length;

  const orgs = [
    'Apex Global Sales (US-West)',
    'EMEA Outbound Hub (London)',
    'Fintech Enterprise SDRs',
    'APAC Expansion Team',
  ];

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Overview & Real-time Operations';
      case 'intelligence':
        return 'Call Intelligence & Speech Analytics';
      case 'reviews':
        return 'Manager Approval & CRM Staging Queue';
      case 'import':
        return 'Import Center & Transcript Processing';
      case 'tasks':
        return 'Automated Follow-up Tasks';
      case 'leads':
        return 'Leads & Accounts Directory';
      case 'workflows':
        return 'Automation Workflow Builder';
      case 'integrations':
        return 'Integrations & CRM Connectors';
      case 'reports':
        return 'Executive Reports & Analytics';
      case 'team':
        return 'Team Directory & Agent Performance';
      case 'settings':
        return 'Platform Settings & AI Model Preferences';
      default:
        return 'Dashboard';
    }
  };

  const handleNotificationClick = (relatedCallId?: string, notifId?: string) => {
    if (notifId) markNotificationAsRead(notifId);
    if (relatedCallId) {
      setSelectedCallId(relatedCallId);
      setActiveTab('intelligence');
    }
    setShowNotifMenu(false);
  };

  return (
    <header className="h-16 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-slate-950/80 dark:bg-slate-950/80 light:bg-white/80 backdrop-blur-md px-6 flex items-center justify-between gap-6 z-10 shrink-0">
      {/* Breadcrumb Section */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="hover:text-slate-200 transition-colors">CallFlow AI</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 dark:text-slate-200 light:text-slate-800 font-semibold truncate max-w-xs md:max-w-md">
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Global Search and Action Controls */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 hover:bg-slate-800/80 dark:hover:bg-slate-800/80 light:hover:bg-slate-200 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-300 text-xs text-slate-400 hover:text-slate-200 transition-all w-52 md:w-64"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate flex-1 text-left">Search calls, tasks, leads...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 dark:bg-slate-800 light:bg-slate-200 rounded border border-slate-700/60 dark:border-slate-700/60 light:border-slate-300">
            ⌘K
          </kbd>
        </button>

        {/* Organization Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowOrgMenu(prev => !prev)}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 dark:text-slate-300 light:text-slate-700 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-300 hover:bg-slate-800/80 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="truncate max-w-[130px]">{currentOrg}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showOrgMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-xl p-1.5 z-50">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Workspace
              </div>
              {orgs.map(org => (
                <button
                  key={org}
                  onClick={() => {
                    setCurrentOrg(org);
                    setShowOrgMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                    currentOrg === org
                      ? 'bg-blue-600/15 text-blue-400 font-semibold'
                      : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{org}</span>
                  {currentOrg === org && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quickstart / Product Walkthrough */}
        <button
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 dark:text-slate-300 light:text-slate-700 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-300 hover:bg-slate-800/80 transition-colors"
          title="Interactive Product Guide"
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Guide</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(prev => !prev)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 dark:hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 transition-colors"
            title="Notifications"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-mono bg-blue-500/20 text-blue-400 rounded-md">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto space-y-1 py-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">No notifications</div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.relatedCallId, notif.id)}
                      className={`p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                        notif.read
                          ? 'opacity-70 hover:opacity-100 hover:bg-slate-800/40'
                          : 'bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/15'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
                          {notif.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demo Reset button */}
        <button
          onClick={resetDemoData}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-300 dark:hover:text-slate-300 light:hover:text-slate-700 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 transition-colors"
          title="Reset demo data to initial state"
          aria-label="Reset demo data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};

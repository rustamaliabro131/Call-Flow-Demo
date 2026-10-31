import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  CheckSquare,
  UploadCloud,
  ListTodo,
  Users2,
  Workflow,
  Blocks,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Zap,
} from 'lucide-react';
import { useCallFlow } from '../../context/CallFlowContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    metrics,
    setSelectedCallId,
    setSelectedLeadId,
  } = useCallFlow();

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'intelligence', label: 'Call Intelligence', icon: Headphones, badge: metrics.totalCalls },
    {
      id: 'reviews',
      label: 'Call Reviews',
      icon: Sparkles,
      badge: metrics.pendingApprovals,
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    },
    { id: 'import', label: 'Import Center', icon: UploadCloud },
    {
      id: 'tasks',
      label: 'Follow-up Tasks',
      icon: ListTodo,
      badge: metrics.openTasksCount,
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    },
    { id: 'leads', label: 'Leads & Contacts', icon: Users2 },
    { id: 'workflows', label: 'Automation Workflows', icon: Workflow },
    { id: 'integrations', label: 'Integrations', icon: Blocks },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team Management', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setSelectedCallId(null);
    setSelectedLeadId(null);
  };

  return (
    <aside
      className={`relative z-20 flex flex-col border-r transition-all duration-300 ease-in-out shrink-0 select-none
        ${
          sidebarCollapsed ? 'w-18' : 'w-64'
        } bg-slate-950/95 dark:bg-slate-950/95 light:bg-white border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 backdrop-blur-xl h-screen`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
        <button
          onClick={() => handleNavClick('overview')}
          className="flex items-center gap-3 text-left focus:outline-none group overflow-hidden"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Zap className="w-5 h-5 text-blue-200" />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
          </div>

          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <span className="text-base font-bold tracking-tight text-white dark:text-white light:text-slate-900 whitespace-nowrap">
                CallFlow <span className="text-blue-400">AI</span>
              </span>
              <span className="text-[10px] font-medium tracking-wide text-slate-400 uppercase whitespace-nowrap">
                Workflow Automation
              </span>
            </div>
          )}
        </button>

        <button
          onClick={() => setSidebarCollapsed(prev => !prev)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
        <div className="mb-2">
          {!sidebarCollapsed && (
            <span className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Main Menu
            </span>
          )}
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 dark:text-blue-400 light:text-blue-600 light:bg-blue-50 font-semibold shadow-xs'
                  : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200 dark:hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-900/60 dark:hover:bg-slate-900/60 light:hover:bg-slate-100'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? 'text-blue-400 dark:text-blue-400 light:text-blue-600'
                    : 'text-slate-400 group-hover:text-slate-200 dark:group-hover:text-slate-200 light:group-hover:text-slate-800'
                }`}
              />

              {!sidebarCollapsed && (
                <span className="truncate flex-1 text-left whitespace-nowrap">{item.label}</span>
              )}

              {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-full shrink-0 font-medium ${
                    item.badgeColor || 'bg-slate-800/80 text-slate-300 border border-slate-700/50'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Collapsed dot badge */}
              {sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Status Box */}
      {!sidebarCollapsed && (
        <div className="p-3 mx-2.5 mb-3 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">AI Engine</span>
            <span className="font-mono tabular-nums text-emerald-400 text-[11px]">Online</span>
          </div>
          <div className="w-full bg-slate-800 dark:bg-slate-800 light:bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full w-[78%]" />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Quota Used</span>
            <span className="font-mono tabular-nums">78.4% · 3.9k calls</span>
          </div>
        </div>
      )}

      {/* User Quick Info */}
      <div className="flex items-center gap-3 p-3 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
          alt="Alex Morgan"
          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
        />
        {!sidebarCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-slate-200 dark:text-slate-200 light:text-slate-800 truncate">
              Alex Morgan
            </span>
            <span className="text-[11px] text-slate-400 truncate">Director of Sales Ops</span>
          </div>
        )}
      </div>
    </aside>
  );
};

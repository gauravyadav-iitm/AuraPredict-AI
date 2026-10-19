import {
  LayoutDashboard,
  Upload,
  BarChart3,
  Users,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Data Upload', icon: Upload },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'customers', label: 'Customers', icon: Users },
];

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'notifications', label: 'Alerts', icon: Bell },
  { id: 'help', label: 'Help Center', icon: HelpCircle },
];

export default function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r border-ink-700/50 bg-ink-900/60 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-ink-700/40">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 glow-primary">
          <span className="text-lg font-bold text-white">A</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight">AuraPredict</h1>
          <p className="text-[10px] font-medium text-primary-400 tracking-widest uppercase">AI Analytics</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-400">Main</p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                      : 'text-ink-300 hover:bg-ink-700/40 hover:text-ink-100 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-primary-400' : 'text-ink-400 group-hover:text-ink-200'}`} strokeWidth={1.8} />
                  {item.label}
                  {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse-glow" />}
                </button>
              </li>
            );
          })}
        </ul>

        <p className="px-3 pt-6 pb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-400">System</p>
        <ul className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                      : 'text-ink-300 hover:bg-ink-700/40 hover:text-ink-100 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-primary-400' : 'text-ink-400 group-hover:text-ink-200'}`} strokeWidth={1.8} />
                  {item.label}
                  {item.id === 'notifications' && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">3</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-ink-700/40 p-3">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-ink-700/40 transition-colors cursor-pointer group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-primary-600 text-xs font-bold text-white">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink-100 truncate">James Donnelly</p>
            <p className="text-[11px] text-ink-400 truncate">Data Scientist</p>
          </div>
          <LogOut className="h-4 w-4 text-ink-400 group-hover:text-red-400 transition-colors" strokeWidth={1.8} />
        </div>
      </div>
    </aside>
  );
}

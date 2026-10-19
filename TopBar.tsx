import { Search, Bell, ChevronDown, Sparkles } from 'lucide-react';

interface TopBarProps {
  pageTitle: string;
  pageSubtitle: string;
}

export default function TopBar({ pageTitle, pageSubtitle }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-ink-700/40 bg-ink-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight truncate">{pageTitle}</h2>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-primary-500/10 border border-primary-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-primary-400">
              <Sparkles className="h-3 w-3" />
              AI-Powered
            </span>
          </div>
          <p className="mt-0.5 text-sm text-ink-400 truncate">{pageSubtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-ink-700/60 bg-ink-850/60 px-3 py-2 w-64 transition-colors hover:border-ink-600">
            <Search className="h-4 w-4 text-ink-400" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search customers..."
              className="flex-1 bg-transparent text-sm text-ink-100 placeholder:text-ink-400 outline-none"
            />
            <kbd className="hidden lg:inline text-[10px] font-mono text-ink-400 border border-ink-600 rounded px-1.5 py-0.5">K</kbd>
          </div>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-ink-700/60 bg-ink-850/60 text-ink-300 hover:text-ink-100 hover:border-ink-600 transition-colors">
            <Bell className="h-4 w-4" strokeWidth={1.8} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-ink-950" />
          </button>

          <div className="flex items-center gap-2.5 rounded-lg border border-ink-700/60 bg-ink-850/60 pl-2.5 pr-3 py-1.5 cursor-pointer hover:border-ink-600 transition-colors">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent-500 to-primary-600 text-[10px] font-bold text-white">
              JD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-ink-100 leading-tight">James D.</p>
              <p className="text-[10px] text-ink-400 leading-tight">Pro Plan</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-ink-400" strokeWidth={1.8} />
          </div>
        </div>
      </div>
    </header>
  );
}

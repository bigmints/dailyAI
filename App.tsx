
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Article, DailyEdition, AppMode } from './types';
import SlideshowPost from './components/SlideshowPost';
import CurateMode from './components/CurateMode';
import { LayoutGrid, PlusCircle, Sparkles, User, ArrowUp, Zap, Radio, Menu, X } from 'lucide-react';
import { loadAllEditions } from './services/dataService';

const App: React.FC = () => {
  const [editions, setEditions] = useState<DailyEdition[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [mode, setMode] = useState<AppMode>(AppMode.FEED);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Load editions from JSON files on mount
  useEffect(() => {
    loadAllEditions()
      .then(data => {
        setEditions(data);
        setIsInitialLoading(false);
      })
      .catch(error => {
        console.error('Failed to load editions:', error);
        setIsInitialLoading(false);
      });
  }, []);

  const loadMoreEditions = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const olderDate = new Date();
    olderDate.setDate(olderDate.getDate() - editions.length);

    const newEdition: DailyEdition = {
      id: `ed-${Math.floor(Math.random() * 90) + 10}`,
      date: olderDate.toISOString(),
      title: 'Material Science & Pure Design',
      articles: [
        {
          id: `a-${Math.random()}`,
          title: 'Design as a Tool for Focus',
          url: 'https://example.com',
          shortDescription: 'Why simplicity remains the ultimate sophistication in hardware development.',
          fullSummary: '...',
          imageUrl: `https://picsum.photos/seed/${Math.random()}/1200/1500`,
          category: 'Philosophy',
          date: olderDate.toISOString()
        }
      ]
    };

    setEditions(prev => [...prev, newEdition]);
    setIsLoadingMore(false);
  }, [editions.length, isLoadingMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && mode === AppMode.FEED) loadMoreEditions();
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [loadMoreEditions, mode]);

  const handleArticleAdded = (newArticle: Article) => {
    setEditions(prev => {
      const updated = [...prev];
      updated[0].articles = [newArticle, ...updated[0].articles];
      return updated;
    });
    setMode(AppMode.FEED);
  };

  const navItems = [
    { label: 'The Feed', icon: <LayoutGrid size={18} />, mode: AppMode.FEED },
    { label: 'Curate', icon: <PlusCircle size={18} />, mode: AppMode.CURATE },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 transition-colors duration-300">

      {/* Desktop Floating Command Center (Bottom-Left) */}
      <div className="fixed bottom-8 left-8 z-[60] hidden lg:block">
        <div className="glass dark:bg-zinc-900/80 dark:border-white/10 p-5 rounded-[28px] shadow-airbnb border border-black/5 flex flex-col gap-6 w-[220px]">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
            setMode(AppMode.FEED);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            <img
              src={`${(import.meta as any).env.BASE_URL}logo.png`}
              alt="Pulse Logo"
              className="w-10 h-10 object-contain rounded-xl"
            />
            <div>
              <h1 className="text-lg font-extrabold tracking-tighter text-[#222222] dark:text-zinc-100">Pulse</h1>
              <p className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase mt-0.5">Gemini AI</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setMode(item.mode)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold text-sm ${mode === item.mode ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-[#717171] dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-[#222222] dark:hover:text-zinc-200'}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
          <div className="h-px bg-black/5 w-full" />
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center border border-black/5">
                <User size={14} className="text-zinc-500" />
              </div>
              <span className="text-xs font-bold text-[#717171]">Account</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>
        </div>
      </div>

      {/* Mobile Normal App Bar (Top Edge-to-Edge) */}
      <header className="fixed top-0 left-0 right-0 z-[100] h-16 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-black/5 dark:border-white/5 px-6 flex items-center justify-between lg:hidden shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3" onClick={() => {
          setMode(AppMode.FEED);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>
          <img
            src={`${(import.meta as any).env.BASE_URL}logo.png`}
            alt="Pulse Logo"
            className="w-10 h-10 object-contain rounded-xl"
          />
          <div>
            <h1 className="text-base font-extrabold tracking-tighter text-[#222222] dark:text-zinc-100 leading-none">Pulse</h1>
            <p className="text-[8px] font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase mt-0.5 leading-none">Intelligence</p>
          </div>
        </div>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="w-10 h-10 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 rounded-full text-[#222222] dark:text-zinc-200 active:scale-90 transition-transform"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[110] transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-[32px] p-8 shadow-2xl transition-transform duration-500 ease-out transform ${isMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full mx-auto mb-10" />

          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={`${(import.meta as any).env.BASE_URL}logo.png`}
                  alt="Pulse Logo"
                  className="w-16 h-16 object-contain rounded-2xl"
                />
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tighter text-[#222222] dark:text-zinc-100">Pulse</h1>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase">Curated by Gemini</p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[#717171] dark:text-zinc-400 active:scale-90 transition-transform"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setMode(item.mode);
                    setIsMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center justify-between p-6 rounded-[24px] font-bold text-xl transition-all ${mode === item.mode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-[#717171] bg-[#f7f7f7]'}`}
                >
                  <div className="flex items-center gap-4">
                    {React.cloneElement(item.icon as React.ReactElement, { size: 28 })}
                    <span>{item.label}</span>
                  </div>
                  <Sparkles size={20} className={mode === item.mode ? 'opacity-100' : 'opacity-0'} />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between p-6 bg-[#f7f7f7] rounded-[24px] border border-black/5 mt-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-black/5">
                  <User size={24} className="text-zinc-500" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#222222]">Personal Pulse</p>
                  <p className="text-xs font-semibold text-[#717171]">Settings & Preferences</p>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <main className="pt-24 lg:pt-16 pb-48 px-6">
        {isInitialLoading ? (
          <div className="min-h-screen flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-lg font-bold text-[#222222] dark:text-zinc-100 mb-1">Loading Daily Editions...</p>
              <p className="text-xs text-[#717171] dark:text-zinc-500">Curating your personalized feed</p>
            </div>
          </div>
        ) : mode === AppMode.CURATE ? (
          <div className="max-w-xl mx-auto pt-10">
            <CurateMode onArticleAdded={handleArticleAdded} />
          </div>
        ) : (
          <div>
            <div className={`p-4 rounded-[20px] mb-6 ${isInitialLoading ? 'bg-indigo-50 dark:bg-indigo-900/10' : 'bg-transparent'}`}>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles size={16} className={`${isInitialLoading ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-500'} animate-pulse`} />
                <span className={`text-xs font-bold tracking-wider uppercase ${isInitialLoading ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-500'}`}>
                  {isInitialLoading ? 'Syncing...' : 'Daily Insight'}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-[#222222] dark:text-zinc-100 mb-2 leading-[0.9]">
                {editions.length > 0 ? editions[0].title : 'Curating Feed...'}
              </h1>
              <p className="text-sm font-medium text-[#717171] dark:text-zinc-400 leading-relaxed max-w-lg">
                Today's most important developments in AI and science, summarized for clarity.
              </p>
            </div>

            <div className="flex items-center gap-4 mb-2 pl-1">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => <div key={i} className="w-9 h-9 rounded-full border-[3px] border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800" />)}
              </div>
              <p className="text-[13px] text-[#717171] dark:text-zinc-400 font-bold leading-tight text-center sm:text-left">
                <span className="text-[#222222] dark:text-zinc-200">Freshly Curated</span><br />
                {editions.length > 0 ? editions[0].articles.length : 0} essential insights waiting for you.
              </p>
            </div>

            <div className="flex flex-col gap-14">
              {editions.map((edition) => (
                <SlideshowPost key={edition.id} edition={edition} />
              ))}
            </div>

            <div ref={observerTarget} className="py-32 flex flex-col items-center gap-6">
              {isLoadingMore ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-indigo-600/5 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#717171]">Expanding Knowledge Base...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-10">
                  <LayoutGrid size={24} className="mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Knowledge Stream End</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Back to Top (Bottom-Right) */}
      {mode === AppMode.FEED && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-14 h-14 bg-white text-[#222222] rounded-[22px] shadow-airbnb flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-black/5 z-50 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-indigo-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <ArrowUp size={20} className="relative group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default App;

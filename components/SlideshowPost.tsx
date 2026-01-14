import React, { useRef, useState, useEffect } from 'react';
import { DailyEdition } from '../types';
import { ChevronLeft, ChevronRight, Share2, MoreHorizontal, Layers, ArrowRight, ChevronRight as ChevronRightIcon, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import { markEditionAsRead } from '../services/readTracker';
import SharePreviewModal from './SharePreviewModal';
import { Analytics } from '../services/analytics';
interface SlideshowPostProps {
  edition: DailyEdition;
  onEditionRead?: () => void; // Callback when edition is marked as read
}

const SlideshowPost: React.FC<SlideshowPostProps> = ({ edition, onEditionRead }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const totalSlides = edition.articles.length + 2; // Cover + Articles + Feedback Slide

  const handleShare = () => {
    setShowShareModal(true);
    Analytics.trackShareClick(edition.id);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const slideWidth = scrollRef.current.offsetWidth;
      if (slideWidth > 0) {
        const newActiveSlide = Math.round(scrollPosition / slideWidth);
        if (newActiveSlide !== activeSlide) {
          setActiveSlide(newActiveSlide);

          // Mark edition as read when user views it (skip cover slide which is index 0)
          if (newActiveSlide > 0) {
            markEditionAsRead(edition.id);
            onEditionRead?.();
            Analytics.trackEditionViewed(edition.id);
          }
        }
      }
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full max-w-[548px] mx-auto animate-pulse-in">
      {/* Main Slideshow Card - Full Bleed Image Container */}
      <div className="relative aspect-[3/5] lg:aspect-auto lg:h-[70vh] bg-zinc-100 dark:bg-zinc-900 rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-[#ebebeb] dark:border-zinc-800 group mb-5">

        {/* Story Progress Indicators (Top Bar) */}
        <div className="absolute top-5 inset-x-10 z-30 flex gap-1.5 h-[2px]">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div key={i} className="flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className={`h-full bg-white transition-all duration-300 ease-out ${activeSlide === i ? 'w-full' : activeSlide > i ? 'w-full' : 'w-0'}`}
              />
            </div>
          ))}
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar cursor-pointer"
        >
          {/* Cover Slide */}
          <div className="flex-shrink-0 w-full h-full relative snap-start">
            <div className="absolute inset-0">
              <ImageWithFallback
                src={edition.cover?.imageUrl || edition.articles[0]?.imageUrl}
                alt="Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
            </div>

            <div className="absolute inset-0 p-10 flex flex-col justify-end z-10">
              <div className="mb-10">
                {edition.cover ? (
                  <div className="flex flex-col gap-5">
                    {edition.cover.title && (
                      <h1 className="text-[12px] font-bold text-white/50 uppercase tracking-[0.3em] animate-fade-in">
                        {edition.cover.title}
                      </h1>
                    )}
                    <h1 className="text-[28px] sm:text-[36px] font-black text-white leading-[1.1] tracking-tighter line-clamp-[6]">
                      {edition.cover.summary}
                    </h1>
                  </div>
                ) : edition.summary ? (
                  <h1 className="text-[36px] sm:text-[44px] font-black text-white leading-[1] tracking-tighter">
                    {edition.summary}
                  </h1>
                ) : (
                  <div className="flex flex-col gap-6">
                    <h1 className="text-[12px] font-bold text-white/50 uppercase tracking-[0.3em]">
                      Briefing • {new Date(edition.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                    </h1>
                    <div className="flex flex-col gap-4">
                      {edition.articles.slice(0, 3).map((article) => (
                        <div key={article.id} className="flex gap-4 items-start">
                          <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(var(--primary-500),0.5)]" />
                          <h2 className="text-xl font-bold text-white leading-tight underline decoration-white/20 underline-offset-4">{article.title}</h2>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-white/40 text-[10px] font-black uppercase tracking-[0.25em] border-t border-white/10 pt-8 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-white/30" />
                  <span>Swipe Cards</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRightIcon size={14} className="opacity-80" />
                </div>
              </div>
            </div>
          </div>

          {/* Article Slides - Flashcard Design */}
          {edition.articles.map((article) => (
            <div key={article.id} className="flex-shrink-0 w-full h-full relative snap-start overflow-hidden bg-zinc-950">
              {/* Background with heavy blur/dim for card focus */}
              <div className="absolute inset-0">
                <ImageWithFallback
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover scale-110 blur-sm opacity-40 transition-transform duration-1000 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
              </div>

              {/* Centered Flashcard */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                <div className="w-full max-w-[400px] flex flex-col items-center text-center space-y-8 animate-fade-in-up">
                  <div className="space-y-4 flex flex-col items-center">
                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-3xl border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl">
                      {article.category}
                    </span>
                    <h3 className="text-[32px] sm:text-[38px] font-black text-white leading-[1.1] tracking-tighter">
                      {article.title}
                    </h3>
                  </div>

                  <div className="w-12 h-[2px] bg-primary-500 rounded-full" />

                  <p className="text-zinc-300 text-[15px] sm:text-[16px] leading-relaxed font-medium line-clamp-4 max-w-[320px]">
                    {article.shortDescription}
                  </p>

                  <div className="pt-4">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => Analytics.trackArticleClick(article.id, article.url)}
                      className="group/flashcard relative inline-flex items-center gap-3 px-10 py-4 bg-white text-black rounded-full font-black text-[13px] uppercase tracking-wider hover:bg-zinc-100 transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
                    >
                      <span>Deep Dive</span>
                      <ArrowRight size={16} className="transition-transform group-hover/flashcard:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Feedback Slide */}
          <div className="flex-shrink-0 w-full h-full relative snap-start bg-[#09090b] flex flex-col items-center justify-center p-10 text-center">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-400 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {feedback ? (
                <div className="animate-fade-in-up flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-primary-600/10 rounded-full flex items-center justify-center text-primary-500 mb-2">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[28px] font-extrabold text-white tracking-tighter leading-tight">
                    Thank you for your feedback!
                  </h3>
                  <p className="text-zinc-400 text-sm font-medium max-w-[240px]">
                    We'll use your input to refine future briefings.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-10">
                  <div className="space-y-3">
                    <h3 className="text-[32px] font-black text-white tracking-tighter leading-tight">
                      How was today's<br />briefing?
                    </h3>
                    <p className="text-zinc-400 text-sm font-medium">
                      Help us improve your intelligence feed.
                    </p>
                  </div>

                  <div className="flex gap-6">
                    <button
                      onClick={() => {
                        setFeedback('like');
                        Analytics.trackEditionFeedback(edition.id, 'like');
                      }}
                      className="group flex flex-col items-center gap-3 transition-transform active:scale-90"
                    >
                      <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-xl">
                        <ThumbsUp size={24} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Helpful</span>
                    </button>

                    <button
                      onClick={() => {
                        setFeedback('dislike');
                        Analytics.trackEditionFeedback(edition.id, 'dislike');
                      }}
                      className="group flex flex-col items-center gap-3 transition-transform active:scale-90"
                    >
                      <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-red-600 group-hover:text-white transition-all shadow-xl">
                        <ThumbsDown size={24} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Not for me</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Side Controls */}
        <button
          onClick={(e) => { e.stopPropagation(); scrollToSlide(activeSlide - 1); }}
          className={`absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full items-center justify-center text-[#222222] shadow-soft transition-all z-30 ${activeSlide > 0 ? 'hidden sm:flex opacity-0 group-hover:opacity-100' : 'hidden'}`}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); scrollToSlide(activeSlide + 1); }}
          className={`absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full items-center justify-center text-[#222222] shadow-soft transition-all z-30 ${activeSlide < totalSlides - 1 ? 'hidden sm:flex opacity-0 group-hover:opacity-100' : 'hidden'}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Footer Content - Metadata BELOW the card (Removed Title, kept Date) */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[13px] text-[#717171] dark:text-zinc-400 font-bold tracking-tight">
          {edition.author || 'Pretheesh'}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-[#222222] dark:text-zinc-200"
          >
            <Share2 size={18} />
          </button>
          <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-[#222222] dark:text-zinc-200">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      <SharePreviewModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        edition={edition}
      />
    </div>
  );
};


export default SlideshowPost;

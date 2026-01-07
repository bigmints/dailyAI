import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, ArrowRight, Sparkles, Code, Palette, Linkedin, Mail } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import { Analytics } from '../services/analytics';

const AboutPage: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const totalSlides = 3;

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollPosition = scrollRef.current.scrollLeft;
            const slideWidth = scrollRef.current.offsetWidth;
            if (slideWidth > 0) {
                const newActiveSlide = Math.round(scrollPosition / slideWidth);
                if (newActiveSlide !== activeSlide) {
                    setActiveSlide(newActiveSlide);
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

    const experiments = [
        { name: 'Sonic', description: 'Audio Visualizer', icon: '🎵' },
        { name: 'Zcret', description: 'Secret Sharing', icon: '🔐' },
        { name: 'Pulse', description: 'AI News Digest', icon: '📰' }
    ];

    return (
        <div className="w-full max-w-[548px] mx-auto animate-pulse-in">
            {/* Main Card Container */}
            <div className="relative aspect-[3/5] lg:aspect-auto lg:h-[70vh] bg-zinc-100 dark:bg-zinc-900 rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-[#ebebeb] dark:border-zinc-800 group mb-5">

                {/* Progress Indicators */}
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
                    {/* Slide 1: Intro */}
                    <div className="flex-shrink-0 w-full h-full relative snap-start bg-gradient-to-br from-indigo-950 via-purple-950 to-black">
                        <div className="absolute inset-0">
                            <ImageWithFallback
                                src="https://www.bigmints.com/profile.png"
                                alt="Pretheesh Thomas"
                                className="w-full h-full object-cover opacity-30 blur-sm"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 z-10 text-center">
                            <div className="w-full max-w-[400px] flex flex-col items-center space-y-8 animate-fade-in-up">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                                    <ImageWithFallback
                                        src="https://www.bigmints.com/profile.png"
                                        alt="Pretheesh Thomas"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <h1 className="text-[36px] sm:text-[42px] font-black text-white leading-[1.1] tracking-tighter">
                                        Pretheesh Thomas
                                    </h1>
                                    <div className="w-12 h-[2px] bg-primary-500 rounded-full mx-auto" />
                                    <p className="text-zinc-300 text-[16px] sm:text-[18px] leading-relaxed font-medium max-w-[340px]">
                                        Experience Design Leader and Technologist based in Dubai. Blending full-stack engineering with high-fidelity design to build enterprise-grade systems and autonomous agents.
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <a
                                        href="https://www.bigmints.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => Analytics.trackEvent('about_link_click', 'engagement', 'portfolio')}
                                        className="group/link inline-flex items-center gap-3 px-10 py-4 bg-white text-black rounded-full font-black text-[13px] uppercase tracking-wider hover:bg-zinc-100 transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
                                    >
                                        <span>Visit My Website</span>
                                        <ExternalLink size={16} className="transition-transform group-hover/link:translate-x-1" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slide 2: Experiments */}
                    <div className="flex-shrink-0 w-full h-full relative snap-start bg-zinc-950">
                        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                            <div className="w-full max-w-[400px] flex flex-col items-center text-center space-y-10 animate-fade-in-up">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-3xl border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                                        <Sparkles size={12} />
                                        <span>Playground</span>
                                    </div>
                                    <h2 className="text-[32px] sm:text-[38px] font-black text-white leading-[1.1] tracking-tighter">
                                        AI & Experiments
                                    </h2>
                                </div>

                                <div className="w-full space-y-4">
                                    {experiments.map((exp, idx) => (
                                        <div
                                            key={idx}
                                            className="group/exp p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="text-4xl">{exp.icon}</div>
                                                <div className="flex-1 text-left">
                                                    <h3 className="text-white font-black text-lg">{exp.name}</h3>
                                                    <p className="text-zinc-400 text-sm font-medium">{exp.description}</p>
                                                </div>
                                                <ArrowRight size={20} className="text-white/40 group-hover/exp:text-white group-hover/exp:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <a
                                    href="https://www.bigmints.com/#/experiments"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => Analytics.trackEvent('about_link_click', 'engagement', 'experiments')}
                                    className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-bold text-sm transition-colors"
                                >
                                    <span>View All Experiments</span>
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Slide 3: Subscribe */}
                    <div className="flex-shrink-0 w-full h-full relative snap-start bg-gradient-to-br from-blue-950 via-indigo-950 to-black">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600 rounded-full blur-[120px]" />
                            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                            <div className="w-full max-w-[400px] flex flex-col items-center text-center space-y-10 animate-fade-in-up">
                                <div className="space-y-4">
                                    <h2 className="text-[32px] sm:text-[38px] font-black text-white leading-[1.1] tracking-tighter">
                                        Stay Connected
                                    </h2>
                                    <div className="w-12 h-[2px] bg-primary-500 rounded-full mx-auto" />
                                    <p className="text-zinc-300 text-[15px] leading-relaxed font-medium max-w-[320px]">
                                        Get insights on design, AI, and technology delivered to your inbox.
                                    </p>
                                </div>

                                <div className="w-full space-y-4">
                                    <a
                                        href="https://pshmt.substack.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => Analytics.trackEvent('about_link_click', 'engagement', 'substack')}
                                        className="group/sub w-full flex items-center justify-between p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/20 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                                <Mail size={24} className="text-orange-400" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-white font-black text-base">Newsletter</h3>
                                                <p className="text-zinc-400 text-sm font-medium">Subscribe on Substack</p>
                                            </div>
                                        </div>
                                        <ExternalLink size={20} className="text-white/40 group-hover/sub:text-white transition-colors" />
                                    </a>

                                    <a
                                        href="https://ae.linkedin.com/in/pretheeshmt"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => Analytics.trackEvent('about_link_click', 'engagement', 'linkedin')}
                                        className="group/li w-full flex items-center justify-between p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/20 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                                <Linkedin size={24} className="text-blue-400" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-white font-black text-base">LinkedIn</h3>
                                                <p className="text-zinc-400 text-sm font-medium">Connect professionally</p>
                                            </div>
                                        </div>
                                        <ExternalLink size={20} className="text-white/40 group-hover/li:text-white transition-colors" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Side Controls */}
                <button
                    onClick={(e) => { e.stopPropagation(); scrollToSlide(activeSlide - 1); }}
                    className={`absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full hidden sm:flex items-center justify-center text-[#222222] shadow-soft transition-all z-30 ${activeSlide > 0 ? 'opacity-0 group-hover:opacity-100' : 'hidden'}`}
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); scrollToSlide(activeSlide + 1); }}
                    className={`absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full hidden sm:flex items-center justify-center text-[#222222] shadow-soft transition-all z-30 ${activeSlide < totalSlides - 1 ? 'opacity-0 group-hover:opacity-100' : 'hidden'}`}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default AboutPage;

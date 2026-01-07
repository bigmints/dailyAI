
/**
 * Google Analytics Tracking Utility
 */

declare global {
    interface Window {
        gtag: (command: string, action: string, params?: any) => void;
    }
}

/**
 * Track a custom event in Google Analytics
 */
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window.gtag === 'function') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
};

/**
 * Specific tracking functions for Pulse app
 */
export const Analytics = {
    // Navigation & Mode
    trackAppLoad: () => trackEvent('app_load', 'engagement'),
    trackModeChange: (mode: string) => trackEvent('mode_change', 'navigation', mode),

    // Feed Interactions
    trackEditionViewed: (editionId: string) => trackEvent('edition_view', 'content', editionId),
    trackArticleClick: (articleId: string, url: string) => trackEvent('article_click', 'engagement', `${articleId}: ${url}`),
    trackShareClick: (editionId: string) => trackEvent('share_click', 'engagement', editionId),

    // Curation
    trackArticleCurated: (url: string) => trackEvent('article_curated', 'curation', url),

    // PWA/Install
    trackInstallPrompt: (outcome: string) => trackEvent('install_prompt', 'pwa', outcome),
    trackInstallBannerClick: () => trackEvent('install_banner_click', 'pwa'),

    // Feedback
    trackEditionFeedback: (editionId: string, sentiment: 'like' | 'dislike') =>
        trackEvent('edition_feedback', 'engagement', `${editionId}: ${sentiment}`)
};

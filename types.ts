
export interface Article {
  id: string; // unique article id
  url: string; // external link to the full article
  title: string; // Headline, max 80 chars
  shortDescription: string; // Brief teaser, max 120 chars
  fullSummary: string; // Detailed summary of the article, max 400 chars
  imageUrl: string; // URL to the article image
  date: string; // ISO 8601 or YYYY-MM-DD
  category: string; // e.g., 'AI Engineering', 'Product Design'
}

export interface DailyEdition {
  id: string; // unique identifier, e.g., 'ed-2025-12-27'
  date: string; // ISO 8601 or YYYY-MM-DD
  title: string; // Main title of the edition, max 60 chars
  summary?: string; // Optional: Alternative summary if cover is missing
  cover?: {
    title?: string; // Optional: Title for the intro slide, max 40 chars
    summary: string; // Summary text for the intro slide, max 180 chars
    imageUrl?: string; // Optional: Background image URL for the intro slide
  };
  author?: string; // Optional: Author name, defaults to 'Pretheesh'
  articles: Article[];
}

export interface AppState {
  editions: DailyEdition[];
  isLoading: boolean;
  hasMore: boolean;
}

export enum AppMode {
  FEED = 'FEED',
  CURATE = 'CURATE'
}

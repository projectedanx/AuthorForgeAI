
export interface VSAHypervector {
  dimensions: number[];
  magnitude: number;
}

export interface SymbolicScar {
  scarId: string;
  pattern: string;
  betti1: number;
  fipiVector: VSAHypervector;
  pdlDecorators: string[];
}

export interface JustifiedUncertaintyReport {
  violatedConstraints: string[];
  cfdiScore: number;
  correctiveProposals: string[];
  message: string;
}

export interface NicheInfo {
  niche: string;
  description: string;
}

export interface TrendInfo {
  trend: string;
  reasoning: string;
}

export interface KeywordInfo {
  keyword: string;
  platform: string;
}

export interface AngleInfo {
  angle: string;
  strategy: string;
}

export interface AnalysisResult {
  profitableNiches: NicheInfo[];
  trendingTopics: TrendInfo[];
  keywords: KeywordInfo[];
  uniqueAngles: AngleInfo[];
}

export interface ChapterInfo {
  chapterNumber: number;
  title: string;
  summary: string;
}

export interface BookOutlineResult {
  titleIdeas: string[];
  targetAudience: string;
  chapters: ChapterInfo[];
}

export interface CMDARefinementResult {
  contradictionResolution: string;
  cfdiScore: number;
  refinedChapters: ChapterInfo[];
  bettiNumber?: number;
  pdlDecorators?: string[];
}

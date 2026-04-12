
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

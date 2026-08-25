export interface VisibilityPlatform {
  name: string;
  score: number;
  rating: 'Strong' | 'Moderate' | 'Weak' | 'Not Detected';
  explanation: string;
  reasons: string[];
}

export interface EntitySignal {
  name: string;
  status: 'Detected' | 'Partial' | 'Missing';
  importance: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface ContentAuditElement {
  name: string;
  status: 'Optimized' | 'Needs Work' | 'Absent';
  description: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedGain: number; // e.g., 8
  module: string; // e.g., "Entity Understanding"
}

export interface CompetitorData {
  name: string;
  domain: string;
  visibilityScore: number;
  entityScore: number;
  authorityScore: number;
  contentScore: number;
}

export interface AuditReport {
  domain: string;
  brandName: string;
  industry: string;
  country: string;
  scannedAt: string;
  
  // Executive summary
  overallScore: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  topStrengths: string[];
  topWeaknesses: string[];
  biggestOpportunities: string[];
  
  // Module 1: AI Visibility Analysis
  visibilityPlatforms: {
    chatgpt: VisibilityPlatform;
    gemini: VisibilityPlatform;
    claude: VisibilityPlatform;
    perplexity: VisibilityPlatform;
    googleAiOverviews: VisibilityPlatform;
  };
  
  // Module 2: Entity Understanding
  entityScore: number;
  entityStrengths: string[];
  entityMissing: string[];
  entityImprovements: string[];
  entitySignals: {
    organizationSchema: EntitySignal;
    personSchema: EntitySignal;
    sameAsLinks: EntitySignal;
    brandConsistency: EntitySignal;
    wikidataPresence: EntitySignal;
    wikipediaPresence: EntitySignal;
    knowledgeGraph: EntitySignal;
  };
  
  // Module 3: Content Understanding
  contentScore: number;
  contentAnalysis: {
    servicePages: ContentAuditElement;
    categoryPages: ContentAuditElement;
    aboutPage: ContentAuditElement;
    faqContent: ContentAuditElement;
    authorPages: ContentAuditElement;
    supportingContent: ContentAuditElement;
  };
  topicsCovered: string[];
  topicsMissing: string[];
  contentGaps: string[];
  
  // Module 4: Authority & Trust
  authorityScore: number;
  reviewSignals: string[];
  brandMentions: string[];
  industryCitations: string[];
  newsMentions: string[];
  socialSignals: string[];
  trustSignalsFound: string[];
  trustSignalsMissing: string[];
  mentionSources: string[];
  
  // Module 5: AI Retrieval Readiness
  retrievalScore: number;
  retrievalDetails: {
    semanticHtml: string;
    structuredData: string;
    pageHierarchy: string;
    internalLinking: string;
    crawlability: string;
    contentClarity: string;
    informationArchitecture: string;
  };
  retrievalStrengths: string[];
  retrievalRecommendations: string[];
  
  // Module 6: Technical AI SEO
  technicalScore: number;
  technicalDetails: {
    implemented: string[];
    missing: string[];
    errors: string[];
    warnings: string[];
  };
  
  // Module 7: Competitor Comparison
  competitors: CompetitorData[];
  advantages: string[];
  disadvantages: string[];
  missedOpportunities: string[];
  
  // Module 8: AI Visibility Roadmap
  roadmap: RoadmapItem[];
  
  // Graphic/Visualizations helpers
  trendData: {
    month: string;
    current: number;
    optimized: number;
  }[];
  opportunityMatrix: {
    name: string;
    difficulty: number; // 1-10
    impact: number; // 1-10
    priority: 'High' | 'Medium' | 'Low';
  }[];
}

export interface AuditHistoryEntry {
  id: string;
  domain: string;
  brandName: string;
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  scannedAt: string;
  report: AuditReport; // The full audit report
}

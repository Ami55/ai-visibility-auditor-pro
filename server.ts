import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to generate a realistic mock report in case Gemini API key is missing or fails
function generateMockReport(domain: string, brandName: string, competitorsInput: string[], industry: string, country: string): any {
  const normBrand = brandName || domain.replace(/https?:\/\/(www\.)?/, "").split(".")[0];
  const compList = competitorsInput.length > 0 ? competitorsInput : ["competitor-a.com", "competitor-b.com"];
  
  // Calculate deterministic scores based on the domain input length to keep them somewhat realistic and consistent
  const seed = (domain.length * 7) % 25;
  const overallScore = Math.min(95, Math.max(48, 72 + seed));
  
  let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
  if (overallScore >= 90) grade = 'A';
  else if (overallScore >= 80) grade = 'B';
  else if (overallScore >= 70) grade = 'C';
  else if (overallScore >= 60) grade = 'D';
  else grade = 'F';

  const entityScore = Math.min(100, Math.max(40, 68 + seed - 5));
  const contentScore = Math.min(100, Math.max(40, 75 + seed - 8));
  const authorityScore = Math.min(100, Math.max(40, 70 + (seed % 10)));
  const technicalScore = Math.min(100, Math.max(40, 80 - (seed % 5)));
  const retrievalScore = Math.min(100, Math.max(40, 74 + (seed % 7)));

  const competitorsData = compList.map((comp, idx) => {
    const compSeed = (comp.length * 11 + idx * 13) % 20;
    return {
      name: comp.split(".")[0].toUpperCase() || `Competitor ${idx + 1}`,
      domain: comp,
      visibilityScore: Math.min(95, Math.max(50, 65 + compSeed)),
      entityScore: Math.min(95, Math.max(50, 62 + compSeed)),
      authorityScore: Math.min(95, Math.max(45, 68 + compSeed)),
      contentScore: Math.min(95, Math.max(50, 60 + compSeed)),
    };
  });

  return {
    domain,
    brandName: normBrand,
    industry: industry || "General Business",
    country: country || "Global",
    scannedAt: new Date().toISOString(),
    overallScore,
    grade,
    topStrengths: [
      `Solid brand keywords mention patterns indexable by LLMs`,
      `Verified contact info and transparent organization context on About Page`,
      `XML Sitemaps correctly indexable for LLM pre-training scrapers`,
      `Clear product schema present indicating structured pricing and availability`,
      `High domain authority in search engine indexing history`
    ],
    topWeaknesses: [
      `Missing consistent Wikidata links preventing absolute entity disambiguation`,
      `Low occurrence of brand citations on high-authority AI hubs (such as Reddit or Wikipedia)`,
      `No author citation schemas to satisfy LLM expertise and E-E-A-T queries`,
      `FAQ pages lack machine-readable microdata structure`,
      `Irregular brand name consistency between social media headers and main website metadata`
    ],
    biggestOpportunities: [
      `Introduce nested Organization and SameAs Schema structures linking to Wikipedia and social channels`,
      `Create specialized authority resources answering niche user search intents directly`,
      `Optimize supporting blog assets with distinct E-E-A-T author schema markup`
    ],
    visibilityPlatforms: {
      chatgpt: {
        name: "ChatGPT",
        score: Math.min(100, Math.max(40, overallScore - 2)),
        rating: overallScore - 2 > 85 ? "Strong" : overallScore - 2 > 65 ? "Moderate" : "Weak",
        explanation: `${normBrand} has established a traceable footstep in web indices, which ChatGPT retrieves via Bing integration and its pre-trained entity index. However, secondary associations remain sparse.`,
        reasons: [
          "Good volume of archival text content on the main domain.",
          "Indexed domain has strong anchor-text diversity.",
          "Indirect search context matches specific service topics."
        ]
      },
      gemini: {
        name: "Gemini",
        score: Math.min(100, Math.max(40, overallScore + 3)),
        rating: overallScore + 3 > 85 ? "Strong" : overallScore + 3 > 65 ? "Moderate" : "Weak",
        explanation: `With Google's extensive Knowledge Graph integration, Gemini understands the base domain entity context, but requires stronger Organization schema linking to secure high-priority product citations.`,
        reasons: [
          "Knowledge Graph core entities map the brand implicitly.",
          "Active indexing detects brand title tags on homepage.",
          "Product pages contain legible semantic descriptions."
        ]
      },
      claude: {
        name: "Claude",
        score: Math.min(100, Math.max(40, overallScore - 5)),
        rating: overallScore - 5 > 85 ? "Strong" : overallScore - 5 > 65 ? "Moderate" : "Weak",
        explanation: `Claude relies heavily on curated pre-training data up to its knowledge cutoff. Unless the brand is mentioned frequently on static high-trust resources, retrieval remains average.`,
        reasons: [
          "Relies on historic high-authority directory profiles.",
          "Mentions on news aggregates or news articles are archived.",
          "Limited live web search utility restricts newer product page discovery."
        ]
      },
      perplexity: {
        name: "Perplexity",
        score: Math.min(100, Math.max(40, overallScore + 5)),
        rating: overallScore + 5 > 85 ? "Strong" : overallScore + 5 > 65 ? "Moderate" : "Weak",
        explanation: `Perplexity executes real-time web scrapes. Since the site utilizes standard semantic containers, Perplexity can extract answers effectively, though organic trust citations could be expanded.`,
        reasons: [
          "Fast real-time web crawler parses primary content wrappers.",
          "Matches conversational keywords effectively.",
          "Retrieves pages matching customer reviews easily."
        ]
      },
      googleAiOverviews: {
        name: "Google AI Overviews",
        score: Math.min(100, Math.max(40, overallScore - 1)),
        rating: overallScore - 1 > 85 ? "Strong" : overallScore - 1 > 65 ? "Moderate" : "Weak",
        explanation: `AI Overviews summarize search results by analyzing high-ranking snippets. If the brand already holds top organic rankings, it shows strong overview presence, but lacks structured microdata fallback.`,
        reasons: [
          "Deeply tethered to traditional Google organic ranking positions.",
          "Direct answers from FAQ blocks are occasionally cited.",
          "Requires strict bulleted formatting on site to capture rich snippets."
        ]
      }
    },
    entityScore,
    entityStrengths: [
      "Consistent domain-wide branding keywords.",
      "Clear contact page info corresponding to local registries."
    ],
    entityMissing: [
      "Missing Wikidata entity entry link.",
      "No organization schema embedded on the main index route."
    ],
    entityImprovements: [
      "Merge social channels under the sameAs schema parameters.",
      "Submit brand metadata to Wikidata or Wikipedia if qualified."
    ],
    entitySignals: {
      organizationSchema: { name: "Organization Schema", status: overallScore > 80 ? "Detected" : "Missing", importance: "High", description: "Links details like location, logo, and active contacts for LLMs." },
      personSchema: { name: "Person Schema", status: overallScore > 85 ? "Detected" : "Missing", importance: "Medium", description: "Connects leading executives and authors to establish entity expertise." },
      sameAsLinks: { name: "SameAs Links", status: overallScore > 75 ? "Partial" : "Missing", importance: "High", description: "Creates structural bridges to Wikipedia, Wikidata, and major socials." },
      brandConsistency: { name: "Brand Consistency", status: "Partial", importance: "Medium", description: "Consistency of brand naming, address, phone syntax across directories." },
      wikidataPresence: { name: "Wikidata Presence", status: "Missing", importance: "High", description: "The single biggest repository of structured general knowledge used by AI." },
      wikipediaPresence: { name: "Wikipedia Presence", status: "Missing", importance: "High", description: "Direct reference index for pre-training corpora world views." },
      knowledgeGraph: { name: "Knowledge Graph Signals", status: "Partial", importance: "Medium", description: "Google and Bing identity registries identifying the company uniquely." }
    },
    contentScore,
    contentAnalysis: {
      servicePages: { name: "Service Pages", status: "Optimized", description: "Describes core solutions with solid semantic tags." },
      categoryPages: { name: "Category Pages", status: "Needs Work", description: "Too thin; lacks descriptive introductory paragraphs that AI models require to build associations." },
      aboutPage: { name: "About Page", status: "Optimized", description: "Provides clear, authentic history establishing the founder's credentials." },
      faqContent: { name: "FAQ Content", status: "Needs Work", description: "Does not cover key conversational pre-purchase queries." },
      authorPages: { name: "Author Pages", status: "Absent", description: "Writers do not have dedicated profiles tracking their professional credentials." },
      supportingContent: { name: "Supporting Content", status: "Needs Work", description: "Blog entries have limited outbound resources to authoritative research guides." }
    },
    topicsCovered: [
      "Core operational definitions",
      "Pricing variables and structures",
      "Customer reviews and satisfaction"
    ],
    topicsMissing: [
      "Detailed step-by-step setup walkthroughs",
      "Technical specs comparison sheets",
      "In-depth industry compliance guidelines"
    ],
    contentGaps: [
      "User-centric Q&As exploring specific product constraints or return workflows.",
      "Comprehensive, expert-contributed editorial reviews proving sector knowledge."
    ],
    authorityScore,
    reviewSignals: [
      "Moderate review volume across popular listings engines.",
      "Need to consolidate reviews under schema identifiers."
    ],
    brandMentions: [
      "Limited citations on external industry blogs.",
      "Occasional forum threads discussed on Reddit."
    ],
    industryCitations: [
      "Cited on 2-3 prominent vendor directories.",
      "High relevance score in core business category."
    ],
    newsMentions: [
      "No recent press release indexing tracks."
    ],
    socialSignals: [
      "Active LinkedIn and Twitter channels with matching brand descriptions.",
      "Need to index mentions to associate user affinity."
    ],
    trustSignalsFound: [
      "SSL certificate details matching operational parameters.",
      "Clean privacy policy and terms of service pages."
    ],
    trustSignalsMissing: [
      "Independent editorial awards or certified association badge metadata.",
      "Consistent schema links map on top directories representation."
    ],
    mentionSources: [
      "reddit.com (occasional organic mentions)",
      "trustpilot.com (archived scores references)",
      "clutch.co (directory profile match)"
    ],
    retrievalScore,
    retrievalDetails: {
      semanticHtml: "Excellent. Uses proper h1-h4 nesting structure, although some service pages over-rely on flat divs.",
      structuredData: "Needs integration of customized JSON-LD formats for product lists and article authors.",
      pageHierarchy: "Strong hierarchy. Navigational nodes are easily crawled by LLM scraper user-agents.",
      internalLinking: "Moderate. Contextual anchor text should match target entity concepts more tightly.",
      crawlability: "High. robots.txt file does not block standard LLM scrapers (e.g. GPTBot, ClaudeBot).",
      contentClarity: "Generally simple vocabulary. Great for LLM summaries but lacks specific numerical metrics.",
      informationArchitecture: "Flat layout makes categorization straightforward for generative models."
    },
    retrievalStrengths: [
      "High mobile index readability scores",
      "Open robots.txt policies for educational AI user-agents"
    ],
    retrievalRecommendations: [
      "Convert HTML tables from pure styling classes to semantic tabular headers",
      "Establish a robust context rail containing direct definitions of jargon"
    ],
    technicalScore,
    technicalDetails: {
      implemented: [
        "Breadcrumb Schema",
        "Standard Metadata Title/Description",
        "Semantic Title tag hierarchies"
      ],
      missing: [
        "Organization JSON-LD Schema",
        "FAQ Schema markup",
        "Author profile markup (Person Schema)"
      ],
      errors: [
        "Unclosed span structures on main category list container causing DOM index offsets"
      ],
      warnings: [
        "Lack of open graph image attributes to provide graphical summary embeds",
        "Alternate hreflang attributes are missing explicit regions"
      ]
    },
    competitors: competitorsData,
    advantages: [
      `${normBrand} holds superior base domain age and topical backlinks over ${compList[0] || 'competitors'}.`,
      "Legible and direct content layouts assist real-time extraction engines."
    ],
    disadvantages: [
      `${compList[0] || 'Competitors'} leverage sophisticated entity connections through highly cited Wikidata parameters.`,
      "Competitors implement advanced interactive checklists capturing user intent definitions automatically."
    ],
    missedOpportunities: [
      "Establish specialized reference dictionaries outlining sector terms to gain definitive authority.",
      "Host highly cited whitepapers in public standard file indices (PDF)."
    ],
    roadmap: [
      {
        id: "rm-1",
        title: "Deploy Comprehensive Organization JSON-LD Schema",
        description: "Configure absolute SameAs identifiers linking your homepage to Wikidata, LinkedIn, and corporate profiles to help Google and ChatGPT link you as a distinct entity.",
        priority: "High",
        impact: "High",
        difficulty: "Easy",
        estimatedGain: 9,
        module: "Entity Understanding"
      },
      {
        id: "rm-2",
        title: "Integrate FAQ Schema Markup on Service Pages",
        description: "Publish conversational question-and-answer pairs that match users' natural voice queries and tag them with FAQPage schema identifiers to capture rich snippets in search overlays.",
        priority: "High",
        impact: "Medium",
        difficulty: "Easy",
        estimatedGain: 6,
        module: "Technical AI SEO"
      },
      {
        id: "rm-3",
        title: "Construct Expert Author Profile Pages",
        description: "Design dedicated profile bio pages for content contributors, and link them using Person schemas to associate high authority and proof of professional tenure in LLM scraping passes.",
        priority: "Medium",
        impact: "High",
        difficulty: "Medium",
        estimatedGain: 7,
        module: "Content Understanding"
      },
      {
        id: "rm-4",
        title: "Incorporate Primary Keyword Glossaries",
        description: "Introduce a highly structured semantic glossary on your domain containing simple definitions of your sector's core subjects, helping Perplexity immediately index you as a primary reference source.",
        priority: "Medium",
        impact: "Medium",
        difficulty: "Medium",
        estimatedGain: 5,
        module: "Content Understanding"
      },
      {
        id: "rm-5",
        title: "Consolidate Customer Reviews under Product Schema",
        description: "Directly expose trust ratings into code structures rather than raw text widgets only, ensuring LLMs securely capture customer sentiment parameters.",
        priority: "Low",
        impact: "Medium",
        difficulty: "Hard",
        estimatedGain: 4,
        module: "Authority & Trust"
      }
    ],
    trendData: [
      { month: "Jan", current: overallScore - 4, optimized: overallScore - 2 },
      { month: "Feb", current: overallScore - 3, optimized: overallScore },
      { month: "Mar", current: overallScore - 1, optimized: overallScore + 3 },
      { month: "Apr", current: overallScore, optimized: overallScore + 5 },
      { month: "May", current: overallScore, optimized: overallScore + 8 },
      { month: "Jun", current: overallScore, optimized: overallScore + 11 }
    ],
    opportunityMatrix: [
      { name: "Deploy Org Schema", difficulty: 2, impact: 9, priority: "High" },
      { name: "FAQ Schema", difficulty: 3, impact: 7, priority: "High" },
      { name: "Author Pages", difficulty: 5, impact: 8, priority: "Medium" },
      { name: "Semantic Glossary", difficulty: 4, impact: 6, priority: "Medium" },
      { name: "Review Integration", difficulty: 8, impact: 5, priority: "Low" }
    ]
  };
}

// Full audit backend handler
app.post("/api/audit", async (req, res) => {
  const { domain, brandName, competitors, industry, country } = req.body;

  if (!domain) {
    return res.status(400).json({ error: "Domain URL is required." });
  }

  // Clear competitors input to list
  const competitorsInput = competitors
    ? competitors
        .split(",")
        .map((c: string) => c.trim())
        .filter((c: string) => c.length > 0)
    : [];

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    console.log("No Gemini API key configured. Generating a realistic calculated audit.");
    const report = generateMockReport(domain, brandName, competitorsInput, industry, country);
    return res.json({ report, isMock: true, hasKey: false });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const normBrandName = brandName || domain.replace(/https?:\/\/(www\.)?/, "").split(".")[0];
    const systemInstruction = 
      "You are an elite, highly professional AI Visibility and AI SEO Specialist. " +
      "Your goal is to perform a rigorous analysis of how search systems (ChatGPT, Gemini, Claude, Perplexity, Copilot, Google AI Overviews) " +
      "retrieve, understand, index, and cite a specific website domain and company brand. " +
      "This is NOT a traditional keyword backlinks SEO audit. This is an AI systems and LLM citation suitability audit. " +
      "You must look up records using Search Grounding, explore Wikipedia, Wikidata, schema, structure signals, review mentions, and return a deeply granular audit. " +
      "You MUST formulate your output purely in standard JSON matching the requested structure. " +
      "Do NOT include any markdown blocks (like ```json ... ```) or prefaces outside of the raw JSON string.";

    const promptText = `
Perform a high-precision AI Visibility Audit for:
- Domain URL: ${domain}
- Brand Name: ${normBrandName}
- Industry: ${industry || "Not Specified"}
- Country: ${country || "Global"}
- Competitors: ${competitorsInput.join(", ") || "None specified"}

Use Google Search grounding to lookup real records, Wikipedia references, Schema setups, Wikidata profiles, organic brand mentions, and forum talks. Evaluate:
1. ChatGPT, Gemini, Claude, Perplexity, and Google AI Overviews representation, visibility strength, indices mentions, and explanation factors.
2. Entity recognition signals: Organization, Person schema, IMDb, SameAs links, Wikidata/Wikipedia records, Google Knowledge Graph.
3. Content understanding: How distinct are services, E-E-A-T values, FAQ coverage, author depth, content gaps.
4. Trust and citations: external mentions, news profiles, reviews platforms.
5. AI retrieval readiness: crawlability, robots policies, semantic HTML nesting, page structural levels.
6. Technical schemas implemented, warnings, missing parameters.
7. Competitor analysis comparison (if competitors are provided). Calculate realistic scores.
8. actionable 6-month roadmap recommendations with priority, impact, difficulty, and score points gain.

Generate an extremely detailed, pristine JSON response structure. Here is the TypeScript interface defining the exact output structure you MUST return:

export interface VisibilityPlatform {
  name: string;
  score: number; // 0 to 100
  rating: 'Strong' | 'Moderate' | 'Weak' | 'Not Detected';
  explanation: string;
  reasons: string[]; // At least 3 detailed items
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
  id: string; // e.g., "rm-1"
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedGain: number; // point gain, e.g. 8
  module: string;
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
  scannedAt: string; // current date ISO
  overallScore: number; // weighted scoring: 25% AI Visibility, 20% Entity, 20% Content, 20% Authority, 15% Technical SEO
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  topStrengths: string[]; // 5 strengths
  topWeaknesses: string[]; // 5 weaknesses
  biggestOpportunities: string[]; // at least 3 opportunities
  
  visibilityPlatforms: {
    chatgpt: VisibilityPlatform;
    gemini: VisibilityPlatform;
    claude: VisibilityPlatform;
    perplexity: VisibilityPlatform;
    googleAiOverviews: VisibilityPlatform;
  };
  
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
  
  authorityScore: number;
  reviewSignals: string[];
  brandMentions: string[];
  industryCitations: string[];
  newsMentions: string[];
  socialSignals: string[];
  trustSignalsFound: string[];
  trustSignalsMissing: string[];
  mentionSources: string[];
  
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
  
  technicalScore: number;
  technicalDetails: {
    implemented: string[];
    missing: string[];
    errors: string[];
    warnings: string[];
  };
  
  competitors: CompetitorData[];
  advantages: string[];
  disadvantages: string[];
  missedOpportunities: string[];
  
  roadmap: RoadmapItem[];
  trendData: { month: string; current: number; optimized: number; }[]; // 6 elements representing months (e.g. Jan to June) with current and optimized trajectory
  opportunityMatrix: { name: string; difficulty: number; impact: number; priority: 'High' | 'Medium' | 'Low'; }[]; // difficulty scale 1-10, impact scale 1-10
}

Analyze the website metrics carefully and provide calculated real-world content. Give exact numbers and details instead of generalized templates. Return only the raw JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        // Enable search grounding for real-time citations and entity analysis
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // low temperature for precise factual JSON outputs
      },
    });

    const outputText = response.text || "";
    let cleanJson = outputText.trim();
    
    // Safety check in case the model adds markdown boundaries despite instruction
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.substring(7);
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.substring(3);
    }
    if (cleanJson.endsWith("```")) {
      cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    }
    
    const parsedData = JSON.parse(cleanJson.trim());
    return res.json({ report: parsedData, isMock: false, hasKey: true });
  } catch (err: any) {
    console.error("Gemini live audit failed. Details:", err);
    // Graceful fallback to rich calculated audit
    const report = generateMockReport(domain, brandName, competitorsInput, industry, country);
    return res.json({
      report,
      isMock: true,
      hasKey: true,
      hint: "Live analysis fell back to simulated evaluation due to search constraints or model error.",
      errorDetails: err.message || err
    });
  }
});

async function startServer() {
  // Vite setup for development vs production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Visibility Auditor listening on http://localhost:${PORT}`);
  });
}

startServer();

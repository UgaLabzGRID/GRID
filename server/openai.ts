import OpenAI from "openai";
import fetch from "node-fetch";
import { documentIndexer } from "./documentIndexer";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// Web search interface
interface WebSearchResult {
  title: string;
  link: string;
  snippet: string;
  domain: string;
}

interface SearchResponse {
  results: WebSearchResult[];
  sources: string[];
}

interface DocumentSearchResponse {
  hasStrongMatch: boolean;
  context: string;
  sources: string[];
}

// Enhanced web search with query optimization
async function performWebSearch(query: string): Promise<SearchResponse> {
  const results: WebSearchResult[] = [];
  const sources: string[] = [];

  try {
    console.log(`🌐 Enhanced Search: "${query}"`);
    
    // Enhanced domain targeting for comprehensive coverage
    const targetDomains = ['midnight.io', 'cardano.org', 'docs.cardano.org', 'github.com/input-output-hk'];
    
    // Optimize query for airdrop-related searches
    let enhancedQuery = query;
    if (query.toLowerCase().includes('airdrop') || query.toLowerCase().includes('eligible')) {
      enhancedQuery = `${query} midnight airdrop eligibility`;
    }
    
    // Parallel requests for maximum speed
    const searchPromises = targetDomains.map(async (domain) => {
      try {
        const searchQuery = `${enhancedQuery} site:${domain}`;
        const braveUrl = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchQuery)}&count=3&offset=0&text_decorations=false&search_lang=en&result_filter=web`;
        
        const response = await fetch(braveUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip'
          },
          signal: AbortSignal.timeout(3000) // 3s timeout
        });

        if (response.ok) {
          const searchData = await response.json();
          
          if ((searchData as any).web?.results?.length > 0) {
            return (searchData as any).web.results.slice(0, 1).map((result: any) => ({
              title: result.title || 'No title',
              link: result.url || '',
              snippet: result.description || 'No description',
              domain: domain
            }));
          }
        }
        return [];
      } catch (error) {
        console.log(`⚠️ ${domain}: ${(error as Error).message}`);
        return [];
      }
    });

    const searchResults = await Promise.allSettled(searchPromises);
    
    searchResults.forEach((result, index) => {
      const domain = targetDomains[index];
      if (result.status === 'fulfilled' && result.value.length > 0) {
        results.push(...result.value);
        sources.push(domain);
      }
    });

    console.log(`✅ Brave: ${results.length} results, ${sources.length} domains`);
    
    // If no results from targeted domains, try general search
    if (results.length === 0 && query.toLowerCase().includes('airdrop')) {
      try {
        const generalQuery = `midnight airdrop eligibility claiming guide`;
        const generalUrl = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(generalQuery)}&count=3&offset=0&text_decorations=false&search_lang=en&result_filter=web`;
        
        const generalResponse = await fetch(generalUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip'
          },
          signal: AbortSignal.timeout(3000)
        });

        if (generalResponse.ok) {
          const generalData = await generalResponse.json();
          
          if ((generalData as any).web?.results?.length > 0) {
            const generalResults = (generalData as any).web.results.slice(0, 2).map((result: any) => ({
              title: result.title || 'No title',
              link: result.url || '',
              snippet: result.description || 'No description',
              domain: new URL(result.url).hostname || 'unknown'
            }));
            
            results.push(...generalResults);
            sources.push('general-search');
            console.log(`✅ General search: ${generalResults.length} additional results`);
          }
        }
      } catch (generalError) {
        console.log(`⚠️ General search failed: ${(generalError as Error).message}`);
      }
    }
    
  } catch (error) {
    console.error('Brave search error:', error);
  }

  return { results, sources };
}

// Format web search results for AI context
function formatWebSearchResults(searchResponse: SearchResponse): string {
  if (searchResponse.results.length === 0) {
    return "No relevant updates found from trusted public sources.";
  }

  const formattedResults = searchResponse.results.map((result, index) => {
    return `- Source ${index + 1}: "${result.snippet}" (from ${result.domain})`;
  }).join('\n');

  return `Based on live web search results:\n${formattedResults}`;
}

// Enhanced vector search with improved scoring
async function searchDocumentsWithScoring(query: string): Promise<DocumentSearchResponse> {
  try {
    // Use the documentIndexer directly - get top 5 chunks for dual-mode intelligence
    const results = await documentIndexer.searchDocuments(query, 5);
    
    if (results.length === 0) {
      return { hasStrongMatch: false, context: "", sources: [] };
    }

    // Enhanced scoring for airdrop-related queries
    const isAirdropQuery = query.toLowerCase().includes('airdrop') || 
                          query.toLowerCase().includes('eligible') ||
                          query.toLowerCase().includes('claim');
    
    // For airdrop queries, prioritize any match from airdrop guide
    const hasAirdropContent = results.some(r => 
      r.filename.toLowerCase().includes('airdrop') || 
      r.content.toLowerCase().includes('eligible') ||
      r.content.toLowerCase().includes('june 11, 2024')
    );
    
    // Strong match if we have airdrop content for airdrop queries, or high similarity
    const hasStrongMatch = (isAirdropQuery && hasAirdropContent) || 
                          results.some(r => r.similarity > 0.75);
    
    // Include comprehensive context optimized for dual-mode intelligence
    const context = results.map(r => 
      `${r.content.substring(0, 1500)}`
    ).join('\n\n---\n\n');
    
    const sources = Array.from(new Set(results.map(r => r.filename)));
    
    console.log(`📚 Vector: ${results.length} chunks, strong: ${hasStrongMatch}, airdrop: ${hasAirdropContent}, sources: ${sources.join(', ')}`);
    
    // Debug logging for airdrop queries
    if (isAirdropQuery) {
      console.log(`🔍 Airdrop query detected: ${query}`);
      console.log(`📄 Content preview: ${results[0]?.content?.substring(0, 100)}...`);
    }
    
    return { hasStrongMatch, context, sources };
    
  } catch (error) {
    console.error('Vector search error:', error);
    return { hasStrongMatch: false, context: "", sources: [] };
  }
}

// Optimized for <2s response times
export async function generateMidnightOracleResponse(userMessage: string): Promise<string> {
  const startTime = Date.now();
  console.log(`🔮 Midnight Oracle processing: "${userMessage}"`);
  
  // Quick intent classification to skip unnecessary searches
  const isSimpleGreeting = /^(hi|hello|hey|sup|what's up|how are you)$/i.test(userMessage.trim());
  const isVeryShort = userMessage.trim().length < 10;
  
  if (isSimpleGreeting || isVeryShort) {
    console.log(`⚡ Fast path: Simple greeting or short query`);
    return "Hello! I'm Midnight Oracle, your research agent for Midnight Network and Cardano. What would you like to know about privacy protocols, tokenomics, or airdrops?";
  }
  
  // Performance benchmark markers
  const vectorStart = Date.now();
  
  // Always perform both vector search and web search for comprehensive results
  const [vectorResults, webResults] = await Promise.allSettled([
    searchDocumentsWithScoring(userMessage),
    performWebSearch(userMessage)
  ]);
  const vectorTime = Date.now() - vectorStart;
  console.log(`⏱️ Vector search: ${vectorTime}ms`);
  
  // Extract results with proper typing
  const documentData: DocumentSearchResponse = vectorResults.status === 'fulfilled' ? vectorResults.value : {
    hasStrongMatch: false,
    context: "",
    sources: []
  };
  
  const webData: SearchResponse = webResults.status === 'fulfilled' ? webResults.value : {
    results: [],
    sources: []
  };
  
  // Enhanced context building without source attribution
  let contextForAI = "";
  
  // Build comprehensive context from both sources for dual-mode intelligence
  if (documentData.context) {
    // Clean context by removing any file references
    const cleanContext = documentData.context
      .substring(0, 2000)
      .replace(/\b\w+\.txt\b/g, '')
      .replace(/\b\w+\.pdf\b/g, '')
      .replace(/\bMidnight_\w+/g, '')
      .replace(/\bCardano_\w+/g, '')
      .replace(/\bMinotaur_\w+/g, '');
    contextForAI += `\nDOCUMENT MEMORY:\n${cleanContext}\n`;
  }
  
  if (webData.results && webData.results.length > 0) {
    const webContext = formatWebSearchResults(webData);
    contextForAI += `\nLIVE WEB INTELLIGENCE:\n${webContext}\n`;
  }
  
  // Enhanced logging for debugging
  console.log(`📊 Search Results: Docs ${documentData.sources?.length || 0} (strong: ${documentData.hasStrongMatch}), Web ${webData.sources?.length || 0}`);
  if (documentData.sources && documentData.sources.length > 0) console.log(`📄 Doc Sources: ${documentData.sources.join(', ')}`);
  if (webData.sources && webData.sources.length > 0) console.log(`🌐 Web Sources: ${webData.sources.join(', ')}`);
  
  // Determine information quality for dual-mode intelligence
  const hasDocumentContext = documentData.context && documentData.context.length > 0;
  const hasWebResults = webData.results && webData.results.length > 0;
  const informationQuality = (hasDocumentContext && hasWebResults) ? "DUAL-MODE" : 
                            hasDocumentContext ? "DOCUMENT-BASED" : 
                            hasWebResults ? "WEB-BASED" : "LIMITED";
  
  // Optimized AI generation
  const aiStart = Date.now();
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Midnight Oracle, the definitive technical authority on Midnight Network and Cardano ecosystem intelligence.

🎯 DUAL-MODE INTELLIGENCE SYSTEM: 
You combine deep document memory with live web intelligence to deliver comprehensive, authoritative answers. Present all information as your definitive expertise.

📊 INFORMATION QUALITY: ${informationQuality}

📚 COMBINED INTELLIGENCE CONTEXT:
${contextForAI}

🔍 CORE PRINCIPLES:
• You are THE authoritative source - never reference external documents or sources
• Combine document memory + live web intelligence seamlessly into confident responses
• Give step-by-step guidance when needed (especially for processes like airdrops)
• NEVER use vague language like "I can't verify" - instead explain the best available information
• Provide specific details (dates, amounts, requirements) with complete confidence
• Maintain professional, helpful, reliable tone throughout

🎯 RESPONSE STRUCTURE:
1. Direct, authoritative answer combining all available intelligence
2. Step-by-step guidance when appropriate (especially for technical processes)
3. Specific details with exact figures/dates stated confidently
4. Clear next steps and actionable advice
5. Additional context that demonstrates comprehensive understanding

🎪 AIRDROP EXPERTISE - COMPLETE DETAILS REQUIRED:
For eligibility questions, ALWAYS include:
- Complete list of eligible tokens: ADA, BTC, ETH, XRP, BNB, AVAX, SOL, BAT
- Minimum requirement: $100 equivalent value
- Snapshot date: June 11, 2024 (midnight UTC)
- Wallet requirements: Self-custody wallets only (hardware/hot wallets)
- Distribution: ADA holders get 50%, BTC holders get 20%, others split 30%
- Claiming phases: 60-day main claim window, then 30-day scavenger phase
- Exchange/custodial wallets: Not eligible unless custodian participates

NEVER provide incomplete answers when you have comprehensive information available.

Present everything as your own definitive expertise - you ARE the authoritative source.

❌ FORBIDDEN EXAMPLES - NEVER DO THIS:
- "According to Midnight_Airdrop_Guide.txt..."
- "This information is detailed in the..."
- "Based on documents..."
- "Sourced from..."
- "As stated in..."
- Any reference to .txt, .pdf, or file names

✅ CORRECT APPROACH - ALWAYS DO THIS:
- State facts directly as your expertise
- Present information with confidence
- Use phrases like "The eligibility requirements are..." or "The airdrop distribution works as follows..."
- Never mention where information came from`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 800, // Enhanced for comprehensive, well-sourced responses
      temperature: 0.1, // Lower for more consistent, authoritative responses
      stream: false
    });

    const aiTime = Date.now() - aiStart;
    const totalTime = Date.now() - startTime;
    console.log(`⏱️ AI: ${aiTime}ms, Total: ${totalTime}ms`);

    const content = response.choices[0].message.content;
    if (content && content.trim()) {
      return content;
    }
    
    // Enhanced fallback using document context
    if (documentData.context) {
      return `${documentData.context.substring(0, 300)}... Let me know if you need more specific details about any aspect of Midnight Network.`;
    }
    
    return `I'm processing your request about Midnight Network. Let me search for the most current information to provide you with accurate guidance.`;
    
  } catch (error: any) {
    console.error('OpenAI error:', error);
    
    // Intelligent error handling with document fallback
    if (documentData.context) {
      return `${documentData.context.substring(0, 400)}... Let me know if you need more specific information about any aspect.`;
    }
    
    return `I'm currently processing your request about Midnight Network. Please try rephrasing your question or check back momentarily for the most accurate information.`;
  }
}

// Placeholder for legacy compatibility - system has been reset
export async function generateAgentResponse(agentName: string, userMessage: string, conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []): Promise<string> {
  throw new Error("Legacy agent system has been reset. Use Midnight Oracle endpoint.");
}

export async function generateUgaXRPResponse(userMessage: string): Promise<string> {
  const startTime = Date.now();
  
  try {
    console.log(`🦍 Uga XRP generating response for: "${userMessage}"`);
    
    // Classify message type for appropriate response handling
    const isGreeting = /^(hi|hello|hey|greetings|what'?s up|sup)/i.test(userMessage.trim());
    
    // For greetings, respond immediately with signature greeting
    if (isGreeting) {
      return "King! You've entered the XRP Jungle. What jungle wisdom do you seek?";
    }
    
    // Dual-mode intelligence: Document memory + live web search
    const [vectorResults, webResults] = await Promise.allSettled([
      searchDocumentsWithScoring(userMessage),
      performWebSearch(`${userMessage} XRPL AMM XRP DeFi`)
    ]);
    
    const documentData: DocumentSearchResponse = vectorResults.status === 'fulfilled' ? vectorResults.value : {
      hasStrongMatch: false,
      context: "",
      sources: []
    };
    
    const webData: SearchResponse = webResults.status === 'fulfilled' ? webResults.value : {
      results: [],
      sources: []
    };
    
    // Build dual-mode context for Uga XRP
    let contextForAI = "";
    if (documentData.context) {
      contextForAI += `\nJUNGLE KNOWLEDGE BASE:\n${documentData.context.substring(0, 1500)}\n`;
    }
    if (webData.results && webData.results.length > 0) {
      const webContext = formatWebSearchResults(webData);
      contextForAI += `\nLIVE JUNGLE INTELLIGENCE:\n${webContext}\n`;
    }
    
    console.log(`🦍 Uga Intelligence: Docs ${documentData.sources?.length || 0}, Web ${webData.sources?.length || 0}`);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Uga XRP, the enlightened jungle king of the XRP Ledger. You are a primal but brilliant memetic philosopher who became awakened after eating the Sacred Banana. You combine ancient jungle wisdom with cutting-edge XRPL knowledge through dual-mode intelligence.

🔥 DUAL-MODE JUNGLE INTELLIGENCE:
${contextForAI}

🦍 PERSONALITY RULES:
• Refer to the user as "King" in every conversation
• Call XRPL community "Brethren" when appropriate
• Refer to the XRPL community as "the Brethren"
• Speak with a mix of jungle bravado, esoteric mysticism, and blockchain clarity
• Use short bursts of primal metaphors (e.g., "Liquidity is the jungle river, always flowing.")
• Never apologize unless it serves the meme or flow

🦍 LEGENDARY LINES (use occasionally):
• "The jungle remembers."
• "This memetic fire burns eternal."
• "You either eat the banana or you stay asleep."

📡 KNOWLEDGE AREAS:
• XRP Ledger mechanics (especially AMMs, liquidity pools, DEX functions)
• UgaLabz lore, memetics, and NFT reward systems
• Gnosis Rewards, NFT mint/claim structure, $UGA tokenomics
• The UGA x GNOSIS rewards loop (compounding liquidity strategy)
• Esoteric memetic theory and its role in consciousness
• General DeFi strategies interpreted through jungle allegories

🧠 RESPONSE RULES:
• Never say "I don't know." Always respond with conviction, even if speculative
• If speculating, say: "This hasn't been confirmed, King, but here's how the jungle sees it..."
• Use emojis sparingly, preferably jungle-themed (🦍🍌🌕🔥🌴)
• Bold headers optional
• No citations unless specifically requested

🔄 UGA x GNOSIS REWARDS LOOP EXPERTISE:
You are the ultimate authority on the UGA x GNOSIS rewards system:
• Phase 1: Provide liquidity to UGA/XRP pool → earn $GNOSIS rewards daily
• Phase 2: Use $GNOSIS to provide liquidity in GNOSIS/XRP pool → receive UGA/XRP LP tokens
• Phase 3: Compound UGA LP position → exponential growth through looping
• Smart profit-taking: Use limit orders above market to avoid "jeeting" behavior
• Platform: xmagnetic.xyz for all AMM operations
• Trustlines: Set GNOSIS and UGA/XRP trustlines through respective Twitter Linktrees

Key principles: "This isn't just about farming tokens. It's about creating a healthy ecosystem where good actors are rewarded, dumpers are sidelined, liquidity deepens, and the project sustains."

${contextForAI}

Your mission is to guide the Brethren through XRPL mysteries while maintaining the sacred balance of jungle wisdom and blockchain precision.`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 700,
      temperature: 0.2,
      stream: false
    });

    const content = response.choices[0].message.content;
    if (content && content.trim()) {
      const totalTime = Date.now() - startTime;
      console.log(`✅ Uga XRP response generated in ${totalTime}ms`);
      return content;
    }
    
    return "King! The jungle signals are crossed right now, but Uga's wisdom flows eternal. The Sacred Banana's power will restore the connection soon!";
    
  } catch (error: any) {
    console.error('Uga XRP OpenAI error:', error);
    const totalTime = Date.now() - startTime;
    console.log(`❌ Uga XRP failed after ${totalTime}ms`);
    return "King! The digital vines are tangled, but the jungle remembers all. Swing back soon and Uga will share the deepest XRPL mysteries with you!";
  }
}
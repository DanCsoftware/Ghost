// src/lib/gemini.ts

export interface GeminiAnalysis {
  whyGhosted: string;
  recommendations: string[];
  topCompanies: string[];
}

export async function analyzeApplications(
  applications: any[]
): Promise<GeminiAnalysis> {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  console.log('🔍 Analyzing applications:', applications.length);
  console.log('🔑 API Key exists:', !!GEMINI_API_KEY);

  if (!GEMINI_API_KEY) {
    console.warn('⚠️ No Gemini API key found, using demo data');
    return getDemoAnalysis();
  }

  // Extract actual company names
  const companies = applications.map(app => app.company);
  const uniqueCompanies = [...new Set(companies)];
  
  // Count applications per company
  const companyCounts = companies.reduce((acc, company) => {
    acc[company] = (acc[company] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort by count
  const topCompanies = Object.entries(companyCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([company]) => company);

  try {
    const prompt = `You are a career advisor analyzing job application data. 

Here are the job applications:
${applications.map(app => `- ${app.company} (${app.position}) - Applied: ${new Date(app.appliedDate).toLocaleDateString()}, Status: ${app.status}`).join('\n')}

Total applications: ${applications.length}
Companies applied to: ${uniqueCompanies.join(', ')}

Based on this data:
1. Why might they be getting ghosted? Give ONE specific, actionable insight (max 15 words)
2. Give 3 specific, actionable recommendations to improve their response rate
3. List the top 4 companies they applied to most (from this list: ${topCompanies.join(', ')})

Respond ONLY with valid JSON in this exact format:
{
  "whyGhosted": "brief insight here",
  "recommendations": ["action 1", "action 2", "action 3"],
  "topCompanies": ["company1", "company2", "company3", "company4"]
}`;

    console.log('📤 Calling Gemini API...');

   const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('📥 Gemini response:', data);
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.error('❌ No text in Gemini response');
      throw new Error('No response text');
    }
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/) || text.match(/```json\n?([\s\S]*?)\n?```/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
    
    console.log('📄 Extracted JSON:', jsonStr);
    
    const parsed = JSON.parse(jsonStr);
    console.log('✅ Parsed analysis:', parsed);
    
    return {
      whyGhosted: parsed.whyGhosted,
      recommendations: parsed.recommendations || [],
      topCompanies: parsed.topCompanies || topCompanies, // Fallback to our calculated ones
    };
  } catch (error) {
    console.error('❌ Gemini analysis error:', error);
    // Return analysis based on actual data
    return {
      whyGhosted: applications.length < 5 
        ? "Too few applications to analyze patterns effectively"
        : "Need more data to provide accurate insights",
      recommendations: [
        "Apply to more positions (aim for 50+ per month)",
        "Tailor your resume for each application",
        "Follow up 1 week after applying"
      ],
      topCompanies,
    };
  }
}

function getDemoAnalysis(): GeminiAnalysis {
  return {
    whyGhosted: "You apply for Senior roles but your resume shows 2 YOE",
    recommendations: [
      "Focus on System Design fundamentals",
      "Get AWS Solutions Architect certification",
      "Target Mid-level (3-5 YOE) roles instead",
    ],
    topCompanies: ["Mail", "Sony", "Fox", "Discord"],
  };
}
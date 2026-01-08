import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  subject?: string;
  from?: string;
  date?: string;
}

interface ScanResult {
  totalApplications: number;
  callbackRate: number;
  ghosted: number;
  breakdown: Array<{ label: string; count: number; color: string }>;
  topCompanies: Array<{ name: string; logo: string }>;
  topGap: string;
  gapDetails: string[];
  topFix: string;
  fixDetails: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      throw new Error('Access token required');
    }

    console.log('Starting Gmail scan...');

    // Search for job application related emails from last 90 days
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
    const afterDate = threeMonthsAgo.toISOString().split('T')[0].replace(/-/g, '/');

    // Search query for job-related emails
    const searchQuery = encodeURIComponent(
      `after:${afterDate} (subject:(application OR applied OR resume OR position OR role OR interview OR candidate OR opportunity OR job) OR from:(careers@ OR jobs@ OR recruiting@ OR talent@ OR hr@ OR hiring@))`
    );

    // Fetch messages list
    console.log('Fetching message list...');
    const listResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${searchQuery}&maxResults=100`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error('Gmail API error:', errorText);
      throw new Error('Failed to fetch emails from Gmail');
    }

    const listData = await listResponse.json();
    const messages = listData.messages || [];
    
    console.log(`Found ${messages.length} potential job-related emails`);

    // Fetch details for each message
    const emailDetails: EmailMessage[] = [];
    const companyCount: Record<string, number> = {};
    
    let callbacks = 0;
    let interviewing = 0;
    let rejected = 0;
    let ghosted = 0;

    // Process messages in batches of 10
    for (let i = 0; i < Math.min(messages.length, 50); i++) {
      const msgId = messages[i].id;
      
      const msgResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgId}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!msgResponse.ok) continue;

      const msgData = await msgResponse.json();
      const headers = msgData.payload?.headers || [];
      
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
      const from = headers.find((h: any) => h.name === 'From')?.value || '';
      const date = headers.find((h: any) => h.name === 'Date')?.value || '';
      const snippet = msgData.snippet || '';

      // Extract company name from sender
      const companyMatch = from.match(/@([a-zA-Z0-9-]+)\./);
      if (companyMatch) {
        const company = companyMatch[1].toLowerCase();
        // Skip common email providers
        if (!['gmail', 'yahoo', 'hotmail', 'outlook', 'icloud', 'protonmail'].includes(company)) {
          companyCount[company] = (companyCount[company] || 0) + 1;
        }
      }

      // Categorize email based on content
      const lowerSubject = subject.toLowerCase();
      const lowerSnippet = snippet.toLowerCase();
      const content = lowerSubject + ' ' + lowerSnippet;

      if (content.includes('interview') || content.includes('schedule') || content.includes('next step') || content.includes('meet')) {
        if (content.includes('reject') || content.includes('unfortunately') || content.includes('not moving forward')) {
          rejected++;
        } else {
          interviewing++;
        }
      } else if (content.includes('thank you for applying') || content.includes('received your application') || content.includes('application received')) {
        callbacks++;
      } else if (content.includes('unfortunately') || content.includes('regret') || content.includes('not selected') || content.includes('decided to move forward with')) {
        rejected++;
      }

      emailDetails.push({ id: msgId, threadId: msgData.threadId, snippet, subject, from, date });
    }

    const totalApplications = emailDetails.length;
    ghosted = Math.max(0, totalApplications - callbacks - interviewing - rejected);

    // Get top companies
    const sortedCompanies = Object.entries(companyCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topCompanies = sortedCompanies.map(([name]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      logo: `https://logo.clearbit.com/${name}.com`,
    }));

    // Calculate callback rate
    const callbackRate = totalApplications > 0 
      ? Math.round((callbacks / totalApplications) * 1000) / 10 
      : 0;

    // Generate insights based on patterns
    let topGap = "No clear patterns detected yet";
    let gapDetails: string[] = [];
    let topFix = "Keep applying and tracking your progress";
    let fixDetails: string[] = [];

    if (ghosted > totalApplications * 0.5) {
      topGap = "High ghost rate suggests application-role mismatch";
      gapDetails = [
        "Many applications aren't getting responses",
        "Consider tailoring applications more specifically",
        "Resume may not be passing ATS filters",
      ];
      topFix = "Focus on quality over quantity";
      fixDetails = [
        "Customize resume keywords for each role",
        "Apply to roles matching your exact experience level",
        "Follow up on applications after 1 week",
        "Network directly with hiring managers on LinkedIn",
      ];
    } else if (rejected > callbacks) {
      topGap = "Getting responses but not advancing to interviews";
      gapDetails = [
        "Your applications are being seen",
        "May need to strengthen interview skills",
        "Consider experience or skill gaps for target roles",
      ];
      topFix = "Focus on interview preparation";
      fixDetails = [
        "Practice common interview questions",
        "Research companies before applying",
        "Prepare specific examples using STAR method",
        "Consider mock interviews for practice",
      ];
    } else if (interviewing > 0) {
      topGap = "Good traction - keep the momentum going";
      gapDetails = [
        "Your approach is working",
        "Continue with current strategy",
        "Track what's working for successful applications",
      ];
      topFix = "Optimize your winning formula";
      fixDetails = [
        "Document what made successful applications stand out",
        "Apply similar approach to more roles",
        "Prepare thoroughly for upcoming interviews",
        "Negotiate confidently when offers come",
      ];
    }

    const result: ScanResult = {
      totalApplications,
      callbackRate,
      ghosted,
      breakdown: [
        { label: "Callbacks", count: callbacks, color: "bg-ghost-success" },
        { label: "Interviewing", count: interviewing, color: "bg-ghost-warning" },
        { label: "Rejected", count: rejected, color: "bg-ghost-danger" },
        { label: "Ghosted", count: ghosted, color: "bg-ghost-accent" },
      ],
      topCompanies: topCompanies.length > 0 ? topCompanies : [
        { name: "No companies", logo: "" }
      ],
      topGap,
      gapDetails,
      topFix,
      fixDetails,
    };

    console.log('Scan complete:', { totalApplications, callbacks, interviewing, rejected, ghosted });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in scan-gmail:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Rate limiting storage (in-memory, resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 3; // Max requests per window
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeploymentRequest {
  apiId: string;
  apiHash: string;
  stringSession: string;
  botToken: string;
  ownerId: string;
  plan: "1month" | "2months";
  timestamp: number;
  honeypot?: string;
}

function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('cf-connecting-ip') || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }
  
  record.count++;
  return false;
}

function validateTimestamp(timestamp: number): boolean {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  // Request must be within 5 minutes of server time
  return Math.abs(now - timestamp) < fiveMinutes;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const clientIP = getClientIP(req);
    
    // Check rate limit
    if (isRateLimited(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      // Don't log sensitive config details
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: DeploymentRequest = await req.json();

    // Honeypot check - if filled, it's a bot
    if (data.honeypot) {
      // Silently accept but don't process (deceive bots)
      return new Response(
        JSON.stringify({ success: true, message: 'Deployment request submitted successfully' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Timestamp validation
    if (!data.timestamp || !validateTimestamp(data.timestamp)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request. Please refresh and try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields (without logging sensitive data)
    if (!data.apiId || !data.apiHash || !data.stringSession || !data.botToken || !data.ownerId || !data.plan) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Basic format validation
    if (!/^\d+$/.test(data.apiId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid API ID format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (data.apiHash.length !== 32) {
      return new Response(
        JSON.stringify({ error: 'Invalid API Hash format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!/^\d+:[A-Za-z0-9_-]+$/.test(data.botToken)) {
      return new Response(
        JSON.stringify({ error: 'Invalid Bot Token format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!/^\d+$/.test(data.ownerId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid Owner ID format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const planDetails = {
      "1month": { name: "Starter (1 Month)", price: "₹400" },
      "2months": { name: "Pro (2 Months)", price: "₹600" },
    };

    const plan = planDetails[data.plan];
    if (!plan) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan selected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const timestamp = new Date().toISOString();

    // Format message for Telegram - NEVER log these credentials
    const message = `🚀 <b>New Bot Deployment Request</b>

📋 <b>Plan:</b> ${plan.name} - ${plan.price}

🔑 <b>API ID:</b> <code>${data.apiId}</code>
🔐 <b>API Hash:</b> <code>${data.apiHash}</code>
📝 <b>String Session:</b> <code>${data.stringSession}</code>
🤖 <b>Bot Token:</b> <code>${data.botToken}</code>
👤 <b>Owner ID:</b> <code>${data.ownerId}</code>

⏰ <b>Submitted:</b> ${timestamp}
🌐 <b>IP:</b> ${clientIP}

━━━━━━━━━━━━━━━━━
<i>From Uppermoon Devs Website</i>`;

    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      // Don't log the full error which might contain sensitive info
      return new Response(
        JSON.stringify({ error: 'Failed to process request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log only non-sensitive metadata
    console.log(`Deployment request processed for plan: ${data.plan}, IP: ${clientIP}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Deployment request submitted successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Don't log error details that might contain user data
    console.error('Error processing request');
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

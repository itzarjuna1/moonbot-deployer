import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LogRequest {
  type: 'error' | 'pageview' | 'startup' | 'info';
  message: string;
  details?: string;
  url?: string;
  userAgent?: string;
  timestamp?: number;
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
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: LogRequest = await req.json();

    // Validate required fields
    if (!data.type || !data.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get emoji and label based on log type
    const typeConfig: Record<string, { emoji: string; label: string }> = {
      error: { emoji: '🚨', label: 'ERROR' },
      pageview: { emoji: '👁', label: 'PAGE VIEW' },
      startup: { emoji: '🟢', label: 'WEBSITE ONLINE' },
      info: { emoji: 'ℹ️', label: 'INFO' },
    };

    const config = typeConfig[data.type] || typeConfig.info;
    const timestamp = new Date().toISOString();

    // Format message for Telegram using blockquote expandable
    let message = `${config.emoji} <b>${config.label}</b>\n\n`;
    
    message += `<blockquote expandable>\n`;
    message += `📝 <b>Message:</b> ${escapeHtml(data.message)}\n`;
    
    if (data.url) {
      // Remove preview URL, just show path
      const urlPath = data.url.replace(/https?:\/\/[^\/]+/, '');
      message += `🔗 <b>Path:</b> ${escapeHtml(urlPath || '/')}\n`;
    }
    
    if (data.details) {
      const truncatedDetails = data.details.length > 400 
        ? data.details.substring(0, 400) + '...' 
        : data.details;
      message += `📋 <b>Details:</b>\n<code>${escapeHtml(truncatedDetails)}</code>\n`;
    }
    
    if (data.userAgent) {
      const browser = parseUserAgent(data.userAgent);
      message += `🌐 <b>Browser:</b> ${escapeHtml(browser)}\n`;
    }
    
    message += `⏰ <b>Time:</b> ${timestamp}\n`;
    message += `</blockquote>\n\n`;
    message += `<i>Uppermoon Devs Monitor</i>`;

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
          disable_notification: data.type === 'pageview', // Silent for page views
        }),
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      console.error('Telegram API error');
      return new Response(
        JSON.stringify({ error: 'Failed to send log' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing log request');
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseUserAgent(ua: string): string {
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  return 'Unknown Browser';
}

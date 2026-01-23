import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data: DeploymentRequest = await req.json();

    // Validate required fields
    if (!data.apiId || !data.apiHash || !data.stringSession || !data.botToken || !data.ownerId || !data.plan) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const planDetails = {
      "1month": { name: "Starter (1 Month)", price: "₹400" },
      "2months": { name: "Pro (2 Months)", price: "₹600" },
    };

    const plan = planDetails[data.plan];
    const timestamp = new Date().toISOString();

    // Format message for Telegram
    const message = `🚀 <b>New Bot Deployment Request</b>

📋 <b>Plan:</b> ${plan.name} - ${plan.price}

🔑 <b>API ID:</b> <code>${data.apiId}</code>
🔐 <b>API Hash:</b> <code>${data.apiHash}</code>
📝 <b>String Session:</b> <code>${data.stringSession}</code>
🤖 <b>Bot Token:</b> <code>${data.botToken}</code>
👤 <b>Owner ID:</b> <code>${data.ownerId}</code>

⏰ <b>Submitted:</b> ${timestamp}

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
      console.error('Telegram API error:', telegramResult);
      return new Response(
        JSON.stringify({ error: 'Failed to send to Telegram' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Deployment request sent successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Deployment request submitted successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

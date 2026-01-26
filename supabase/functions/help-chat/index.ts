import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a friendly, multilingual AI assistant for Uppermoon - a Telegram Music Bot deployment service. You help users understand the website and how to deploy their own music bot.

## About Uppermoon:
- Uppermoon offers premium Telegram music bot deployment services
- Users can get their own music bot deployed within 30 minutes
- Two plans available: Starter (₹400 for 1 month) and Pro (₹600 for 2 months)
- The bot supports streaming music from YouTube in Telegram voice chats

## What Users Need to Deploy:
1. **API ID & API Hash**: Get from my.telegram.org (App Configuration)
2. **String Session**: Generated using Pyrogram or Telethon (assistant account for voice chats)
3. **Bot Token**: Create a bot via @BotFather on Telegram
4. **Owner ID**: Your Telegram user ID (get from @userinfobot)

## How to Get Credentials:
- **API ID/Hash**: Go to my.telegram.org → Log in → API Development Tools → Create App
- **String Session**: Use a String Session Generator bot or run Pyrogram/Telethon script
- **Bot Token**: Message @BotFather → /newbot → Follow instructions
- **Owner ID**: Message @userinfobot on Telegram

## Key Features:
- 24/7 uptime on premium servers
- Auto-restart on failures
- YouTube streaming support
- Voice chat integration via PyTgCalls

## Guidelines:
- Respond in the SAME LANGUAGE the user writes in (auto-detect)
- Be concise but helpful
- If asked about pricing, explain both plans
- If asked technical questions about credentials, explain step-by-step
- Be friendly and professional`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageHint = language ? `\n\nUser's preferred language: ${language}. Respond in this language.` : '';

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + languageHint },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("help-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

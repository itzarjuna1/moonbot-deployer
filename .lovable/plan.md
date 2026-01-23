
# Uppermoon Devs - Telegram Bot Deployer Website

## Overview
A visually stunning website where users can submit their Telegram bot credentials for deployment. The website will feature a decorative design with blurred Telegram-themed backgrounds, a credential submission form, pricing display, and integration with your main Telegram bot.

## Design Concept
- Dark theme with purple/blue gradient accents (matching Telegram's brand colors)
- Blurred Telegram logo/pattern as background
- Glassmorphism UI elements for a modern look
- Animated elements for visual appeal
- Mobile-responsive design

## Features

### 1. Landing Page
- Hero section with "Uppermoon Devs" branding
- Tagline about bot deployment services
- Call-to-action button to deploy a bot
- Decorative blurred Telegram background

### 2. Pricing Section
- Clear pricing cards:
  - 1 Month: Rs. 400
  - 2 Months: Rs. 600
- Manual payment notice (UPI/bank transfer details can be shown)

### 3. Bot Deployment Form
Users will enter:
- API ID (from my.telegram.org)
- API Hash (from my.telegram.org)
- String Session
- Bot Token (from @BotFather)
- Owner ID (Telegram user ID)
- Selected plan (1 month or 2 months)

### 4. Submission Flow
1. User fills the form and selects a plan
2. On submit, credentials are sent to your main Telegram bot via API
3. User is shown a success page with:
   - Link to your support group (https://t.me/snowy_hometown)
   - Message to wait 30 minutes for deployment
   - Instructions to complete payment

### 5. Telegram Bot Integration
An Edge Function API endpoint that:
- Receives form submissions
- Sends credentials to your main Telegram bot
- Allows your bot to fetch pending deployment requests

---

## Technical Implementation

### Pages to Create
1. **Index.tsx** - Main landing page with hero, pricing, and deployment form
2. **Success.tsx** - Confirmation page after submission

### Components to Create
1. **HeroSection** - Animated hero with branding
2. **PricingCards** - Display pricing options
3. **DeploymentForm** - Form for collecting credentials
4. **TelegramBackground** - Blurred decorative background

### Backend (Edge Function)
- **send-to-telegram** - Edge function that:
  - Accepts deployment requests from the website
  - Sends a formatted message to your main bot
  - Provides an endpoint for your bot to fetch submissions

### Integration with Your Main Bot
Your bot will receive messages in this format:
```
🚀 New Bot Deployment Request

📋 Plan: 1 Month (₹400)
🔑 API ID: [user's api id]
🔐 API Hash: [user's api hash]
📝 String Session: [session string]
🤖 Bot Token: [bot token]
👤 Owner ID: [owner telegram id]

⏰ Submitted: [timestamp]
```

---

## What I'll Need From You

1. **Your Main Bot Token** - To send deployment requests to your bot
2. **Your Telegram Chat ID** - Where deployment requests should be sent (your personal chat or a private channel)
3. **Payment Details** (optional) - UPI ID or bank details to display for manual payments

---

## User Journey

```text
+-------------------+     +------------------+     +-------------------+
|                   |     |                  |     |                   |
|   Landing Page    | --> |  Fill Form &     | --> |   Success Page    |
|   (Hero + Pricing)|     |  Select Plan     |     |   + Support Link  |
|                   |     |                  |     |                   |
+-------------------+     +------------------+     +-------------------+
                                  |
                                  v
                          +------------------+
                          |                  |
                          |  Edge Function   |
                          |  Sends to Your   |
                          |  Telegram Bot    |
                          |                  |
                          +------------------+
```

---

## Security Considerations
- Form validation to ensure all fields are properly filled
- Rate limiting on the Edge Function to prevent spam
- Credentials sent directly to Telegram (not stored on website)
- HTTPS encryption for all data transmission

---

## Deliverables
1. Beautiful, responsive landing page with Telegram-themed design
2. Interactive pricing cards
3. Secure credential submission form
4. Success page with support group link
5. Edge Function for Telegram bot integration
6. Mobile-friendly design throughout

Once you approve this plan and provide the bot token and chat ID, I'll implement everything step by step.

"""
Telegram Client Initialization
"""
import asyncio
from pyrogram import Client
from pytgcalls import PyTgCalls
from loguru import logger
import config


class MusicBot:
    """Main Music Bot Client"""
    
    def __init__(self):
        # Main Bot Client
        self.bot = Client(
            name="uppermoon_bot",
            api_id=config.API_ID,
            api_hash=config.API_HASH,
            bot_token=config.BOT_TOKEN,
            plugins=dict(root="bot/plugins"),
            workdir="./sessions"
        )
        
        # Assistant Client (Userbot for Voice Chat)
        self.assistant = Client(
            name="uppermoon_assistant",
            api_id=config.ASSISTANT_API_ID,
            api_hash=config.ASSISTANT_API_HASH,
            session_string=config.ASSISTANT_STRING_SESSION,
            workdir="./sessions"
        )
        
        # PyTgCalls Instance
        self.pytgcalls = PyTgCalls(self.assistant)
        
        # Queue Management
        self.queue: dict[int, list] = {}
        self.active_chats: set[int] = set()
        self.loop_mode: dict[int, bool] = {}
        
    async def start(self):
        """Start all clients"""
        logger.info("Starting Uppermoon Music Bot...")
        
        # Start bot
        await self.bot.start()
        bot_info = await self.bot.get_me()
        logger.success(f"Bot started: @{bot_info.username}")
        
        # Start assistant
        await self.assistant.start()
        assistant_info = await self.assistant.get_me()
        logger.success(f"Assistant started: @{assistant_info.username or assistant_info.first_name}")
        
        # Start PyTgCalls
        await self.pytgcalls.start()
        logger.success("PyTgCalls started successfully")
        
        # Send startup notification
        await self.send_startup_notification()
        
        logger.info("🎵 Uppermoon Music Bot is now online!")
        
    async def stop(self):
        """Stop all clients"""
        logger.info("Stopping Uppermoon Music Bot...")
        await self.pytgcalls.stop()
        await self.assistant.stop()
        await self.bot.stop()
        logger.info("Bot stopped successfully")
        
    async def send_startup_notification(self):
        """Send startup notification to configured chat"""
        if config.NOTIFY_CHAT_ID:
            try:
                # Website online message
                await self.bot.send_message(
                    chat_id=config.NOTIFY_CHAT_ID,
                    text=(
                        "🟢 <b>WEBSITE ONLINE</b>\n\n"
                        "📡 The Uppermoon Devs website is now live and accepting deployment requests!\n\n"
                        f"🔗 <b>Website:</b> {config.WEBSITE_URL or 'Not configured'}\n"
                        "━━━━━━━━━━━━━━━━━\n"
                        "<i>Uppermoon Devs System</i>"
                    ),
                    parse_mode="HTML"
                )
                
                # Music feature announcement
                await self.bot.send_message(
                    chat_id=config.NOTIFY_CHAT_ID,
                    text=(
                        "🎵 <b>NEW FEATURE: MUSIC STREAMING</b>\n\n"
                        "🎧 This bot can now stream music on Telegram Voice Chats!\n\n"
                        "<b>Features:</b>\n"
                        "• 🔍 Search & play from YouTube\n"
                        "• 📋 Queue management\n"
                        "• ⏯️ Play, pause, skip controls\n"
                        "• 🔁 Loop mode\n"
                        "• 🎚️ Volume control\n"
                        "• 📺 Video streaming support\n\n"
                        "<b>Commands:</b>\n"
                        "<code>/play [song name]</code> - Play a song\n"
                        "<code>/pause</code> - Pause playback\n"
                        "<code>/resume</code> - Resume playback\n"
                        "<code>/skip</code> - Skip current song\n"
                        "<code>/stop</code> - Stop & leave VC\n\n"
                        "━━━━━━━━━━━━━━━━━\n"
                        "<i>Uppermoon Music v1.0</i>"
                    ),
                    parse_mode="HTML"
                )
                logger.info("Startup notifications sent successfully")
            except Exception as e:
                logger.error(f"Failed to send startup notification: {e}")


# Global instance
music_bot = MusicBot()

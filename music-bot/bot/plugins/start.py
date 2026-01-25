"""
Start and Help Commands
"""
from pyrogram import Client, filters
from pyrogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton

import config
from bot.client import music_bot


@music_bot.bot.on_message(filters.command(["start"]))
async def start_command(client: Client, message: Message):
    """Handle /start command"""
    user = message.from_user
    
    await message.reply_text(
        f"🎵 <b>Welcome to {config.BOT_NAME}!</b>\n\n"
        f"Hey {user.mention}! I'm a powerful music streaming bot for Telegram.\n\n"
        f"<b>What I can do:</b>\n"
        f"• 🎧 Stream music in voice chats\n"
        f"• 📺 Stream videos in voice chats\n"
        f"• 🔍 Search from YouTube\n"
        f"• 📋 Manage queue\n"
        f"• 🔁 Loop mode\n"
        f"• 🔊 Volume control\n\n"
        f"<b>Add me to your group and start playing!</b>",
        parse_mode="HTML",
        reply_markup=InlineKeyboardMarkup([
            [
                InlineKeyboardButton(
                    "➕ Add to Group",
                    url=f"https://t.me/{config.BOT_USERNAME}?startgroup=true"
                )
            ],
            [
                InlineKeyboardButton("📚 Help", callback_data="help"),
                InlineKeyboardButton("💬 Support", url=config.SUPPORT_GROUP),
            ],
            [
                InlineKeyboardButton("🌐 Website", url=config.WEBSITE_URL or "https://example.com")
            ]
        ])
    )


@music_bot.bot.on_message(filters.command(["help"]))
async def help_command(client: Client, message: Message):
    """Handle /help command"""
    await message.reply_text(
        "📚 <b>Command Help</b>\n\n"
        "<b>🎵 Playback:</b>\n"
        "<code>/play [song]</code> - Play a song\n"
        "<code>/vplay [video]</code> - Play video\n"
        "<code>/pause</code> - Pause playback\n"
        "<code>/resume</code> - Resume playback\n"
        "<code>/stop</code> - Stop & leave VC\n\n"
        "<b>📋 Queue:</b>\n"
        "<code>/skip</code> - Skip current song\n"
        "<code>/queue</code> - Show queue\n"
        "<code>/loop</code> - Toggle loop mode\n\n"
        "<b>🔊 Audio:</b>\n"
        "<code>/volume [1-200]</code> - Set volume\n\n"
        "<b>📥 Download:</b>\n"
        "<code>/song [name]</code> - Download audio\n"
        "<code>/video [name]</code> - Download video\n\n"
        "<b>ℹ️ Info:</b>\n"
        "<code>/ping</code> - Check bot latency\n"
        "<code>/stats</code> - Bot statistics",
        parse_mode="HTML",
        reply_markup=InlineKeyboardMarkup([
            [InlineKeyboardButton("💬 Support Group", url=config.SUPPORT_GROUP)]
        ])
    )


@music_bot.bot.on_callback_query(filters.regex("^help$"))
async def help_callback(client: Client, callback):
    """Handle help button callback"""
    await callback.message.edit_text(
        "📚 <b>Command Help</b>\n\n"
        "<b>🎵 Playback:</b>\n"
        "<code>/play [song]</code> - Play a song\n"
        "<code>/vplay [video]</code> - Play video\n"
        "<code>/pause</code> - Pause playback\n"
        "<code>/resume</code> - Resume playback\n"
        "<code>/stop</code> - Stop & leave VC\n\n"
        "<b>📋 Queue:</b>\n"
        "<code>/skip</code> - Skip current song\n"
        "<code>/queue</code> - Show queue\n"
        "<code>/loop</code> - Toggle loop mode\n\n"
        "<b>🔊 Audio:</b>\n"
        "<code>/volume [1-200]</code> - Set volume\n\n"
        "Use /help in chat for full command list.",
        parse_mode="HTML",
        reply_markup=InlineKeyboardMarkup([
            [InlineKeyboardButton("🔙 Back", callback_data="back_start")]
        ])
    )


@music_bot.bot.on_message(filters.command(["ping"]))
async def ping_command(client: Client, message: Message):
    """Check bot latency"""
    import time
    start = time.time()
    msg = await message.reply_text("🏓 Pinging...")
    end = time.time()
    
    await msg.edit_text(
        f"🏓 <b>Pong!</b>\n\n"
        f"📶 <b>Latency:</b> <code>{(end - start) * 1000:.2f}ms</code>\n"
        f"🤖 <b>Bot:</b> Online\n"
        f"🎵 <b>PyTgCalls:</b> Active",
        parse_mode="HTML"
    )


@music_bot.bot.on_message(filters.command(["stats"]))
async def stats_command(client: Client, message: Message):
    """Show bot statistics"""
    active_vcs = len(music_bot.active_chats)
    
    await message.reply_text(
        f"📊 <b>Bot Statistics</b>\n\n"
        f"🎙️ <b>Active Voice Chats:</b> {active_vcs}\n"
        f"🔁 <b>Loop Mode Enabled:</b> {len([c for c in music_bot.loop_mode.values() if c])}\n"
        f"📋 <b>Total Queued Songs:</b> {sum(len(q) for q in music_bot.queue.values())}\n\n"
        f"<i>Powered by Uppermoon Devs</i>",
        parse_mode="HTML"
    )

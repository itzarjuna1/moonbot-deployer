"""
Download Commands - Download songs and videos
"""
import os
from pyrogram import Client, filters
from pyrogram.types import Message
from loguru import logger

import config
from bot.client import music_bot
from bot.utils.youtube import YouTubeDownloader


yt = YouTubeDownloader()


@music_bot.bot.on_message(filters.command(["song", "audio"]))
async def song_download(client: Client, message: Message):
    """Download audio file"""
    if len(message.command) < 2:
        return await message.reply_text(
            "🎵 <b>Usage:</b> <code>/song [song name]</code>",
            parse_mode="HTML"
        )
    
    query = " ".join(message.command[1:])
    
    status_msg = await message.reply_text(
        f"🔍 <b>Searching:</b> {query}",
        parse_mode="HTML"
    )
    
    try:
        # Search and download
        await status_msg.edit_text("⬇️ <b>Downloading...</b>", parse_mode="HTML")
        
        result = await yt.search_and_download(query, video=False)
        
        if not result:
            return await status_msg.edit_text(
                "❌ <b>No results found!</b>",
                parse_mode="HTML"
            )
        
        file_path = result["file_path"]
        title = result["title"]
        duration = result["duration"]
        thumbnail = result.get("thumbnail")
        
        # Check file size (Telegram limit is 2GB)
        file_size = os.path.getsize(file_path)
        if file_size > 2 * 1024 * 1024 * 1024:  # 2GB
            os.remove(file_path)
            return await status_msg.edit_text(
                "❌ <b>File too large!</b> (Max: 2GB)",
                parse_mode="HTML"
            )
        
        await status_msg.edit_text("📤 <b>Uploading...</b>", parse_mode="HTML")
        
        # Upload audio
        await message.reply_audio(
            audio=file_path,
            title=title,
            duration=duration,
            thumb=thumbnail if thumbnail and os.path.exists(thumbnail) else None,
            caption=f"🎵 <b>{title}</b>\n\n<i>Downloaded via @{config.BOT_USERNAME}</i>",
            parse_mode="HTML"
        )
        
        await status_msg.delete()
        
        # Cleanup
        os.remove(file_path) if os.path.exists(file_path) else None
        os.remove(thumbnail) if thumbnail and os.path.exists(thumbnail) else None
        
        logger.info(f"Downloaded song: {title}")
        
    except Exception as e:
        logger.error(f"Song download error: {e}")
        await status_msg.edit_text(
            f"❌ <b>Download failed!</b>\n\n<code>{e}</code>",
            parse_mode="HTML"
        )


@music_bot.bot.on_message(filters.command(["vsong", "videodl"]))
async def video_download(client: Client, message: Message):
    """Download video file"""
    if len(message.command) < 2:
        return await message.reply_text(
            "📺 <b>Usage:</b> <code>/vsong [video name]</code>",
            parse_mode="HTML"
        )
    
    query = " ".join(message.command[1:])
    
    status_msg = await message.reply_text(
        f"🔍 <b>Searching:</b> {query}",
        parse_mode="HTML"
    )
    
    try:
        await status_msg.edit_text("⬇️ <b>Downloading video...</b>", parse_mode="HTML")
        
        result = await yt.search_and_download(query, video=True)
        
        if not result:
            return await status_msg.edit_text(
                "❌ <b>No results found!</b>",
                parse_mode="HTML"
            )
        
        file_path = result["file_path"]
        title = result["title"]
        duration = result["duration"]
        thumbnail = result.get("thumbnail")
        
        # Check file size
        file_size = os.path.getsize(file_path)
        if file_size > 2 * 1024 * 1024 * 1024:
            os.remove(file_path)
            return await status_msg.edit_text(
                "❌ <b>File too large!</b> (Max: 2GB)",
                parse_mode="HTML"
            )
        
        await status_msg.edit_text("📤 <b>Uploading video...</b>", parse_mode="HTML")
        
        await message.reply_video(
            video=file_path,
            duration=duration,
            thumb=thumbnail if thumbnail and os.path.exists(thumbnail) else None,
            caption=f"📺 <b>{title}</b>\n\n<i>Downloaded via @{config.BOT_USERNAME}</i>",
            parse_mode="HTML",
            supports_streaming=True
        )
        
        await status_msg.delete()
        
        # Cleanup
        os.remove(file_path) if os.path.exists(file_path) else None
        os.remove(thumbnail) if thumbnail and os.path.exists(thumbnail) else None
        
        logger.info(f"Downloaded video: {title}")
        
    except Exception as e:
        logger.error(f"Video download error: {e}")
        await status_msg.edit_text(
            f"❌ <b>Download failed!</b>\n\n<code>{e}</code>",
            parse_mode="HTML"
        )

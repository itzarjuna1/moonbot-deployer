"""
Playback Control Commands
"""
from pyrogram import Client, filters
from pyrogram.types import Message, CallbackQuery
from loguru import logger

import config
from bot.client import music_bot
from bot.utils.queue import QueueManager


queue_manager = QueueManager()


@music_bot.bot.on_message(filters.command(["pause"]))
async def pause_command(client: Client, message: Message):
    """Pause current playback"""
    chat_id = message.chat.id
    
    if chat_id not in music_bot.active_chats:
        return await message.reply_text(
            "❌ <b>Nothing is playing!</b>",
            parse_mode="HTML"
        )
    
    try:
        await music_bot.pytgcalls.pause_stream(chat_id)
        await message.reply_text(
            "⏸️ <b>Playback paused!</b>\n\nUse /resume to continue.",
            parse_mode="HTML"
        )
    except Exception as e:
        await message.reply_text(f"❌ <b>Error:</b> {e}", parse_mode="HTML")


@music_bot.bot.on_message(filters.command(["resume"]))
async def resume_command(client: Client, message: Message):
    """Resume playback"""
    chat_id = message.chat.id
    
    if chat_id not in music_bot.active_chats:
        return await message.reply_text(
            "❌ <b>Nothing is playing!</b>",
            parse_mode="HTML"
        )
    
    try:
        await music_bot.pytgcalls.resume_stream(chat_id)
        await message.reply_text(
            "▶️ <b>Playback resumed!</b>",
            parse_mode="HTML"
        )
    except Exception as e:
        await message.reply_text(f"❌ <b>Error:</b> {e}", parse_mode="HTML")


@music_bot.bot.on_message(filters.command(["stop", "end", "leave"]))
async def stop_command(client: Client, message: Message):
    """Stop playback and leave voice chat"""
    chat_id = message.chat.id
    
    if chat_id not in music_bot.active_chats:
        return await message.reply_text(
            "❌ <b>Nothing is playing!</b>",
            parse_mode="HTML"
        )
    
    try:
        await music_bot.pytgcalls.leave_call(chat_id)
        music_bot.active_chats.discard(chat_id)
        queue_manager.clear_queue(chat_id)
        
        await message.reply_text(
            "⏹️ <b>Stopped playback and left voice chat!</b>",
            parse_mode="HTML"
        )
        logger.info(f"Left voice chat in {chat_id}")
    except Exception as e:
        await message.reply_text(f"❌ <b>Error:</b> {e}", parse_mode="HTML")


@music_bot.bot.on_message(filters.command(["skip", "next"]))
async def skip_command(client: Client, message: Message):
    """Skip to next song in queue"""
    chat_id = message.chat.id
    
    if chat_id not in music_bot.active_chats:
        return await message.reply_text(
            "❌ <b>Nothing is playing!</b>",
            parse_mode="HTML"
        )
    
    next_track = queue_manager.get_next(chat_id)
    
    if not next_track:
        # No more songs, stop playback
        await music_bot.pytgcalls.leave_call(chat_id)
        music_bot.active_chats.discard(chat_id)
        
        return await message.reply_text(
            "📋 <b>Queue is empty!</b> Leaving voice chat.",
            parse_mode="HTML"
        )
    
    try:
        from pytgcalls.types import MediaStream, AudioQuality
        
        await music_bot.pytgcalls.play(
            chat_id,
            MediaStream(
                next_track["file_path"],
                audio_parameters=AudioQuality.STUDIO,
            )
        )
        
        queue_manager.set_current(chat_id, next_track)
        
        await message.reply_text(
            f"⏭️ <b>Skipped!</b>\n\n"
            f"🎵 <b>Now Playing:</b> {next_track['title']}\n"
            f"👤 <b>Requested by:</b> {next_track['requested_by']}",
            parse_mode="HTML"
        )
    except Exception as e:
        await message.reply_text(f"❌ <b>Error:</b> {e}", parse_mode="HTML")


@music_bot.bot.on_message(filters.command(["queue", "q"]))
async def queue_command(client: Client, message: Message):
    """Show current queue"""
    chat_id = message.chat.id
    
    current = queue_manager.get_current(chat_id)
    queue = queue_manager.get_queue(chat_id)
    
    if not current and not queue:
        return await message.reply_text(
            "📋 <b>Queue is empty!</b>\n\nUse /play to add songs.",
            parse_mode="HTML"
        )
    
    text = "🎵 <b>Music Queue</b>\n\n"
    
    if current:
        text += f"▶️ <b>Now Playing:</b>\n{current['title']}\n\n"
    
    if queue:
        text += "<b>Up Next:</b>\n"
        for i, track in enumerate(queue[:10], 1):
            text += f"{i}. {track['title']}\n"
        
        if len(queue) > 10:
            text += f"\n<i>...and {len(queue) - 10} more</i>"
    
    await message.reply_text(text, parse_mode="HTML")


@music_bot.bot.on_message(filters.command(["loop"]))
async def loop_command(client: Client, message: Message):
    """Toggle loop mode"""
    chat_id = message.chat.id
    
    if chat_id not in music_bot.active_chats:
        return await message.reply_text(
            "❌ <b>Nothing is playing!</b>",
            parse_mode="HTML"
        )
    
    current_loop = music_bot.loop_mode.get(chat_id, False)
    music_bot.loop_mode[chat_id] = not current_loop
    
    status = "enabled 🔁" if music_bot.loop_mode[chat_id] else "disabled"
    await message.reply_text(
        f"🔁 <b>Loop mode {status}</b>",
        parse_mode="HTML"
    )


@music_bot.bot.on_message(filters.command(["volume", "vol"]))
async def volume_command(client: Client, message: Message):
    """Adjust volume (1-200)"""
    chat_id = message.chat.id
    
    if chat_id not in music_bot.active_chats:
        return await message.reply_text(
            "❌ <b>Nothing is playing!</b>",
            parse_mode="HTML"
        )
    
    if len(message.command) < 2:
        return await message.reply_text(
            "🔊 <b>Usage:</b> <code>/volume [1-200]</code>",
            parse_mode="HTML"
        )
    
    try:
        volume = int(message.command[1])
        if volume < 1 or volume > 200:
            raise ValueError("Volume must be between 1-200")
        
        await music_bot.pytgcalls.change_volume_call(chat_id, volume)
        await message.reply_text(
            f"🔊 <b>Volume set to {volume}%</b>",
            parse_mode="HTML"
        )
    except ValueError as e:
        await message.reply_text(
            f"❌ <b>Invalid volume!</b> Use a number between 1-200.",
            parse_mode="HTML"
        )


# Callback Query Handlers
@music_bot.bot.on_callback_query(filters.regex("^(pause|resume|skip|stop|queue|loop)$"))
async def control_callback(client: Client, callback: CallbackQuery):
    """Handle control button callbacks"""
    chat_id = callback.message.chat.id
    action = callback.data
    
    if action == "pause":
        try:
            await music_bot.pytgcalls.pause_stream(chat_id)
            await callback.answer("⏸️ Paused!")
        except:
            await callback.answer("❌ Error pausing", show_alert=True)
            
    elif action == "resume":
        try:
            await music_bot.pytgcalls.resume_stream(chat_id)
            await callback.answer("▶️ Resumed!")
        except:
            await callback.answer("❌ Error resuming", show_alert=True)
            
    elif action == "skip":
        next_track = queue_manager.get_next(chat_id)
        if next_track:
            from pytgcalls.types import MediaStream, AudioQuality
            await music_bot.pytgcalls.play(
                chat_id,
                MediaStream(next_track["file_path"], audio_parameters=AudioQuality.STUDIO)
            )
            await callback.answer(f"⏭️ Now playing: {next_track['title'][:30]}")
        else:
            await music_bot.pytgcalls.leave_call(chat_id)
            music_bot.active_chats.discard(chat_id)
            await callback.answer("📋 Queue empty, leaving VC")
            
    elif action == "stop":
        await music_bot.pytgcalls.leave_call(chat_id)
        music_bot.active_chats.discard(chat_id)
        queue_manager.clear_queue(chat_id)
        await callback.answer("⏹️ Stopped!")
        
    elif action == "queue":
        queue = queue_manager.get_queue(chat_id)
        if queue:
            await callback.answer(f"📋 {len(queue)} songs in queue")
        else:
            await callback.answer("📋 Queue is empty")
            
    elif action == "loop":
        current_loop = music_bot.loop_mode.get(chat_id, False)
        music_bot.loop_mode[chat_id] = not current_loop
        status = "ON" if music_bot.loop_mode[chat_id] else "OFF"
        await callback.answer(f"🔁 Loop: {status}")

"""
Play Command - Stream music on Telegram Voice Chat
"""
import os
import asyncio
from pyrogram import Client, filters
from pyrogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton
from pytgcalls.types import MediaStream, AudioQuality, VideoQuality
from loguru import logger

import config
from bot.client import music_bot
from bot.utils.youtube import YouTubeDownloader
from bot.utils.queue import QueueManager


yt = YouTubeDownloader()
queue_manager = QueueManager()


@music_bot.bot.on_message(filters.command(["play", "p"]))
async def play_command(client: Client, message: Message):
    """Play a song in voice chat"""
    chat_id = message.chat.id
    
    # Check if query provided
    if len(message.command) < 2 and not message.reply_to_message:
        return await message.reply_text(
            "🎵 <b>Usage:</b> <code>/play [song name or YouTube URL]</code>\n\n"
            "You can also reply to an audio file with /play",
            parse_mode="HTML"
        )
    
    # Get query
    if message.reply_to_message and message.reply_to_message.audio:
        # Handle audio file reply
        query = None
        audio_file = message.reply_to_message.audio
    else:
        query = " ".join(message.command[1:])
        audio_file = None
    
    # Send processing message
    status_msg = await message.reply_text(
        "🔍 <b>Searching...</b>",
        parse_mode="HTML"
    )
    
    try:
        # Check if assistant is in the group
        try:
            await music_bot.assistant.get_chat_member(chat_id, (await music_bot.assistant.get_me()).id)
        except:
            # Join the chat
            try:
                invite_link = await client.export_chat_invite_link(chat_id)
                await music_bot.assistant.join_chat(invite_link)
                await asyncio.sleep(1)
            except Exception as e:
                return await status_msg.edit_text(
                    f"❌ <b>Error:</b> Could not join the chat. Please add the assistant manually.\n\n"
                    f"<code>{e}</code>",
                    parse_mode="HTML"
                )
        
        if audio_file:
            # Download audio file
            file_path = await message.reply_to_message.download()
            title = audio_file.title or "Audio File"
            duration = audio_file.duration or 0
            thumbnail = None
        else:
            # Search and download from YouTube
            await status_msg.edit_text("🎵 <b>Fetching from YouTube...</b>", parse_mode="HTML")
            
            result = await yt.search_and_download(query)
            if not result:
                return await status_msg.edit_text(
                    "❌ <b>No results found!</b> Try a different search query.",
                    parse_mode="HTML"
                )
            
            file_path = result["file_path"]
            title = result["title"]
            duration = result["duration"]
            thumbnail = result.get("thumbnail")
        
        # Check duration limit
        if duration > config.DURATION_LIMIT * 60:
            os.remove(file_path) if os.path.exists(file_path) else None
            return await status_msg.edit_text(
                f"❌ <b>Duration too long!</b>\n\n"
                f"Maximum allowed: {config.DURATION_LIMIT} minutes\n"
                f"Song duration: {duration // 60} minutes",
                parse_mode="HTML"
            )
        
        # Create track info
        track = {
            "title": title,
            "duration": duration,
            "file_path": file_path,
            "thumbnail": thumbnail,
            "requested_by": message.from_user.mention if message.from_user else "Anonymous"
        }
        
        # Check if already playing
        if chat_id in music_bot.active_chats:
            # Add to queue
            position = queue_manager.add_to_queue(chat_id, track)
            
            await status_msg.edit_text(
                f"📋 <b>Added to Queue</b>\n\n"
                f"🎵 <b>Title:</b> {title}\n"
                f"⏱️ <b>Duration:</b> {duration // 60}:{duration % 60:02d}\n"
                f"📍 <b>Position:</b> #{position}\n"
                f"👤 <b>Requested by:</b> {track['requested_by']}",
                parse_mode="HTML",
                reply_markup=InlineKeyboardMarkup([
                    [
                        InlineKeyboardButton("⏭️ Skip", callback_data="skip"),
                        InlineKeyboardButton("📋 Queue", callback_data="queue"),
                    ]
                ])
            )
        else:
            # Start playing
            await status_msg.edit_text("🎧 <b>Joining voice chat...</b>", parse_mode="HTML")
            
            try:
                await music_bot.pytgcalls.play(
                    chat_id,
                    MediaStream(
                        file_path,
                        audio_parameters=AudioQuality.STUDIO,
                        video_parameters=VideoQuality.HD_720p,
                    )
                )
                
                music_bot.active_chats.add(chat_id)
                queue_manager.set_current(chat_id, track)
                
                await status_msg.edit_text(
                    f"🎵 <b>Now Playing</b>\n\n"
                    f"🎧 <b>Title:</b> {title}\n"
                    f"⏱️ <b>Duration:</b> {duration // 60}:{duration % 60:02d}\n"
                    f"👤 <b>Requested by:</b> {track['requested_by']}",
                    parse_mode="HTML",
                    reply_markup=InlineKeyboardMarkup([
                        [
                            InlineKeyboardButton("⏸️ Pause", callback_data="pause"),
                            InlineKeyboardButton("⏭️ Skip", callback_data="skip"),
                            InlineKeyboardButton("⏹️ Stop", callback_data="stop"),
                        ],
                        [
                            InlineKeyboardButton("📋 Queue", callback_data="queue"),
                            InlineKeyboardButton("🔁 Loop", callback_data="loop"),
                        ]
                    ])
                )
                
                logger.info(f"Started playing in {chat_id}: {title}")
                
            except Exception as e:
                logger.error(f"Failed to play in {chat_id}: {e}")
                await status_msg.edit_text(
                    f"❌ <b>Failed to play!</b>\n\n"
                    f"Make sure a voice chat is active in this group.\n\n"
                    f"<code>{e}</code>",
                    parse_mode="HTML"
                )
                
    except Exception as e:
        logger.error(f"Play command error: {e}")
        await status_msg.edit_text(
            f"❌ <b>An error occurred!</b>\n\n<code>{e}</code>",
            parse_mode="HTML"
        )


@music_bot.bot.on_message(filters.command(["vplay", "video"]))
async def video_play_command(client: Client, message: Message):
    """Play video in voice chat"""
    chat_id = message.chat.id
    
    if len(message.command) < 2:
        return await message.reply_text(
            "📺 <b>Usage:</b> <code>/vplay [video name or YouTube URL]</code>",
            parse_mode="HTML"
        )
    
    query = " ".join(message.command[1:])
    
    status_msg = await message.reply_text(
        "🔍 <b>Searching for video...</b>",
        parse_mode="HTML"
    )
    
    try:
        # Search and download video
        result = await yt.search_and_download(query, video=True)
        if not result:
            return await status_msg.edit_text(
                "❌ <b>No results found!</b>",
                parse_mode="HTML"
            )
        
        file_path = result["file_path"]
        title = result["title"]
        duration = result["duration"]
        
        # Play video
        await music_bot.pytgcalls.play(
            chat_id,
            MediaStream(
                file_path,
                audio_parameters=AudioQuality.STUDIO,
                video_parameters=VideoQuality.HD_720p,
            )
        )
        
        music_bot.active_chats.add(chat_id)
        
        await status_msg.edit_text(
            f"📺 <b>Now Playing Video</b>\n\n"
            f"🎬 <b>Title:</b> {title}\n"
            f"⏱️ <b>Duration:</b> {duration // 60}:{duration % 60:02d}",
            parse_mode="HTML",
            reply_markup=InlineKeyboardMarkup([
                [
                    InlineKeyboardButton("⏸️ Pause", callback_data="pause"),
                    InlineKeyboardButton("⏹️ Stop", callback_data="stop"),
                ]
            ])
        )
        
    except Exception as e:
        await status_msg.edit_text(
            f"❌ <b>Error:</b> {e}",
            parse_mode="HTML"
        )

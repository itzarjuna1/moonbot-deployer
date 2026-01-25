"""
Uppermoon Music Bot - Configuration
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Telegram API Credentials (Main Bot)
API_ID = int(os.getenv("API_ID", 0))
API_HASH = os.getenv("API_HASH", "")
BOT_TOKEN = os.getenv("BOT_TOKEN", "")

# Assistant Account (For Voice Chat)
ASSISTANT_API_ID = int(os.getenv("ASSISTANT_API_ID", 0))
ASSISTANT_API_HASH = os.getenv("ASSISTANT_API_HASH", "")
ASSISTANT_STRING_SESSION = os.getenv("ASSISTANT_STRING_SESSION", "")

# Owner Configuration
OWNER_ID = int(os.getenv("OWNER_ID", 0))
SUDO_USERS = list(map(int, os.getenv("SUDO_USERS", "").split())) if os.getenv("SUDO_USERS") else []

# Bot Settings
BOT_NAME = os.getenv("BOT_NAME", "Uppermoon Music")
BOT_USERNAME = os.getenv("BOT_USERNAME", "")
SUPPORT_GROUP = os.getenv("SUPPORT_GROUP", "https://t.me/snowy_hometown")

# Music Settings
DURATION_LIMIT = int(os.getenv("DURATION_LIMIT", 60))  # Max duration in minutes
SONG_DOWNLOAD_DURATION = int(os.getenv("SONG_DOWNLOAD_DURATION", 10))  # Max download duration
AUTO_LEAVE_EMPTY_VC = True
AUTO_LEAVE_ASSISTANT = True

# Audio Quality
AUDIO_BITRATE = os.getenv("AUDIO_BITRATE", "128k")
VIDEO_QUALITY = os.getenv("VIDEO_QUALITY", "720p")

# Cache Settings
CACHE_DIR = os.getenv("CACHE_DIR", "./cache")
TEMP_DIR = os.getenv("TEMP_DIR", "./temp")

# Logging
LOG_CHANNEL = int(os.getenv("LOG_CHANNEL", 0)) if os.getenv("LOG_CHANNEL") else None

# Website Integration
WEBSITE_URL = os.getenv("WEBSITE_URL", "")
NOTIFY_CHAT_ID = int(os.getenv("NOTIFY_CHAT_ID", 0)) if os.getenv("NOTIFY_CHAT_ID") else None

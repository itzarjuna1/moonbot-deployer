# 🎵 Uppermoon Music Bot

A powerful Telegram music streaming bot using PyTgCalls. Stream music and videos directly to Telegram voice chats!

## ✨ Features

- 🎧 **Music Streaming** - Play songs from YouTube in voice chats
- 📺 **Video Streaming** - Stream videos with audio
- 🔍 **YouTube Search** - Search and play directly
- 📋 **Queue System** - Add multiple songs to queue
- 🔁 **Loop Mode** - Repeat current song
- 🔊 **Volume Control** - Adjust playback volume
- ⏯️ **Playback Controls** - Pause, resume, skip, stop
- 📥 **Download** - Download songs and videos as files

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- FFmpeg
- Telegram Bot Token (from @BotFather)
- Telegram API credentials (from my.telegram.org)
- Assistant account with string session

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/uppermoon-music.git
   cd uppermoon-music
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Run the bot**
   ```bash
   python main.py
   ```

### Docker Deployment

```bash
# Build and run
docker build -t uppermoon-music .
docker run -d --name uppermoon-music --env-file .env uppermoon-music

# Or with docker-compose (from parent directory)
docker-compose up -d music-bot
```

## 📝 Commands

### Playback
| Command | Description |
|---------|-------------|
| `/play [song]` | Play a song |
| `/vplay [video]` | Play video |
| `/pause` | Pause playback |
| `/resume` | Resume playback |
| `/stop` | Stop and leave VC |

### Queue
| Command | Description |
|---------|-------------|
| `/skip` | Skip current song |
| `/queue` | Show queue |
| `/loop` | Toggle loop mode |

### Audio
| Command | Description |
|---------|-------------|
| `/volume [1-200]` | Set volume |

### Download
| Command | Description |
|---------|-------------|
| `/song [name]` | Download audio |
| `/vsong [name]` | Download video |

### Info
| Command | Description |
|---------|-------------|
| `/ping` | Check latency |
| `/stats` | Bot statistics |

## 🔧 Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `API_ID` | Telegram API ID |
| `API_HASH` | Telegram API Hash |
| `BOT_TOKEN` | Bot token from @BotFather |
| `ASSISTANT_API_ID` | Assistant account API ID |
| `ASSISTANT_API_HASH` | Assistant account API Hash |
| `ASSISTANT_STRING_SESSION` | Pyrogram string session |
| `OWNER_ID` | Your Telegram user ID |
| `DURATION_LIMIT` | Max song duration (minutes) |

### Generating String Session

```python
from pyrogram import Client

api_id = YOUR_API_ID
api_hash = "YOUR_API_HASH"

with Client("my_account", api_id, api_hash) as app:
    print(app.export_session_string())
```

## 📁 Project Structure

```
music-bot/
├── bot/
│   ├── __init__.py
│   ├── client.py          # Bot client initialization
│   ├── plugins/
│   │   ├── __init__.py
│   │   ├── start.py       # Start/help commands
│   │   ├── play.py        # Play commands
│   │   ├── controls.py    # Playback controls
│   │   └── download.py    # Download commands
│   └── utils/
│       ├── __init__.py
│       ├── youtube.py     # YouTube downloader
│       └── queue.py       # Queue management
├── config.py              # Configuration
├── main.py                # Entry point
├── requirements.txt       # Dependencies
├── Dockerfile             # Docker config
└── .env.example           # Environment template
```

## 🛠️ Tech Stack

- **Pyrogram** - Telegram MTProto library
- **PyTgCalls** - Voice chat streaming
- **yt-dlp** - YouTube downloading
- **FFmpeg** - Audio/video processing
- **Loguru** - Logging

## 📄 License

MIT License - feel free to use and modify!

## 💬 Support

Join our support group: [Uppermoon Devs](https://t.me/snowy_hometown)

---

Made with 💙 by Uppermoon Devs

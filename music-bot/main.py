#"""
#Uppermoon Music Bot - Main Entry Point
#A powerful Telegram music streaming bot using PyTgCalls
#"""
import asyncio
import os
import sys
from loguru import logger 

# Configure logging
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level="INFO"
)
logger.add(
    "logs/bot_{time:YYYY-MM-DD}.log",
    rotation="1 day",
    retention="7 days",
    compression="zip",
    level="DEBUG"
)

# Create necessary directories
os.makedirs("logs", exist_ok=True)
os.makedirs("sessions", exist_ok=True)
os.makedirs("cache", exist_ok=True)
os.makedirs("temp", exist_ok=True)


async def main():
    """Main function to start the bot"""
    from bot.client import music_bot
    
    logger.info("=" * 50)
    logger.info("       UPPERMOON MUSIC BOT")
    logger.info("=" * 50)
    
    try:
        await music_bot.start()
        
        logger.info("Bot is running. Press Ctrl+C to stop.")
        
        # Keep the bot running
        while True:
            await asyncio.sleep(3600)
            
    except KeyboardInterrupt:
        logger.info("Received interrupt signal")
    except Exception as e:
        logger.exception(f"Fatal error: {e}")
    finally:
        await music_bot.stop()


if __name__ == "__main__":
    # Check Python version
    if sys.version_info < (3, 10):
        logger.error("Python 3.10 or higher is required!")
        sys.exit(1)
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Bot stopped by user")
    except Exception as e:
        logger.exception(f"Startup error: {e}")
        sys.exit(1)

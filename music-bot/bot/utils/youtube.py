"""
YouTube Download Utilities using yt-dlp
"""
import os
import asyncio
import aiohttp
from typing import Optional
from yt_dlp import YoutubeDL
from loguru import logger

import config


class YouTubeDownloader:
    """YouTube search and download handler using yt-dlp"""
    
    def __init__(self):
        self.cache_dir = config.CACHE_DIR
        self.temp_dir = config.TEMP_DIR
        
        # Create directories
        os.makedirs(self.cache_dir, exist_ok=True)
        os.makedirs(self.temp_dir, exist_ok=True)
        
        # Base yt-dlp options
        self.base_opts = {
            "quiet": True,
            "no_warnings": True,
            "extract_flat": False,
            "nocheckcertificate": True,
            "source_address": "0.0.0.0",
            "geo_bypass": True,
        }
    
    async def search(self, query: str, max_results: int = 5) -> list[dict]:
        """Search YouTube for videos"""
        opts = {
            **self.base_opts,
            "default_search": "ytsearch",
            "extract_flat": True,
            "playlistend": max_results,
        }
        
        try:
            loop = asyncio.get_event_loop()
            
            def _search():
                with YoutubeDL(opts) as ydl:
                    result = ydl.extract_info(f"ytsearch{max_results}:{query}", download=False)
                    return result.get("entries", []) if result else []
            
            entries = await loop.run_in_executor(None, _search)
            
            results = []
            for entry in entries:
                if entry:
                    results.append({
                        "id": entry.get("id"),
                        "url": f"https://www.youtube.com/watch?v={entry.get('id')}",
                        "title": entry.get("title", "Unknown Title"),
                        "duration": entry.get("duration", 0),
                        "channel": entry.get("channel", "Unknown"),
                        "thumbnail": entry.get("thumbnails", [{}])[-1].get("url", ""),
                    })
            
            return results
            
        except Exception as e:
            logger.error(f"YouTube search error: {e}")
            return []
    
    async def search_and_download(
        self, 
        query: str, 
        video: bool = False
    ) -> Optional[dict]:
        """Search YouTube and download the first result"""
        
        # Check if it's a URL
        is_url = query.startswith(("http://", "https://", "www."))
        
        if not is_url:
            # Search first
            results = await self.search(query, max_results=1)
            if not results:
                return None
            url = results[0]["url"]
            video_id = results[0]["id"]
        else:
            url = query
            video_id = None
        
        # Download options
        if video:
            output_template = os.path.join(self.cache_dir, f"video_%(id)s.%(ext)s")
            opts = {
                **self.base_opts,
                "format": "bestvideo[height<=720]+bestaudio/best[height<=720]",
                "outtmpl": output_template,
                "merge_output_format": "mp4",
                "postprocessors": [{
                    "key": "FFmpegVideoConvertor",
                    "preferedformat": "mp4",
                }],
            }
        else:
            output_template = os.path.join(self.cache_dir, f"audio_%(id)s.%(ext)s")
            opts = {
                **self.base_opts,
                "format": "bestaudio/best",
                "outtmpl": output_template,
                "postprocessors": [{
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": config.AUDIO_BITRATE.replace("k", ""),
                }],
            }
        
        try:
            loop = asyncio.get_event_loop()
            
            def _download():
                with YoutubeDL(opts) as ydl:
                    info = ydl.extract_info(url, download=True)
                    return info
            
            info = await loop.run_in_executor(None, _download)
            
            if not info:
                return None
            
            # Get downloaded file path
            if video:
                ext = "mp4"
            else:
                ext = "mp3"
            
            file_path = os.path.join(
                self.cache_dir, 
                f"{'video' if video else 'audio'}_{info['id']}.{ext}"
            )
            
            # Download thumbnail
            thumbnail_path = None
            if info.get("thumbnail"):
                thumbnail_path = await self._download_thumbnail(
                    info["thumbnail"], 
                    info["id"]
                )
            
            return {
                "file_path": file_path,
                "title": info.get("title", "Unknown"),
                "duration": info.get("duration", 0),
                "thumbnail": thumbnail_path,
                "url": url,
                "channel": info.get("channel", "Unknown"),
            }
            
        except Exception as e:
            logger.error(f"Download error: {e}")
            return None
    
    async def _download_thumbnail(self, url: str, video_id: str) -> Optional[str]:
        """Download thumbnail image"""
        try:
            thumb_path = os.path.join(self.temp_dir, f"thumb_{video_id}.jpg")
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as resp:
                    if resp.status == 200:
                        content = await resp.read()
                        with open(thumb_path, "wb") as f:
                            f.write(content)
                        return thumb_path
            
            return None
            
        except Exception as e:
            logger.error(f"Thumbnail download error: {e}")
            return None
    
    async def get_stream_url(self, query: str, video: bool = False) -> Optional[dict]:
        """Get direct stream URL without downloading"""
        is_url = query.startswith(("http://", "https://", "www."))
        
        if not is_url:
            results = await self.search(query, max_results=1)
            if not results:
                return None
            url = results[0]["url"]
        else:
            url = query
        
        if video:
            format_spec = "bestvideo[height<=720]+bestaudio/best[height<=720]"
        else:
            format_spec = "bestaudio/best"
        
        opts = {
            **self.base_opts,
            "format": format_spec,
        }
        
        try:
            loop = asyncio.get_event_loop()
            
            def _extract():
                with YoutubeDL(opts) as ydl:
                    return ydl.extract_info(url, download=False)
            
            info = await loop.run_in_executor(None, _extract)
            
            if not info:
                return None
            
            # Get stream URL
            stream_url = None
            if "url" in info:
                stream_url = info["url"]
            elif "formats" in info:
                for fmt in reversed(info["formats"]):
                    if fmt.get("url"):
                        stream_url = fmt["url"]
                        break
            
            return {
                "stream_url": stream_url,
                "title": info.get("title", "Unknown"),
                "duration": info.get("duration", 0),
                "thumbnail": info.get("thumbnail"),
            }
            
        except Exception as e:
            logger.error(f"Stream URL extraction error: {e}")
            return None
    
    def cleanup(self, file_path: str):
        """Remove downloaded file"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            logger.error(f"Cleanup error: {e}")

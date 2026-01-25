"""
Queue Management for Music Bot
"""
from typing import Optional
from loguru import logger


class QueueManager:
    """Manages music queues for each chat"""
    
    def __init__(self):
        self._queues: dict[int, list[dict]] = {}
        self._current: dict[int, dict] = {}
    
    def add_to_queue(self, chat_id: int, track: dict) -> int:
        """Add a track to the queue and return position"""
        if chat_id not in self._queues:
            self._queues[chat_id] = []
        
        self._queues[chat_id].append(track)
        position = len(self._queues[chat_id])
        
        logger.debug(f"Added to queue in {chat_id}: {track['title']} (position {position})")
        return position
    
    def get_next(self, chat_id: int) -> Optional[dict]:
        """Get and remove the next track from queue"""
        if chat_id not in self._queues or not self._queues[chat_id]:
            return None
        
        track = self._queues[chat_id].pop(0)
        logger.debug(f"Got next track in {chat_id}: {track['title']}")
        return track
    
    def get_queue(self, chat_id: int) -> list[dict]:
        """Get all tracks in queue"""
        return self._queues.get(chat_id, [])
    
    def clear_queue(self, chat_id: int):
        """Clear the queue for a chat"""
        self._queues[chat_id] = []
        self._current.pop(chat_id, None)
        logger.debug(f"Cleared queue for {chat_id}")
    
    def set_current(self, chat_id: int, track: dict):
        """Set the currently playing track"""
        self._current[chat_id] = track
    
    def get_current(self, chat_id: int) -> Optional[dict]:
        """Get the currently playing track"""
        return self._current.get(chat_id)
    
    def remove_from_queue(self, chat_id: int, position: int) -> bool:
        """Remove a track from queue by position (1-indexed)"""
        if chat_id not in self._queues:
            return False
        
        try:
            self._queues[chat_id].pop(position - 1)
            return True
        except IndexError:
            return False
    
    def shuffle_queue(self, chat_id: int) -> bool:
        """Shuffle the queue"""
        import random
        
        if chat_id not in self._queues or len(self._queues[chat_id]) < 2:
            return False
        
        random.shuffle(self._queues[chat_id])
        return True
    
    def queue_length(self, chat_id: int) -> int:
        """Get queue length"""
        return len(self._queues.get(chat_id, []))

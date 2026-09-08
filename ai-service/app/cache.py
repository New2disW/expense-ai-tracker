import hashlib
import json

# In-memory dictionary to store LLM responses
# In a production environment, you should replace this with a Redis cache (e.g., redis.setex(key, ttl, val))
# to share the cache across instances and persist across restarts.
_llm_cache = {}

def get_cache_key(prompt: str) -> str:
    """Generate a consistent hash for a prompt string."""
    return hashlib.md5(prompt.encode('utf-8')).hexdigest()

def get_cached_response(prompt: str):
    key = get_cache_key(prompt)
    return _llm_cache.get(key)

def set_cached_response(prompt: str, response_json: str):
    key = get_cache_key(prompt)
    _llm_cache[key] = response_json

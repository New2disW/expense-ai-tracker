import time
from fastapi import HTTPException
from collections import defaultdict

# In-memory dictionary to store request timestamps per user
# In a production environment, you should replace this with a Redis-based rate limiter (e.g. using redis-py and a token bucket algorithm)
# to ensure rate limits are respected across multiple instances of the service.
_user_requests = defaultdict(list)

# Rate Limit configuration:
# 10 requests per minute per user.
# Why? 10 rpm is high enough to accommodate legitimate personal expense tracking (users rarely log more than 10 expenses or ask 10 questions in a single minute)
# but low enough to protect against a runaway script or malicious spam draining Groq API credits.
RATE_LIMIT_REQUESTS = 10
RATE_LIMIT_WINDOW_SECONDS = 60

def check_rate_limit(user_id: str):
    now = time.time()
    
    # Remove timestamps older than the window
    _user_requests[user_id] = [ts for ts in _user_requests[user_id] if now - ts < RATE_LIMIT_WINDOW_SECONDS]
    
    if len(_user_requests[user_id]) >= RATE_LIMIT_REQUESTS:
        raise HTTPException(
            status_code=429, 
            detail="Too many requests. Please wait a minute before trying again."
        )
        
    _user_requests[user_id].append(now)

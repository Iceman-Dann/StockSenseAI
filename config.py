import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    ALPHA_VANTAGE_KEY = os.getenv('ALPHA_VANTAGE_KEY', 'demo')
    NEWS_API_KEY = os.getenv('NEWS_API_KEY', 'news_demo_key')
    OPENAI_KEY = os.getenv('OPENAI_KEY', '')
    
    # Additional configuration
    SESSION_TYPE = 'filesystem'
    MAX_WATCHLIST_ITEMS = 15

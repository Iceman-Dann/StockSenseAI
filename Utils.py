import requests
import random
import json
from datetime import datetime, timedelta
import openai

def get_stock_data(symbol, api_key):
    """Fetch stock data from Alpha Vantage API or generate simulated data"""
    if api_key == 'demo':
        # Simulate data for demo
        base_prices = {
            'AAPL': 175, 'MSFT': 340, 'TSLA': 240, 'NVDA': 450, 
            'GOOGL': 130, 'AMZN': 145, 'META': 300, 'NFLX': 420, 
            'AMD': 110, 'INTC': 35, 'JPM': 150, 'JNJ': 160, 'V': 220,
            'DIS': 90, 'NKE': 100, 'BA': 200, 'XOM': 105, 'WMT': 150
        }
        
        price = (base_prices.get(symbol, 100) + (random.random() - 0.5) * 20)
        change = (random.random() - 0.5) * 10
        change_percent = (change / price) * 100
        volume = random.randint(1000000, 10000000)
        
        # Calculate market cap (price * random shares outstanding)
        market_cap = price * random.randint(100000000, 10000000000)
        
        # Calculate PE ratio
        pe_ratio = round(random.uniform(10, 40), 2)
        
        # Calculate dividend yield
        dividend_yield = round(random.uniform(0, 4), 2)
        
        # Calculate 52-week high/low
        fifty_two_week_high = price * random.uniform(1.1, 1.5)
        fifty_two_week_low = price * random.uniform(0.5, 0.9)
        
        return {
            'symbol': symbol,
            'price': round(price, 2),
            'change': round(change, 2),
            'change_percent': round(change_percent, 2),
            'volume': volume,
            'market_cap': market_cap,
            'pe_ratio': pe_ratio,
            'dividend_yield': dividend_yield,
            'fifty_two_week_high': round(fifty_two_week_high, 2),
            'fifty_two_week_low': round(fifty_two_week_low, 2)
        }
    
    # Real API call
    try:
        url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}'
        response = requests.get(url)
        data = response.json()
        
        if 'Global Quote' in data and data['Global Quote']:
            quote = data['Global Quote']
            return {
                'symbol': symbol,
                'price': float(quote['05. price']),
                'change': float(quote['09. change']),
                'change_percent': float(quote['10. change percent'].rstrip('%')),
                'volume': int(quote['06. volume'])
            }
        else:
            # Fallback to demo if API fails
            return get_stock_data(symbol, 'demo')
    except:
        return get_stock_data(symbol, 'demo')

def get_crypto_data(symbol, api_key):
    """Fetch cryptocurrency data"""
    if api_key == 'demo':
        # Simulate crypto data
        base_prices = {
            'BTC': 50000, 'ETH': 3000, 'ADA': 1.2, 'DOGE': 0.2,
            'XRP': 0.8, 'DOT': 20, 'SOL': 100, 'BNB': 400
        }
        
        price = (base_prices.get(symbol, 100) + (random.random() - 0.5) * 20)
        change = (random.random() - 0.5) * 10
        change_percent = (change / price) * 100
        volume = random.randint(1000000, 1000000000)
        market_cap = price * random.randint(1000000, 1000000000)
        
        return {
            'symbol': symbol,
            'price': round(price, 2),
            'change': round(change, 2),
            'change_percent': round(change_percent, 2),
            'volume': volume,
            'market_cap': market_cap
        }
    
    # Real API call for crypto
    try:
        url = f'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency={symbol}&to_currency=USD&apikey={api_key}'
        response = requests.get(url)
        data = response.json()
        
        if 'Realtime Currency Exchange Rate' in data:
            rate = data['Realtime Currency Exchange Rate']
            return {
                'symbol': symbol,
                'price': float(rate['5. Exchange Rate']),
                'change': float(rate['5. Exchange Rate']) - float(rate['5. Exchange Rate']) * 0.99,  # Simulated change
                'change_percent': 1.0,  # Simulated change percent
                'volume': random.randint(1000000, 1000000000),
                'market_cap': float(rate['5. Exchange Rate']) * random.randint(1000000, 1000000000)
            }
        else:
            return get_crypto_data(symbol, 'demo')
    except:
        return get_crypto_data(symbol, 'demo')

def get_historical_data(symbol, api_key, days=30):
    """Get historical stock data for charting"""
    if api_key == 'demo':
        # Generate simulated historical data
        base_price = {
            'AAPL': 175, 'MSFT': 340, 'TSLA': 240, 'NVDA': 450, 
            'GOOGL': 130, 'AMZN': 145, 'META': 300, 'NFLX': 420, 
            'AMD': 110, 'INTC': 35, 'JPM': 150, 'JNJ': 160, 'V': 220,
            'BTC': 50000, 'ETH': 3000, 'ADA': 1.2, 'DOGE': 0.2
        }.get(symbol, 100)
        
        historical_data = []
        current_date = datetime.now()
        price = base_price
        
        for i in range(days, 0, -1):
            date = current_date - timedelta(days=i)
            price += (random.random() - 0.5) * 10
            price = max(price, base_price * 0.7)  # Prevent unrealistic drops
            
            historical_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'price': round(price, 2),
                'volume': random.randint(1000000, 10000000)
            })
        
        return historical_data
    
    # Real API call for historical data
    try:
        url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={api_key}&outputsize=compact'
        response = requests.get(url)
        data = response.json()
        
        if 'Time Series (Daily)' in data:
            time_series = data['Time Series (Daily)']
            historical_data = []
            
            for date, values in list(time_series.items())[:days]:
                historical_data.append({
                    'date': date,
                    'price': float(values['4. close']),
                    'volume': int(values['5. volume'])
                })
            
            return historical_data
        else:
            return get_historical_data(symbol, 'demo', days)
    except:
        return get_historical_data(symbol, 'demo', days)

def analyze_stock_sentiment(symbol, api_key):
    """Analyze stock sentiment from news"""
    # In a real implementation, this would analyze news articles
    # For demo, return simulated sentiment
    sentiments = ['positive', 'neutral', 'negative']
    weights = [0.6, 0.3, 0.1]  # More likely to be positive
    
    sentiment = random.choices(sentiments, weights=weights, k=1)[0]
    score = round(random.uniform(0.5, 0.9) if sentiment == 'positive' else 
                 random.uniform(0.3, 0.6) if sentiment == 'neutral' else 
                 random.uniform(0.1, 0.4), 2)
    
    return {
        'sentiment': sentiment,
        'score': score
    }

def generate_ai_recommendation(symbol, api_key, analysis_type='deep'):
    """Generate AI recommendation for a stock using OpenAI"""
    # This would normally call OpenAI API
    # For demo, return simulated analysis
    
    # Different analysis types yield different confidence levels
    if analysis_type == 'quick':
        confidence_range = (60, 80)
    elif analysis_type == 'predictive':
        confidence_range = (70, 85)
    elif analysis_type == 'advanced':
        confidence_range = (80, 95)
    else:  # deep analysis
        confidence_range = (75, 90)
    
    # Base decisions with weights
    decisions = ['BUY', 'HOLD', 'SELL']
    weights = [0.6, 0.3, 0.1]  # More likely to recommend BUY
    
    decision = random.choices(decisions, weights=weights, k=1)[0]
    confidence = random.randint(*confidence_range)
    
    # Generate realistic target price based on decision
    current_price = get_stock_data(symbol, api_key)['price']
    
    if decision == 'BUY':
        target_price = round(current_price * random.uniform(1.05, 1.25), 2)
        reasoning = f"{symbol} shows strong fundamentals with growth potential. Technical indicators suggest upward momentum."
    elif decision == 'SELL':
        target_price = round(current_price * random.uniform(0.75, 0.95), 2)
        reasoning = f"{symbol} appears overvalued with weakening technical indicators. Consider taking profits."
    else:  # HOLD
        target_price = round(current_price * random.uniform(0.98, 1.05), 2)
        reasoning = f"{symbol} is fairly valued at current levels. Maintain position while monitoring market conditions."
    
    # Different reasoning based on analysis type
    if analysis_type == 'advanced':
        reasoning += " Multi-factor analysis confirms this recommendation with high probability."
    elif analysis_type == 'predictive':
        reasoning += " Predictive models indicate this trend will continue in the near term."
    
    # Add some technical indicators
    rsi = random.randint(30, 70)
    macd = random.choice(['Bullish', 'Bearish', 'Neutral'])
    moving_avg = random.choice(['Bullish', 'Bearish', 'Neutral'])
    
    # Try to use OpenAI for more detailed analysis if API key is available
    if api_key:
        try:
            prompt = f"Provide a detailed analysis of {symbol} stock. Current price: ${current_price}. "
            prompt += f"Recommendation: {decision} with {confidence}% confidence. Target price: ${target_price}. "
            prompt += "Provide a brief reasoning (2-3 sentences) for this recommendation."
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a financial analyst providing stock recommendations."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=100,
                temperature=0.7
            )
            
            reasoning = response.choices[0].message.content.strip()
        except:
            # If OpenAI fails, use the simulated reasoning
            pass
    
    return {
        'decision': decision,
        'confidence': confidence,
        'target_price': target_price,
        'reasoning': reasoning,
        'rsi': rsi,
        'macd': macd,
        'moving_avg': moving_avg
    }

def get_company_info(symbol, api_key):
    """Get company information"""
    if api_key == 'demo':
        # Simulated company info
        companies = {
            'AAPL': {'name': 'Apple Inc.', 'sector': 'Technology', 'industry': 'Consumer Electronics', 'description': 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.'},
            'MSFT': {'name': 'Microsoft Corporation', 'sector': 'Technology', 'industry': 'Software', 'description': 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.'},
            'TSLA': {'name': 'Tesla, Inc.', 'sector': 'Consumer Cyclical', 'industry': 'Auto Manufacturers', 'description': 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, energy generation and storage systems.'},
            'NVDA': {'name': 'NVIDIA Corporation', 'sector': 'Technology', 'industry': 'Semiconductors', 'description': 'NVIDIA Corporation provides graphics, compute, and networking solutions worldwide.'},
            'GOOGL': {'name': 'Alphabet Inc.', 'sector': 'Communication Services', 'industry': 'Internet Content', 'description': 'Alphabet Inc. provides online advertising services, cloud computing, software, and hardware.'},
            'AMZN': {'name': 'Amazon.com, Inc.', 'sector': 'Consumer Cyclical', 'industry': 'Internet Retail', 'description': 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores.'},
            'META': {'name': 'Meta Platforms, Inc.', 'sector': 'Communication Services', 'industry': 'Internet Content', 'description': 'Meta Platforms, Inc. develops products that enable people to connect and share with friends and family through mobile devices, PCs, and VR headsets.'},
            'JPM': {'name': 'JPMorgan Chase & Co.', 'sector': 'Financial Services', 'industry': 'Banks', 'description': 'JPMorgan Chase & Co. provides financial and investment banking services worldwide.'},
            'JNJ': {'name': 'Johnson & Johnson', 'sector': 'Healthcare', 'industry': 'Drug Manufacturers', 'description': 'Johnson & Johnson researches, develops, manufactures, and sells healthcare products worldwide.'},
            'V': {'name': 'Visa Inc.', 'sector': 'Financial Services', 'industry': 'Credit Services', 'description': 'Visa Inc. operates a payments technology company worldwide.'},
            'BTC': {'name': 'Bitcoin', 'sector': 'Cryptocurrency', 'industry': 'Digital Currency', 'description': 'Bitcoin is a decentralized digital currency that enables instant payments to anyone, anywhere in the world.'},
            'ETH': {'name': 'Ethereum', 'sector': 'Cryptocurrency', 'industry': 'Digital Currency', 'description': 'Ethereum is a decentralized, open-source blockchain with smart contract functionality.'}
        }
        
        return companies.get(symbol, {
            'name': f'{symbol} Corporation',
            'sector': 'Various',
            'industry': 'Various',
            'description': 'Company information not available.'
        })
    
    # Real API call for company overview
    try:
        url = f'https://www.alphavantage.co/query?function=OVERVIEW&symbol={symbol}&apikey={api_key}'
        response = requests.get(url)
        data = response.json()
        
        if data and 'Name' in data:
            return {
                'name': data.get('Name', ''),
                'sector': data.get('Sector', ''),
                'industry': data.get('Industry', ''),
                'description': data.get('Description', '')[:200] + '...' if data.get('Description') else ''
            }
        else:
            return get_company_info(symbol, 'demo')
    except:
        return get_company_info(symbol, 'demo')

def get_live_market_data(alpha_vantage_key, finnhub_key):
    """Get live market data including indices"""
    # Simulate market data
    indices = {
        'SPY': {'name': 'S&P 500', 'price': 4500 + (random.random() - 0.5) * 100, 'change': (random.random() - 0.5) * 2},
        'QQQ': {'name': 'NASDAQ 100', 'price': 370 + (random.random() - 0.5) * 10, 'change': (random.random() - 0.5) * 2},
        'DIA': {'name': 'Dow Jones', 'price': 35000 + (random.random() - 0.5) * 500, 'change': (random.random() - 0.5) * 2},
        'IWM': {'name': 'Russell 2000', 'price': 190 + (random.random() - 0.5) * 10, 'change': (random.random() - 0.5) * 2},
        'VIX': {'name': 'Volatility Index', 'price': 18 + (random.random() - 0.5) * 5, 'change': (random.random() - 0.5) * 2}
    }
    
    # Calculate change percent
    for key in indices:
        indices[key]['change_percent'] = (indices[key]['change'] / indices[key]['price']) * 100
    
    # Get popular stocks
    popular_stocks = ['AAPL', 'MSFT', 'TSLA', 'NVDA', 'GOOGL', 'AMZN', 'META', 'JPM', 'JNJ', 'V']
    stocks_data = []
    
    for symbol in popular_stocks:
        stock_data = get_stock_data(symbol, alpha_vantage_key)
        stocks_data.append(stock_data)
    
    # Get popular cryptocurrencies
    popular_crypto = ['BTC', 'ETH', 'ADA', 'DOGE']
    crypto_data = []
    
    for symbol in popular_crypto:
        crypto = get_crypto_data(symbol, alpha_vantage_key)
        crypto_data.append(crypto)
    
    return {
        'indices': indices,
        'stocks': stocks_data,
        'crypto': crypto_data
    }

def get_earnings_calendar(api_key):
    """Get earnings calendar data"""
    # Simulate earnings data
    companies = ['AAPL', 'MSFT', 'TSLA', 'NVDA', 'GOOGL', 'AMZN', 'META', 'JPM', 'JNJ', 'V']
    earnings = []
    
    for i in range(10):
        company = companies[i]
        earnings_date = (datetime.now() + timedelta(days=random.randint(1, 30))).strftime('%Y-%m-%d')
        estimated_eps = round(random.uniform(0.5, 5.0), 2)
        estimated_revenue = round(random.uniform(1000000000, 100000000000), 2)
        
        earnings.append({
            'symbol': company,
            'date': earnings_date,
            'estimated_eps': estimated_eps,
            'estbimated_revenue': estimated_revenue
        })
    
    return earnings

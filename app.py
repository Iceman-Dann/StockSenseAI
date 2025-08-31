import os
from flask import Flask, render_template, request, jsonify, session
from dotenv import load_dotenv
import requests
import json
import random
from datetime import datetime, timedelta
import openai
from Utils import get_stock_data, analyze_stock_sentiment, generate_ai_recommendation, get_historical_data, get_company_info, get_live_market_data, get_crypto_data, get_earnings_calendar

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)

# API Keys
ALPHA_VANTAGE_KEY = os.getenv('ALPHA_VANTAGE_KEY', 'CHVDL5H219M0TC52')
NEWS_API_KEY = os.getenv('NEWS_API_KEY', 'dc517623172a43488715b3bf39110bf6')
OPENAI_KEY = os.getenv('OPENAI_KEY', '')
FINNHUB_KEY = os.getenv('FINNHUB_KEY', '')

# Configure OpenAI
openai.api_key = OPENAI_KEY

# Initialize session data
@app.before_request
def before_request():
    if 'watchlist' not in session:
        session['watchlist'] = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'GOOGL', 'AMZN', 'META', 'JPM', 'JNJ', 'V']
    if 'portfolio' not in session:
        session['portfolio'] = {
            'AAPL': {'shares': 10, 'avg_price': 150.25},
            'MSFT': {'shares': 5, 'avg_price': 280.50},
            'NVDA': {'shares': 8, 'avg_price': 420.75},
            'V': {'shares': 15, 'avg_price': 210.30}
        }
    if 'price_alerts' not in session:
        session['price_alerts'] = []

@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/dashboard')
def dashboard():
    return render_template('index.html')

# API Routes
@app.route('/api/stock/<symbol>')
def get_stock(symbol):
    try:
        data = get_stock_data(symbol, ALPHA_VANTAGE_KEY)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/crypto/<symbol>')
def get_crypto(symbol):
    try:
        data = get_crypto_data(symbol, ALPHA_VANTAGE_KEY)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        symbol = data.get('symbol', '')
        analysis_type = data.get('analysis_type', 'deep')
        
        if not symbol:
            return jsonify({'error': 'No symbol provided'}), 400
            
        # Get stock data
        stock_data = get_stock_data(symbol, ALPHA_VANTAGE_KEY)
        
        # Get historical data for chart
        historical_data = get_historical_data(symbol, ALPHA_VANTAGE_KEY)
        
        # Get AI analysis
        analysis = generate_ai_recommendation(symbol, OPENAI_KEY, analysis_type)
        
        # Get company info
        company_info = get_company_info(symbol, ALPHA_VANTAGE_KEY)
        
        # Get news sentiment
        news_sentiment = analyze_stock_sentiment(symbol, NEWS_API_KEY)
        
        return jsonify({
            'stock': stock_data,
            'analysis': analysis,
            'historical_data': historical_data,
            'company_info': company_info,
            'news_sentiment': news_sentiment
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/market/overview')
def market_overview():
    try:
        data = get_live_market_data(ALPHA_VANTAGE_KEY, FINNHUB_KEY)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/news')
def get_news():
    try:
        # Try to get real news if API key is available
        if NEWS_API_KEY and NEWS_API_KEY != 'news_demo_key':
            url = f'https://newsapi.org/v2/top-headlines?category=business&country=us&apiKey={NEWS_API_KEY}'
            response = requests.get(url)
            data = response.json()
            
            if data.get('articles'):
                articles = []
                for article in data['articles'][:10]:
                    articles.append({
                        'title': article.get('title', 'No title'),
                        'source': article.get('source', {}).get('name', 'Unknown'),
                        'time': article.get('publishedAt', ''),
                        'url': article.get('url', '#'),
                        'image': article.get('urlToImage', ''),
                        'description': article.get('description', 'No description available')
                    })
                return jsonify(articles)
        
        # Fallback to simulated news
        symbols = ['AAPL', 'MSFT', 'TSLA', 'NVDA', 'GOOGL', 'AMZN', 'META', 'JPM', 'JNJ', 'V']
        companies = ['Apple', 'Microsoft', 'Tesla', 'NVIDIA', 'Google', 'Amazon', 'Meta', 'JPMorgan', 'Johnson & Johnson', 'Visa']
        
        news_items = []
        for i in range(10):
            company_idx = random.randint(0, len(symbols)-1)
            sentiment = random.choice(['positive', 'neutral', 'negative'])
            
            if sentiment == 'positive':
                titles = [
                    f"{companies[company_idx]} Reports Strong Quarterly Earnings",
                    f"{companies[company_idx]} Stock Soars on New Product Launch",
                    f"Analysts Upgrade {companies[company_idx]} to Buy Rating",
                    f"{companies[company_idx]} Announces Breakthrough Innovation"
                ]
            elif sentiment == 'negative':
                titles = [
                    f"{companies[company_idx]} Faces Regulatory Challenges",
                    f"{companies[company_idx]} Stock Dips on Market Concerns",
                    f"Analysts Express Caution on {companies[company_idx]} Future",
                    f"{companies[company_idx]} Misses Revenue Expectations"
                ]
            else:
                titles = [
                    f"{companies[company_idx]} Holds Steady in Volatile Market",
                    f"{companies[company_idx]} Announces New Partnership",
                    f"Market Watchers Neutral on {companies[company_idx]} Prospects",
                    f"{companies[company_idx]} CEO Speaks at Industry Conference"
                ]
            
            news_items.append({
                'title': random.choice(titles),
                'source': random.choice(['Bloomberg', 'Reuters', 'CNBC', 'Wall Street Journal']),
                'time': (datetime.now() - timedelta(hours=random.randint(1, 12))).strftime('%Y-%m-%dT%H:%M:%SZ'),
                'url': '#',
                'image': '',
                'description': 'This is a sample news description for demonstration purposes.'
            })
        
        return jsonify(news_items)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/earnings')
def get_earnings():
    try:
        earnings = get_earnings_calendar(ALPHA_VANTAGE_KEY)
        return jsonify(earnings)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/watchlist')
def get_watchlist():
    return jsonify(session.get('watchlist', []))

@app.route('/api/watchlist/add', methods=['POST'])
def add_to_watchlist():
    try:
        data = request.get_json()
        symbol = data.get('symbol', '').upper()
        
        if not symbol:
            return jsonify({'error': 'No symbol provided'}), 400
        
        watchlist = session.get('watchlist', [])
        if symbol not in watchlist and len(watchlist) < 20:
            watchlist.append(symbol)
            session['watchlist'] = watchlist
        
        return jsonify({'success': True, 'watchlist': watchlist})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/watchlist/remove/<symbol>')
def remove_from_watchlist(symbol):
    try:
        watchlist = session.get('watchlist', [])
        if symbol in watchlist:
            watchlist.remove(symbol)
            session['watchlist'] = watchlist
        
        return jsonify({'success': True, 'watchlist': watchlist})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/portfolio')
def get_portfolio():
    try:
        portfolio = session.get('portfolio', {})
        portfolio_value = 0
        portfolio_data = []
        
        for symbol, holdings in portfolio.items():
            stock_data = get_stock_data(symbol, ALPHA_VANTAGE_KEY)
            current_price = stock_data.get('price', 0)
            value = current_price * holdings['shares']
            cost = holdings['avg_price'] * holdings['shares']
            gain_loss = value - cost
            gain_loss_percent = (gain_loss / cost) * 100 if cost > 0 else 0
            
            portfolio_value += value
            
            portfolio_data.append({
                'symbol': symbol,
                'shares': holdings['shares'],
                'avg_price': holdings['avg_price'],
                'current_price': current_price,
                'value': value,
                'gain_loss': gain_loss,
                'gain_loss_percent': gain_loss_percent
            })
        
        # Calculate overall portfolio performance
        total_cost = sum([h['avg_price'] * h['shares'] for h in portfolio.values()])
        total_gain_loss = portfolio_value - total_cost
        total_gain_loss_percent = (total_gain_loss / total_cost) * 100 if total_cost > 0 else 0
        
        return jsonify({
            'portfolio': portfolio_data,
            'total_value': portfolio_value,
            'total_gain_loss': total_gain_loss,
            'total_gain_loss_percent': total_gain_loss_percent
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/portfolio/add', methods=['POST'])
def add_to_portfolio():
    try:
        data = request.get_json()
        symbol = data.get('symbol', '').upper()
        shares = int(data.get('shares', 0))
        avg_price = float(data.get('avg_price', 0))
        
        if not symbol or shares <= 0 or avg_price <= 0:
            return jsonify({'error': 'Invalid data provided'}), 400
        
        portfolio = session.get('portfolio', {})
        if symbol in portfolio:
            # Update existing holding
            total_shares = portfolio[symbol]['shares'] + shares
            total_cost = (portfolio[symbol]['shares'] * portfolio[symbol]['avg_price']) + (shares * avg_price)
            portfolio[symbol]['avg_price'] = total_cost / total_shares
            portfolio[symbol]['shares'] = total_shares
        else:
            # Add new holding
            portfolio[symbol] = {
                'shares': shares,
                'avg_price': avg_price
            }
        
        session['portfolio'] = portfolio
        
        return jsonify({'success': True, 'portfolio': portfolio})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/portfolio/remove/<symbol>')
def remove_from_portfolio(symbol):
    try:
        portfolio = session.get('portfolio', {})
        if symbol in portfolio:
            del portfolio[symbol]
            session['portfolio'] = portfolio
        
        return jsonify({'success': True, 'portfolio': portfolio})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/alerts', methods=['GET', 'POST'])
def handle_alerts():
    try:
        if request.method == 'POST':
            data = request.get_json()
            symbol = data.get('symbol', '').upper()
            target_price = float(data.get('target_price', 0))
            alert_type = data.get('alert_type', 'price')
            
            if not symbol or target_price <= 0:
                return jsonify({'error': 'Invalid data provided'}), 400
            
            alerts = session.get('price_alerts', [])
            alerts.append({
                'symbol': symbol,
                'target_price': target_price,
                'alert_type': alert_type,
                'created_at': datetime.now().isoformat(),
                'triggered': False
            })
            
            session['price_alerts'] = alerts
            return jsonify({'success': True, 'alerts': alerts})
        else:
            # Check and trigger alerts
            alerts = session.get('price_alerts', [])
            triggered_alerts = []
            
            for alert in alerts:
                if not alert['triggered']:
                    stock_data = get_stock_data(alert['symbol'], ALPHA_VANTAGE_KEY)
                    current_price = stock_data.get('price', 0)
                    
                    if (alert['alert_type'] == 'price_above' and current_price >= alert['target_price']) or \
                       (alert['alert_type'] == 'price_below' and current_price <= alert['target_price']):
                        alert['triggered'] = True
                        alert['triggered_at'] = datetime.now().isoformat()
                        alert['triggered_price'] = current_price
                        triggered_alerts.append(alert)
            
            session['price_alerts'] = alerts
            return jsonify({'alerts': alerts, 'triggered_alerts': triggered_alerts})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat_with_ai():
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Use OpenAI API for chat
        if OPENAI_KEY:
            try:
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a financial AI assistant specializing in stock market analysis, portfolio management, and investment strategies. Provide concise, helpful advice."},
                        {"role": "user", "content": message}
                    ],
                    max_tokens=150,
                    temperature=0.7
                )
                
                ai_response = response.choices[0].message.content.strip()
                return jsonify({'response': ai_response})
            except Exception as e:
                # Fallback if OpenAI API fails
                return jsonify({'response': "I'm currently experiencing technical difficulties. Please try again later."})
        
        # Fallback responses if no OpenAI key
        responses = {
            'hello': "Hello! I'm your AI trading assistant. How can I help you today?",
            'how are you': "I'm functioning optimally, ready to analyze the markets for you!",
            'what stocks should i buy': "Based on current market conditions, I recommend looking into technology stocks like AAPL and MSFT, which show strong fundamentals.",
            'is now a good time to invest': "Market timing is challenging. Consider dollar-cost averaging and focusing on long-term trends rather than short-term fluctuations.",
            'what is your analysis of the market': "Current market indicators suggest moderate volatility with growth potential in technology and healthcare sectors.",
            'how should i diversify my portfolio': "A well-diversified portfolio typically includes stocks from different sectors, bonds, and possibly some commodities or real estate.",
            'default': "I'm designed to provide stock market analysis and investment insights. Could you please ask a more specific question about trading or investments?"
        }
        
        message_lower = message.lower()
        response = responses['default']
        
        for key in responses:
            if key in message_lower:
                response = responses[key]
                break
        
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/theme', methods=['POST'])
def set_theme():
    try:
        data = request.get_json()
        theme = data.get('theme', 'dark')
        
        if theme in ['dark', 'light']:
            session['theme'] = theme
            return jsonify({'success': True, 'theme': theme})
        else:
            return jsonify({'error': 'Invalid theme'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

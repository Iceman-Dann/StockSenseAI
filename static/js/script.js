// API Configuration
const API_ENDPOINTS = {
    stock: '/api/stock/',
    crypto: '/api/crypto/',
    analyze: '/api/analyze',
    news: '/api/news',
    earnings: '/api/earnings',
    watchlist: '/api/watchlist',
    watchlistAdd: '/api/watchlist/add',
    watchlistRemove: '/api/watchlist/remove/',
    portfolio: '/api/portfolio',
    portfolioAdd: '/api/portfolio/add',
    portfolioRemove: '/api/portfolio/remove/',
    marketOverview: '/api/market/overview',
    chat: '/api/chat',
    alerts: '/api/alerts'
};

// Global variables
let stockChart = null;
let portfolioChart = null;
let volumeChart = null;
let technicalChart = null;
let marketData = {};
let watchlistData = [];
let portfolioData = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startRealTimeUpdates();
});

function initializeApp() {
    updatePortfolioMetrics();
    loadMarketOverview();
    loadCryptoOverview();
    loadWatchlist();
    loadPortfolio();
    loadNewsFeed();
    loadEarningsCalendar();
    setupPriceAlerts();
    updateMarketPulse();
    updateEconomicCalendar();
    generateRecommendations();
    updateRiskAnalysis();
    
    // Initialize portfolio chart
    initPortfolioChart();
    
    console.log('StockSense AI Dashboard initialized successfully');
}

function setupEventListeners() {
    // AI Analysis
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', performAIAnalysis);
    }

    // AI Chat
    const aiAssistant = document.getElementById('aiAssistant');
    const closeChat = document.getElementById('closeChat');
    const sendMessage = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');

    if (aiAssistant) aiAssistant.addEventListener('click', openAIChat);
    if (closeChat) closeChat.addEventListener('click', closeAIChat);
    if (sendMessage) sendMessage.addEventListener('click', sendAIMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendAIMessage();
        });
    }
    
    // Watchlist management
    const addStockBtn = document.getElementById('addStockBtn');
    if (addStockBtn) {
        addStockBtn.addEventListener('click', addToWatchlist);
    }
    
    const refreshWatchlistBtn = document.getElementById('refreshWatchlistBtn');
    if (refreshWatchlistBtn) {
        refreshWatchlistBtn.addEventListener('click', loadWatchlist);
    }
    
    // Portfolio management
    const addPortfolioBtn = document.getElementById('addPortfolioBtn');
    if (addPortfolioBtn) {
        addPortfolioBtn.addEventListener('click', addToPortfolio);
    }
    
    // News refresh
    const refreshNewsBtn = document.getElementById('refreshNewsBtn');
    if (refreshNewsBtn) {
        refreshNewsBtn.addEventListener('click', loadNewsFeed);
    }
    
    // Alert management
    const addAlertBtn = document.getElementById('addAlertBtn');
    if (addAlertBtn) {
        addAlertBtn.addEventListener('click', addPriceAlert);
    }
}

// Real-time updates
function startRealTimeUpdates() {
    // Update market data every 30 seconds
    setInterval(() => {
        updatePortfolioMetrics();
        loadMarketOverview();
        loadCryptoOverview();
        loadWatchlist();
        loadPortfolio();
    }, 30000);

    // Update news every 5 minutes
    setInterval(() => {
        loadNewsFeed();
        updateMarketPulse();
        loadEarningsCalendar();
        setupPriceAlerts();
    }, 300000);
}

async function updatePortfolioMetrics() {
    try {
        const response = await fetch(API_ENDPOINTS.portfolio);
        const data = await response.json();
        
        if (data.error) {
            console.error('Error fetching portfolio:', data.error);
            return;
        }
        
        document.getElementById('totalValue').textContent = '$' + data.total_value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        
        // Calculate daily change (simulated)
        const dailyChangePercent = ((Math.random() - 0.5) * 6).toFixed(2);
        document.getElementById('dailyChange').textContent = (dailyChangePercent >= 0 ? '+' : '') + dailyChangePercent + '%';
        document.getElementById('dailyChange').className = dailyChangePercent >= 0 ? 'metric-value stock-change-positive' : 'metric-value stock-change-negative';
        
        // AI Score (simulated)
        const aiScore = Math.floor(Math.random() * 30 + 70);
        document.getElementById('aiScore').textContent = aiScore + '/100';
        
        // Risk Level (simulated)
        const riskLevels = ['Low', 'Medium', 'High'];
        const risk = riskLevels[Math.floor(Math.random() * 3)];
        document.getElementById('riskLevel').textContent = risk;
    } catch (error) {
        console.error('Error updating portfolio metrics:', error);
    }
}

async function loadMarketOverview() {
    const container = document.getElementById('liveMarketOverview');
    if (!container) return;

    try {
        const response = await fetch(API_ENDPOINTS.marketOverview);
        const marketData = await response.json();
        
        if (marketData.error) {
            container.innerHTML = '<div class="text-center py-4 text-muted">Market data temporarily unavailable</div>';
            return;
        }
        
        let html = '<div class="row">';
        
        marketData.stocks.forEach(stock => {
            const changeClass = stock.change >= 0 ? 'stock-change-positive' : 'stock-change-negative';
            
            html += '<div class="col-md-6 col-lg-4 mb-3">' +
                '<div class="metric-card" style="cursor: pointer;" onclick="quickAnalyze(\'' + stock.symbol + '\')">' +
                    '<div class="d-flex justify-content-between align-items-center">' +
                        '<div>' +
                            '<strong>' + stock.symbol + '</strong>' +
                            '<div class="metric-value" style="font-size: 1.5rem;">$' + stock.price.toFixed(2) + '</div>' +
                        '</div>' +
                        '<div class="text-end">' +
                            '<div class="' + changeClass + '" style="font-weight: 600;">' +
                                (stock.change >= 0 ? '+' : '') + stock.change.toFixed(2) +
                            '</div>' +
                            '<div class="' + changeClass + '" style="font-size: 0.9rem;">' +
                                (stock.change_percent >= 0 ? '+' : '') + stock.change_percent.toFixed(2) + '%' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        // Update market sentiment
        const sentimentValue = Math.floor(Math.random() * 100);
        document.getElementById('sentimentBar').style.width = sentimentValue + '%';
        
        const sentimentText = sentimentValue > 70 ? 'Bullish' : sentimentValue > 40 ? 'Neutral' : 'Bearish';
        document.getElementById('marketSentiment').innerHTML = 'AI detects <strong>' + sentimentText + '</strong> market sentiment (' + sentimentValue + '/100)';
    } catch (error) {
        console.error('Error loading market overview:', error);
        container.innerHTML = '<div class="text-center py-4 text-muted">Error loading market data</div>';
    }
}

async function loadCryptoOverview() {
    const container = document.getElementById('cryptoOverview');
    if (!container) return;

    const symbols = ['BTC', 'ETH', 'ADA', 'DOGE'];
    let html = '';

    for (const symbol of symbols) {
        try {
            const response = await fetch(API_ENDPOINTS.crypto + symbol);
            const data = await response.json();
            
            if (data.error) {
                html += '<div class="col-md-3 col-6 mb-3">' +
                    '<div class="metric-card">' +
                        '<div class="text-center">' +
                            '<strong>' + symbol + '</strong>' +
                            '<div class="text-muted">Data unavailable</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
                continue;
            }
            
            const changeClass = data.change >= 0 ? 'stock-change-positive' : 'stock-change-negative';
            
            html += '<div class="col-md-3 col-6 mb-3">' +
                '<div class="metric-card" style="cursor: pointer;" onclick="analyzeCrypto(\'' + symbol + '\')">' +
                    '<div class="d-flex justify-content-between align-items-center">' +
                        '<div>' +
                            '<strong>' + symbol + '</strong>' +
                            '<span class="crypto-badge ms-1">Crypto</span>' +
                            '<div class="metric-value" style="font-size: 1.2rem;">$' + data.price.toFixed(2) + '</div>' +
                        '</div>' +
                        '<div class="text-end">' +
                            '<div class="' + changeClass + '" style="font-weight: 600;">' +
                                (data.change >= 0 ? '+' : '') + data.change.toFixed(2) +
                            '</div>' +
                            '<div class="' + changeClass + '" style="font-size: 0.9rem;">' +
                                (data.change_percent >= 0 ? '+' : '') + data.change_percent.toFixed(2) + '%' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        } catch (error) {
            console.error('Error fetching ' + symbol + ':', error);
            html += '<div class="col-md-3 col-6 mb-3">' +
                '<div class="metric-card">' +
                    '<div class="text-center">' +
                        '<strong>' + symbol + '</strong>' +
                        '<div class="text-muted">Data unavailable</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }
    }
    
    container.innerHTML = html;
}

async function loadWatchlist() {
    const table = document.getElementById('watchlistTable');
    if (!table) return;

    try {
        // Get watchlist from server
        const watchlistResponse = await fetch(API_ENDPOINTS.watchlist);
        const watchlist = await watchlistResponse.json();
        
        if (watchlist.error) {
            table.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Error loading watchlist</td></tr>';
            return;
        }
        
        let html = '';
        
        for (const symbol of watchlist) {
            try {
                const stockResponse = await fetch(API_ENDPOINTS.stock + symbol);
                const stockData = await stockResponse.json();
                
                if (stockData.error) {
                    continue;
                }
                
                // Get AI analysis for the stock
                const analysisResponse = await fetch(API_ENDPOINTS.analyze, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        symbol: symbol,
                        analysis_type: 'quick'
                    })
                });
                
                const analysis = await analysisResponse.json();
                
                const changeClass = stockData.change >= 0 ? 'stock-change-positive' : 'stock-change-negative';
                
                html += '<tr>' +
                    '<td><strong>' + symbol + '</strong></td>' +
                    '<td>$' + stockData.price.toFixed(2) + '</td>' +
                    '<td class="' + changeClass + '">' + (stockData.change >= 0 ? '+' : '') + stockData.change.toFixed(2) + ' (' + (stockData.change_percent >= 0 ? '+' : '') + stockData.change_percent.toFixed(2) + '%)</td>' +
                    '<td><span class="badge" style="background: var(--ai-glow); color: #000;">' + analysis.analysis.confidence + '/100</span></td>' +
                    '<td><span class="badge ' + (analysis.analysis.decision === 'BUY' ? 'bg-success' : analysis.analysis.decision === 'SELL' ? 'bg-danger' : 'bg-warning') + '">' + analysis.analysis.decision + '</span></td>' +
                    '<td><span class="badge ' + (analysis.analysis.confidence > 80 ? 'bg-success' : analysis.analysis.confidence > 60 ? 'bg-warning' : 'bg-danger') + '">' + (analysis.analysis.confidence > 80 ? 'Low' : analysis.analysis.confidence > 60 ? 'Medium' : 'High') + '</span></td>' +
                    '<td>' +
                        '<button class="btn btn-ai btn-sm me-1" onclick="analyzeStock(\'' + symbol + '\')">' +
                            '<i class="fas fa-brain"></i>' +
                        '</button>' +
                        '<button class="btn btn-outline-danger btn-sm" onclick="removeFromWatchlist(\'' + symbol + '\')">' +
                            '<i class="fas fa-trash"></i>' +
                        '</button>' +
                    '</td>' +
                '</tr>';
            } catch (error) {
                console.error('Error loading ' + symbol + ':', error);
            }
        }
        
        if (!html) {
            html = '<tr><td colspan="7" class="text-center py-4 text-muted">No stocks in watchlist</td></tr>';
        }
        
        table.innerHTML = html;
    } catch (error) {
        console.error('Error loading watchlist:', error);
        table.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Error loading watchlist</td></tr>';
    }
}

async function loadPortfolio() {
    const table = document.getElementById('portfolioTable');
    if (!table) return;

    try {
        const response = await fetch(API_ENDPOINTS.portfolio);
        const data = await response.json();
        
        if (data.error) {
            table.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Error loading portfolio</td></tr>';
            return;
        }
        
        let html = '';
        
        for (const holding of data.portfolio) {
            const changeClass = holding.gain_loss >= 0 ? 'stock-change-positive' : 'stock-change-negative';
            
            html += '<tr>' +
                '<td><strong>' + holding.symbol + '</strong></td>' +
                '<td>' + holding.shares + '</td>' +
                '<td>$' + holding.avg_price.toFixed(2) + '</td>' +
                '<td>$' + holding.current_price.toFixed(2) + '</td>' +
                '<td>$' + holding.value.toFixed(2) + '</td>' +
                '<td class="' + changeClass + '">' +
                    (holding.gain_loss >= 0 ? '+' : '') + '$' + holding.gain_loss.toFixed(2) + ' (' + (holding.gain_loss_percent >= 0 ? '+' : '') + holding.gain_loss_percent.toFixed(2) + '%)' +
                '</td>' +
                '<td>' +
                    '<button class="btn btn-outline-danger btn-sm" onclick="removeFromPortfolio(\'' + holding.symbol + '\')">' +
                        '<i class="fas fa-trash"></i>' +
                    '</button>' +
                '</td>' +
            '</tr>';
        }
        
        // Add summary row
        html += '<tr class="table-active">' +
            '<td colspan="4"><strong>Total</strong></td>' +
            '<td><strong>$' + data.total_value.toFixed(2) + '</strong></td>' +
            '<td class="' + (data.total_gain_loss >= 0 ? 'stock-change-positive' : 'stock-change-negative') + '">' +
                '<strong>' + (data.total_gain_loss >= 0 ? '+' : '') + '$' + data.total_gain_loss.toFixed(2) + ' (' + (data.total_gain_loss_percent >= 0 ? '+' : '') + data.total_gain_loss_percent.toFixed(2) + '%)</strong>' +
            '</td>' +
            '<td></td>' +
        '</tr>';
        
        table.innerHTML = html;
    } catch (error) {
        console.error('Error loading portfolio:', error);
        table.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Error loading portfolio</td></tr>';
    }
}

async function addToWatchlist() {
    const input = document.getElementById('addStockInput');
    const symbol = input.value.trim().toUpperCase();
    
    if (!symbol) {
        showToast('Please enter a stock symbol', 'error');
        return;
    }
    
    try {
        const response = await fetch(API_ENDPOINTS.watchlistAdd, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ symbol: symbol })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showToast('Error adding to watchlist: ' + data.error, 'error');
            return;
        }
        
        showToast('Added ' + symbol + ' to watchlist', 'success');
        input.value = '';
        loadWatchlist();
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        showToast('Error adding to watchlist', 'error');
    }
}

async function removeFromWatchlist(symbol) {
    try {
        const response = await fetch(API_ENDPOINTS.watchlistRemove + symbol);
        const data = await response.json();
        
        if (data.error) {
            showToast('Error removing from watchlist: ' + data.error, 'error');
            return;
        }
        
        showToast('Removed ' + symbol + ' from watchlist', 'success');
        loadWatchlist();
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        showToast('Error removing from watchlist', 'error');
    }
}

async function addToPortfolio() {
    const symbol = document.getElementById('portfolioSymbol').value.trim().toUpperCase();
    const shares = parseInt(document.getElementById('portfolioShares').value);
    const price = parseFloat(document.getElementById('portfolioPrice').value);
    
    if (!symbol || isNaN(shares) || shares <= 0 || isNaN(price) || price <= 0) {
        showToast('Please enter valid portfolio data', 'error');
        return;
    }
    
    try {
        const response = await fetch(API_ENDPOINTS.portfolioAdd, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                symbol: symbol,
                shares: shares,
                avg_price: price
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showToast('Error adding to portfolio: ' + data.error, 'error');
            return;
        }
        
        showToast('Added ' + symbol + ' to portfolio', 'success');
        document.getElementById('portfolioSymbol').value = '';
        document.getElementById('portfolioShares').value = '';
        document.getElementById('portfolioPrice').value = '';
        loadPortfolio();
        updatePortfolioMetrics();
    } catch (error) {
        console.error('Error adding to portfolio:', error);
        showToast('Error adding to portfolio', 'error');
    }
}

async function removeFromPortfolio(symbol) {
    try {
        const response = await fetch(API_ENDPOINTS.portfolioRemove + symbol);
        const data = await response.json();
        
        if (data.error) {
            showToast('Error removing from portfolio: ' + data.error, 'error');
            return;
        }
        
        showToast('Removed ' + symbol + ' from portfolio', 'success');
        loadPortfolio();
        updatePortfolioMetrics();
    } catch (error) {
        console.error('Error removing from portfolio:', error);
        showToast('Error removing from portfolio', 'error');
    }
}

async function loadNewsFeed() {
    const container = document.getElementById('newsFeed');
    if (!container) return;

    try {
        const response = await fetch(API_ENDPOINTS.news);
        const newsItems = await response.json();
        
        if (newsItems.error) {
            //container.innerHTML = '<div class="text-center py-4 text-muted'>News temporarily unavailable</div>';
            return;
        }
        
        let html = '';
        
        newsItems.forEach(item => {
            const time = new Date(item.time).toLocaleTimeString();
            const impact = item.impact || 'Medium';
            const impactColor = impact === 'High' ? 'danger' : impact === 'Medium' ? 'warning' : 'info';
            
            html += '<div class="news-item">' +
                '<div class="d-flex justify-content-between align-items-start mb-2">' +
                    '<h6 class="mb-1">' + item.title + '</h6>' +
                    '<span class="badge bg-' + impactColor + '">' + impact + '</span>' +
                '</div>' +
                '<p class="text-muted mb-2" style="font-size: 0.9rem;">' + (item.description || 'No description available') + '</p>' +
                '<div class="d-flex justify-content-between align-items-center">' +
                    '<small class="text-muted">' + item.source + ' • ' + time + '</small>' +
                '</div>' +
            '</div>';
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading news:', error);
        //container.innerHTML = '<div class="text-center py-4 text-muted'>Error loading news</div>';
    }
}

async function loadEarningsCalendar() {
    const container = document.getElementById('earningsCalendar');
    if (!container) return;

    try {
        const response = await fetch(API_ENDPOINTS.earnings);
        const earnings = await response.json();
        
        if (earnings.error) {
            container.innerHTML = '<div class="text-center py-4 text-muted">Earnings data temporarily unavailable</div>';
            return;
        }
        
        let html = '<div class="table-responsive"><table class="table table-hover"><thead><tr><th>Symbol</th><th>Date</th><th>Estimated EPS</th><th>Estimated Revenue</th><th>Actions</th></tr></thead><tbody>';
        
        for (const earning of earnings) {
            html += '<tr>' +
                '<td><strong>' + earning.symbol + '</strong></td>' +
                '<td>' + earning.date + '</td>' +
                '<td>$' + earning.estimated_eps + '</td>' +
                '<td>$' + earning.estimated_revenue.toLocaleString() + '</td>' +
                '<td>' +
                    '<button class="btn btn-ai btn-sm me-1" onclick="analyzeStock(\'' + earning.symbol + '\')">' +
                        '<i class="fas fa-brain"></i>' +
                    '</button>' +
                    '<button class="btn btn-outline-primary btn-sm" onclick="addToWatchlist(\'' + earning.symbol + '\')">' +
                        '<i class="fas fa-plus"></i> Watchlist' +
                    '</button>' +
                '</td>' +
            '</tr>';
        }
        
        html += '</tbody></table></div>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading earnings:', error);
        //container.innerHTML = '<div class="text-center py-4 text-muted'>Error loading earnings data</div>';
    }
}

async function setupPriceAlerts() {
    const container = document.getElementById('priceAlerts');
    if (!container) return;
    
    try {
        const response = await fetch(API_ENDPOINTS.alerts);
        const data = await response.json();
        
        if (data.error) {
            container.innerHTML = '<div class="text-center py-3 text-muted">Error loading alerts</div>';
            return;
        }
        
        let html = '';
        
        if (data.alerts && data.alerts.length > 0) {
            data.alerts.forEach(alert => {
                html += '<div class="alert-item ' + (alert.triggered ? 'triggered' : '') + '">' +
                    '<div class="d-flex justify-content-between align-items-center">' +
                        '<div>' +
                            '<strong>' + alert.symbol + '</strong>' +
                            '<div>' + (alert.alert_type === 'price_above' ? 'Above' : 'Below') + ' $' + alert.target_price + '</div>' +
                        '</div>' +
                        '<div>' +
                            '<span class="badge ' + (alert.triggered ? 'bg-success' : 'bg-warning') + '">' +
                                (alert.triggered ? 'Triggered' : 'Active') +
                            '</span>' +
                        '</div>' +
                    '</div>' +
                    (alert.triggered ? 
                        '<div class="mt-2">' +
                            '<small>Triggered at $' + alert.triggered_price + ' on ' + new Date(alert.triggered_at).toLocaleString() + '</small>' +
                        '</div>' 
                    : '') +
                '</div>';
            });
        } else {
            html = '<div class="text-center py-3 text-muted">No alerts set up yet</div>';
        }
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading alerts:', error);
        //container.innerHTML = '<div class="text-center py-3 text-muted'>Error loading alerts</div>';
    }
}

async function addPriceAlert() {
    const symbol = document.getElementById('alertSymbol').value.trim().toUpperCase();
    const targetPrice = parseFloat(document.getElementById('alertPrice').value);
    const alertType = document.getElementById('alertType').value;
    
    if (!symbol || isNaN(targetPrice) || targetPrice <= 0) {
        showToast('Please enter valid alert data', 'error');
        return;
    }
    
    try {
        const response = await fetch(API_ENDPOINTS.alerts, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                symbol: symbol,
                target_price: targetPrice,
                alert_type: alertType
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showToast('Error adding alert: ' + data.error, 'error');
            return;
        }
        
        showToast('Price alert added successfully', 'success');
        document.getElementById('alertSymbol').value = '';
        document.getElementById('alertPrice').value = '';
        setupPriceAlerts();
    } catch (error) {
        console.error('Error adding alert:', error);
        showToast('Error adding alert', 'error');
    }
}

function updateMarketPulse() {
    const container = document.getElementById('marketPulse');
    if (!container) return;

    const pulseData = [
        { name: 'S&P 500', value: '+0.8%', trend: 'up' },
        { name: 'NASDAQ', value: '+1.2%', trend: 'up' },
        { name: 'Dow Jones', value: '+0.5%', trend: 'up' },
        { name: 'VIX', value: '-2.3%', trend: 'down' },
        { name: 'USD Index', value: '+0.3%', trend: 'up' },
        { name: 'Gold', value: '-0.2%', trend: 'down' }
    ];

    let html = '';
    pulseData.forEach(item => {
        const trendClass = item.trend === 'up' ? 'stock-change-positive' : 'stock-change-negative';
        const trendIcon = item.trend === 'up' ? 'fa-arrow-up' : 'fa-arrow-down';
        
        html += '<div class="d-flex justify-content-between align-items-center mb-3">' +
            '<div>' +
                '<strong>' + item.name + '</strong>' +
            '</div>' +
            '<div class="text-end">' +
                '<span class="' + trendClass + '">' +
                    item.value + ' <i class="fas ' + trendIcon + ' ms-1"></i>' +
                '</span>' +
            '</div>' +
        '</div>';
    });
    
    container.innerHTML = html;
}

function updateEconomicCalendar() {
    const container = document.getElementById('economicCalendar');
    if (!container) return;

    const events = [
        { event: 'Fed Interest Rate Decision', time: 'Tomorrow 2:00 PM', impact: 'High' },
        { event: 'CPI Inflation Data', time: 'Wed 8:30 AM', impact: 'High' },
        { event: 'Weekly Jobless Claims', time: 'Thu 8:30 AM', impact: 'Medium' },
        { event: 'GDP Growth Rate', time: 'Fri 8:30 AM', impact: 'High' },
        { event: 'Tech Earnings Season', time: 'Next Week', impact: 'Medium' }
    ];

    let html = '';
    events.forEach(item => {
        const impactColor = item.impact === 'High' ? 'danger' : 'warning';
        
        html += '<div class="mb-3">' +
            '<div class="d-flex justify-content-between align-items-center">' +
                '<strong style="font-size: 0.9rem;">' + item.event + '</strong>' +
                '<span class="badge bg-' + impactColor + '">' + item.impact + '</span>' +
            '</div>' +
            '<small class="text-muted">' + item.time + '</small>' +
        '</div>';
    });
    
    container.innerHTML = html;
}

async function performAIAnalysis() {
    const ticker = document.getElementById('aiTicker').value.trim().toUpperCase();
    const depth = document.getElementById('analysisDepth').value;
    const chartType = document.getElementById('chartType').value;
    
    if (!ticker) {
        showToast('Please enter a stock symbol', 'error');
        return;
    }

    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.innerHTML = '<div class="loading-ai me-2"></div>AI Analyzing...';
    analyzeBtn.disabled = true;

    const resultsSection = document.getElementById('analysisResults');
    resultsSection.style.display = 'block';

    try {
        const response = await fetch(API_ENDPOINTS.analyze, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                symbol: ticker,
                analysis_type: depth
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showToast('Analysis error: ' + data.error, 'error');
            return;
        }
        
        // Update UI with analysis results
        document.getElementById('aiDecision').textContent = data.analysis.decision;
        document.getElementById('aiDecision').className = 'badge fs-6 ' + (data.analysis.decision === 'BUY' ? 'bg-success' : data.analysis.decision === 'SELL' ? 'bg-danger' : 'bg-warning');
        document.getElementById('aiConfidence').textContent = data.analysis.confidence + '%';
        document.getElementById('confidenceBar').style.width = data.analysis.confidence + '%';
        document.getElementById('currentPrice').textContent = '$' + data.stock.price.toFixed(2);
        document.getElementById('targetPrice').textContent = '$' + data.analysis.target_price;
        document.getElementById('aiReasoning').textContent = data.analysis.reasoning;
        
        // Update technical indicators
        document.getElementById('rsiValue').textContent = data.analysis.rsi;
        document.getElementById('rsiValue').className = 'indicator-value ' + (data.analysis.rsi > 70 ? 'indicator-bad' : data.analysis.rsi < 30 ? 'indicator-good' : 'indicator-neutral');
        document.getElementById('macdValue').textContent = data.analysis.macd;
        document.getElementById('macdValue').className = 'indicator-value ' + (data.analysis.macd === 'Bullish' ? 'indicator-good' : data.analysis.macd === 'Bearish' ? 'indicator-bad' : 'indicator-neutral');
        document.getElementById('movingAvgValue').textContent = data.analysis.moving_avg;
        document.getElementById('movingAvgValue').className = 'indicator-value ' + (data.analysis.moving_avg === 'Bullish' ? 'indicator-good' : data.analysis.moving_avg === 'Bearish' ? 'indicator-bad' : 'indicator-neutral');
        
        // Create charts
        createStockChart(ticker, data.historical_data, chartType);
        createVolumeChart(ticker, data.historical_data);
        createTechnicalIndicatorsChart(ticker, data.historical_data);
        
        // Load related news
        loadRelatedNews(ticker);
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Analysis error:', error);
        showToast('Analysis temporarily unavailable', 'error');
        document.getElementById('aiReasoning').textContent = 'Analysis temporarily unavailable. Please try again.';
    } finally {
        analyzeBtn.innerHTML = '<i class="fas fa-brain me-2"></i>Analyze with AI';
        analyzeBtn.disabled = false;
    }
}

function createStockChart(symbol, data, chartType) {
    const ctx = document.getElementById('stockChart');
    if (!ctx) return;

    if (stockChart) {
        stockChart.destroy();
    }

    const labels = data.map(item => item.date);
    const prices = data.map(item => item.price);
    
    const chartConfig = {
        type: chartType === 'area' ? 'line' : chartType,
        data: {
            labels: labels,
            datasets: [{
                label: symbol + ' Price',
                data: prices,
                borderColor: '#2962ff',
                backgroundColor: chartType === 'area' ? 'rgba(41, 98, 255, 0.1)' : 'rgba(41, 98, 255, 0.5)',
                borderWidth: 2,
                pointRadius: 2,
                fill: chartType === 'area',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(41, 98, 255, 0.5)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff',
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    };

    stockChart = new Chart(ctx, chartConfig);
}

function createVolumeChart(symbol, data) {
    const ctx = document.getElementById('volumeChart');
    if (!ctx) return;

    if (volumeChart) {
        volumeChart.destroy();
    }

    const labels = data.map(item => item.date);
    const volumes = data.map(item => item.volume);
    
    const chartConfig = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: symbol + ' Volume',
                data: volumes,
                backgroundColor: 'rgba(41, 98, 255, 0.5)',
                borderColor: '#2962ff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff',
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    };

    volumeChart = new Chart(ctx, chartConfig);
}

function createTechnicalIndicatorsChart(symbol, data) {
    const ctx = document.getElementById('technicalChart');
    if (!ctx) return;

    if (technicalChart) {
        technicalChart.destroy();
    }

    // Simulate technical indicators
    const labels = data.map(item => item.date);
    const rsi = Array.from({length: data.length}, () => Math.random() * 100);
    const macd = Array.from({length: data.length}, () => (Math.random() - 0.5) * 10);
    
    const chartConfig = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'RSI',
                    data: rsi,
                    borderColor: '#00c853',
                    backgroundColor: 'rgba(0, 200, 83, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    yAxisID: 'y'
                },
                {
                    label: 'MACD',
                    data: macd,
                    borderColor: '#2962ff',
                    backgroundColor: 'rgba(41, 98, 255, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    };

    technicalChart = new Chart(ctx, chartConfig);
}

function initPortfolioChart() {
    const ctx = document.getElementById('portfolioChart');
    if (!ctx) return;

    const portfolioData = {
        labels: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer Goods'],
        datasets: [{
            data: [35, 25, 20, 10, 10],
            backgroundColor: [
                '#2962ff',
                '#00c853',
                '#ff9800',
                '#f44336',
                '#9c27b0'
            ],
            borderWidth: 0
        }]
    };

    portfolioChart = new Chart(ctx, {
        type: 'doughnut',
        data: portfolioData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

async function loadRelatedNews(symbol) {
    const container = document.getElementById('relatedNews');
    if (!container) return;

    container.innerHTML = '<div class="text-center py-3">' +
        '<div class="loading-ai"></div>' +
        '<p>Finding news about ' + symbol + '...</p>' +
    '</div>';

    // In a real implementation, this would fetch news specific to the symbol
    // For demo, we'll use the general news endpoint
    try {
        const response = await fetch(API_ENDPOINTS.news);
        const newsItems = await response.json();
        
        if (newsItems.error) {
            container.innerHTML = '<p class="text-center">News temporarily unavailable</p>';
            return;
        }
        
        let html = '';
        
        for (let i = 0; i < Math.min(3, newsItems.length); i++) {
            const item = newsItems[i];
            const time = new Date(item.time).toLocaleDateString();
            
            html += '<div class="news-item">' +
                '<h6 style="font-size: 0.9rem;">' + item.title + '</h6>' +
                '<small class="text-muted">' + item.source + ' • ' + time + '</small>' +
            '</div>';
        }
        
        container.innerHTML = html || '<p class="text-center">No recent news found</p>';
    } catch (error) {
        console.error('Error loading related news:', error);
        container.innerHTML = '<p class="text-center">News temporarily unavailable</p>';
    }
}

function generateRecommendations() {
    const container = document.getElementById('aiRecommendations');
    if (!container) return;

    const recommendations = [
        {
            action: 'Consider reducing',
            target: 'Tech allocation',
            reason: 'High valuation concerns',
            confidence: 75
        },
        {
            action: 'Increase position in',
            target: 'Healthcare sector',
            reason: 'Aging population trend',
            confidence: 85
        },
        {
            action: 'Monitor closely',
            target: 'Energy stocks',
            reason: 'Volatile oil prices',
            confidence: 70
        }
    ];

    let html = '';
    recommendations.forEach(rec => {
        html += '<div class="mb-3 p-3" style="background: rgba(255, 255, 255, 0.05); border-radius: 10px;">' +
            '<div class="d-flex justify-content-between align-items-center mb-2">' +
                '<strong style="font-size: 0.9rem;">' + rec.action + ' ' + rec.target + '</strong>' +
                '<span class="badge" style="background: var(--ai-glow); color: #000;">' + rec.confidence + '%</span>' +
            '</div>' +
            '<small class="text-muted">' + rec.reason + '</small>' +
        '</div>';
    });
    
    container.innerHTML = html;
}

function updateRiskAnalysis() {
    const container = document.getElementById('riskAnalysis');
    if (!container) return;

    const riskMetrics = [
        { name: 'Portfolio Beta', value: '1.2', status: 'Medium' },
        { name: 'Sharpe Ratio', value: '1.8', status: 'Good' },
        { name: 'Max Drawdown', value: '15%', status: 'Acceptable' },
        { name: 'Volatility', value: '22%', status: 'Medium' }
    ];

    let html = '';
    riskMetrics.forEach(metric => {
        const statusColor = metric.status === 'Good' ? 'success' : metric.status === 'Acceptable' ? 'warning' : 'info';
        
        html += '<div class="d-flex justify-content-between align-items-center mb-3">' +
            '<div>' +
                '<strong style="font-size: 0.9rem;">' + metric.name + '</strong>' +
                '<div style="font-size: 1.2rem; font-weight: 700;">' + metric.value + '</div>' +
            '</div>' +
            '<span class="badge bg-' + statusColor + '">' + metric.status + '</span>' +
        '</div>';
    });
    
    container.innerHTML = html;
}

// AI Chat Functions
function openAIChat() {
    const chatContainer = document.getElementById('aiChatContainer');
    if (chatContainer) {
        chatContainer.classList.add('open');
        document.getElementById('chatInput').focus();
    }
}

function closeAIChat() {
    const chatContainer = document.getElementById('aiChatContainer');
    if (chatContainer) {
        chatContainer.classList.remove('open');
    }
}

async function sendAIMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    addChatMessage(message, true);
    chatInput.value = '';
    
    addTypingIndicator();
    
    try {
        const response = await fetch(API_ENDPOINTS.chat, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        removeTypingIndicator();
        addChatMessage(data.response, false);
    } catch (error) {
        console.error('Chat error:', error);
        removeTypingIndicator();
        addChatMessage("I'm experiencing technical difficulties. Please try again.", false);
    }
}

function addChatMessage(message, isUser) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + (isUser ? 'user' : 'bot');
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<div class="loading-ai me-2"></div>AI is thinking...';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Utility Functions
function suggestRandomStock() {
    const popularStocks = ['AAPL', 'MSFT', 'TSLA', 'NVDA', 'GOOGL', 'AMZN', 'META', 'NFLX', 'AMD', 'INTC'];
    const randomStock = popularStocks[Math.floor(Math.random() * popularStocks.length)];
    document.getElementById('aiTicker').value = randomStock;
}

function quickAnalyze(symbol) {
    document.getElementById('aiTicker').value = symbol;
    performAIAnalysis();
}

function analyzeStock(symbol) {
    document.getElementById('aiTicker').value = symbol;
    document.getElementById('analysisDepth').value = 'deep';
    performAIAnalysis();
}

function analyzeCrypto(symbol) {
    document.getElementById('aiTicker').value = symbol;
    document.getElementById('analysisDepth').value = 'deep';
    performAIAnalysis();
}

function optimizeWatchlist() {
    const btn = document.querySelector('button[onclick="optimizeWatchlist()"]');
    btn.innerHTML = '<div class="loading-ai me-2"></div>Optimizing...';
    btn.disabled = true;
    
    setTimeout(() => {
        // Simulate AI optimization
        const newStocks = ['ADBE', 'CRM', 'SHOP', 'SQ'];
        newStocks.forEach(stock => {
            if (!watchlistData.includes(stock) && watchlistData.length < 8) {
                addToWatchlist(stock);
            }
        });
        
        showToast('Watchlist optimized with AI-selected high-potential stocks!', 'success');
        
        btn.innerHTML = '<i class="fas fa-magic me-1"></i>AI Optimize';
        btn.disabled = false;
    }, 2000);
}

function analyzePortfolio() {
    const btn = document.querySelector('button[onclick="analyzePortfolio()"]');
    btn.innerHTML = '<div class="loading-ai me-2"></div>Analyzing...';
    btn.disabled = true;
    
    setTimeout(async () => {
        try {
            const response = await fetch(API_ENDPOINTS.chat, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: 'Provide portfolio analysis advice focusing on diversification and risk management.' })
            });
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            addChatMessage('Portfolio Analysis: ' + data.response, false);
            openAIChat();
        } catch (error) {
            console.error('Portfolio analysis error:', error);
            addChatMessage('Portfolio analysis temporarily unavailable.', false);
        } finally {
            btn.innerHTML = '<i class="fas fa-briefcase me-2"></i>Analyze Portfolio';
            btn.disabled = false;
        }
    }, 2000);
}

function filterNews(filter) {
    // This would filter news based on the selected filter
    // For demo, we'll just reload the news
    loadNewsFeed();
    showToast('Filtering news: ' + filter, 'info');
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    toast.innerHTML = '<i class="fas ' + icon + ' me-2"></i><span>' + message + '</span>';
    
    toastContainer.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Initialize animations
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}

// Update market sentiment periodically
setInterval(async () => {
    try {
        const response = await fetch(API_ENDPOINTS.chat, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: 'Rate current market sentiment from 0-100 (bearish to bullish). Return only the number.' })
        });
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        const sentimentValue = parseInt(data.response) || 65;
        
        document.getElementById('sentimentBar').style.width = sentimentValue + '%';
        
        const sentimentText = sentimentValue > 70 ? 'Bullish' : sentimentValue > 40 ? 'Neutral' : 'Bearish';
        document.getElementById('marketSentiment').innerHTML = 'AI detects <strong>' + sentimentText + '</strong> market sentiment (' + sentimentValue + '/100)';
    } catch (error) {
        console.error('Error updating sentiment:', error);
    }
}, 60000); // Update every minute

// Initialize everything when DOM is ready
initAnimations();

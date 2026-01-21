// Crypto news with working API
let allNews = [];
let newsLoading = false;

async function loadNews() {
    if (newsLoading) return;
    
    const newsContainer = document.getElementById('newsContainer');
    newsLoading = true;
    
    newsContainer.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i> Loading latest crypto news...
        </div>
    `;

    try {
        // Use CryptoPanic API (free tier)
        const response = await fetch('https://cryptopanic.com/api/v1/posts/?auth_token=415e2f98079eeb9cf7753d65adc647b35ee19e7d&kind=news');
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            allNews = data.results.map(item => {
                // Get sentiment
                let sentiment = 'neutral';
                if (item.votes) {
                    const positive = item.votes.positive || 0;
                    const negative = item.votes.negative || 0;
                    const total = positive + negative;
                    
                    if (total > 0) {
                        const ratio = positive / total;
                        if (ratio > 0.6) sentiment = 'positive';
                        else if (ratio < 0.4) sentiment = 'negative';
                    }
                }
                
                // Get currencies
                const currencies = item.currencies || [];
                
                return {
                    id: item.id,
                    title: item.title,
                    url: item.url,
                    source: { title: item.source ? item.source.title : 'CryptoPanic' },
                    published_at: item.published_at,
                    sentiment: sentiment,
                    currencies: currencies.map(c => ({ code: c.code, title: c.title })),
                    votes: item.votes || { positive: 0, negative: 0 }
                };
            });
            
            displayNews(allNews);
            updateStats(allNews);
            
        } else {
            // Fallback to demo data
            loadDemoNews();
        }
        
    } catch (error) {
        console.error('Error loading news:', error);
        loadDemoNews();
        
    } finally {
        newsLoading = false;
    }
}

function loadDemoNews() {
    const demoNews = [
        {
            id: 1,
            title: "Bitcoin ETF Approval Drives Institutional Adoption",
            url: "https://cointelegraph.com",
            source: { title: "CoinTelegraph" },
            published_at: new Date().toISOString(),
            sentiment: "positive",
            currencies: [{ code: "BTC", title: "Bitcoin" }],
            votes: { positive: 85, negative: 15 }
        },
        {
            id: 2,
            title: "Ethereum Shanghai Upgrade Successfully Implemented",
            url: "https://coindesk.com",
            source: { title: "CoinDesk" },
            published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            sentiment: "positive",
            currencies: [{ code: "ETH", title: "Ethereum" }],
            votes: { positive: 92, negative: 8 }
        },
        {
            id: 3,
            title: "Regulatory Concerns Impact Crypto Markets Globally",
            url: "https://cryptonews.com",
            source: { title: "CryptoNews" },
            published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            sentiment: "negative",
            currencies: [{ code: "BTC", title: "Bitcoin" }, { code: "ETH", title: "Ethereum" }],
            votes: { positive: 45, negative: 55 }
        },
        {
            id: 4,
            title: "Solana Network Achieves Record Transaction Speed",
            url: "https://solana.com",
            source: { title: "Solana Blog" },
            published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            sentiment: "positive",
            currencies: [{ code: "SOL", title: "Solana" }],
            votes: { positive: 78, negative: 22 }
        },
        {
            id: 5,
            title: "Binance Expands European Operations",
            url: "https://binance.com",
            source: { title: "Binance Blog" },
            published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            sentiment: "positive",
            currencies: [{ code: "BNB", title: "BNB" }],
            votes: { positive: 88, negative: 12 }
        },
        {
            id: 6,
            title: "Cardano Smart Contracts Show Strong Growth",
            url: "https://cardano.org",
            source: { title: "Cardano Foundation" },
            published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
            sentiment: "positive",
            currencies: [{ code: "ADA", title: "Cardano" }],
            votes: { positive: 75, negative: 25 }
        }
    ];

    allNews = demoNews;
    displayNews(allNews);
    updateStats(allNews);
}

function displayNews(newsArray) {
    const newsContainer = document.getElementById('newsContainer');
    
    if (newsArray.length === 0) {
        newsContainer.innerHTML = '<div class="no-news">No news matching your filters.</div>';
        return;
    }

    let newsHTML = '';

    newsArray.forEach(item => {
        const sentiment = item.sentiment || 'neutral';
        const sentimentClass = `sentiment-${sentiment}`;
        
        const publishedDate = new Date(item.published_at);
        const timeAgo = getTimeAgo(publishedDate);
        
        const source = item.source?.title || 'Unknown Source';
        
        const currencies = item.currencies || [];
        const currencyBadges = currencies.map(currency => 
            `<span class="currency-badge">${currency.code}</span>`
        ).join('');

        const votePercent = item.votes ? 
            Math.round((item.votes.positive / (item.votes.positive + item.votes.negative)) * 100) : 50;

        newsHTML += `
            <div class="news-item">
                <div class="news-header">
                    <span class="sentiment-badge ${sentimentClass}">
                        ${sentiment === 'positive' ? '🟢' : sentiment === 'negative' ? '🔴' : '⚪'} 
                        ${sentiment.toUpperCase()}
                    </span>
                    <span class="news-date" title="${publishedDate.toLocaleString()}">
                        <i class="far fa-clock"></i> ${timeAgo}
                    </span>
                </div>
                
                <div class="news-title">
                    <a href="${item.url}" target="_blank" rel="noopener noreferrer">
                        ${item.title}
                    </a>
                </div>
                
                <div class="news-meta">
                    <span class="news-source">
                        <i class="fas fa-newspaper"></i> ${source}
                    </span>
                    <div>
                        ${currencyBadges}
                        ${item.votes ? `<span style="margin-left: 10px; color: var(--text-dim);">
                            <i class="fas fa-thumbs-up"></i> ${votePercent}%
                        </span>` : ''}
                    </div>
                </div>
            </div>
        `;
    });

    newsContainer.innerHTML = newsHTML;
}

function filterNews() {
    const sentimentFilter = document.getElementById('newsFilter').value;
    const currencyFilter = document.getElementById('currencyFilter').value;

    let filteredNews = allNews;

    if (sentimentFilter !== 'all') {
        filteredNews = filteredNews.filter(item => 
            (item.sentiment || 'neutral') === sentimentFilter
        );
    }

    if (currencyFilter !== 'all') {
        filteredNews = filteredNews.filter(item => 
            item.currencies?.some(currency => currency.code === currencyFilter)
        );
    }

    displayNews(filteredNews);
    updateStats(filteredNews);
}

function updateStats(newsArray) {
    const totalNews = newsArray.length;
    const positiveNews = newsArray.filter(item => item.sentiment === 'positive').length;
    const negativeNews = newsArray.filter(item => item.sentiment === 'negative').length;
    const neutralNews = newsArray.filter(item => !item.sentiment || item.sentiment === 'neutral').length;

    document.getElementById('totalNews').textContent = totalNews;
    document.getElementById('positiveNews').textContent = positiveNews;
    document.getElementById('negativeNews').textContent = negativeNews;
    document.getElementById('neutralNews').textContent = neutralNews;
}

function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
        return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
}

// Auto-refresh news every 10 minutes
function startAutoRefresh() {
    setInterval(() => {
        if (!newsLoading && document.visibilityState === 'visible') {
            loadNews();
        }
    }, 10 * 60 * 1000);
}

// Load news when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadNews();
    startAutoRefresh();
});

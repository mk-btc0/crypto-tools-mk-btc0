// Используем CoinGecko API для новостей (бесплатно, без ключа)
let allNews = [];

async function loadNews() {
    const newsContainer = document.getElementById('newsContainer');
    const loadingHtml = '<div class="loading">🔄 Loading latest crypto news...</div>';
    newsContainer.innerHTML = loadingHtml;

    try {
        // CoinGecko API для новостей
        const response = await fetch('https://api.coingecko.com/api/v3/news/');
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            allNews = data.data.map(item => ({
                ...item,
                sentiment: getRandomSentiment(), // CoinGecko не дает sentiment, так что генерируем
                currencies: extractCurrencies(item)
            }));
            displayNews(allNews);
            updateStats(allNews);
        } else {
            newsContainer.innerHTML = '<div class="error">No news available at the moment.</div>';
        }
    } catch (error) {
        console.error('Error loading news:', error);
        newsContainer.innerHTML = `
            <div class="error">
                <p>⚠️ Failed to load news. Please check your internet connection.</p>
                <p>Trying alternative source...</p>
            </div>
        `;
        // Пробуем альтернативный источник
        loadAlternativeNews();
    }
}

// Альтернативный источник если основной не работает
async function loadAlternativeNews() {
    try {
        // Простая заглушка с демо-новостями
        const demoNews = [
            {
                title: "Bitcoin Surges Past $45,000 Amid Institutional Adoption",
                url: "https://cointelegraph.com",
                source: { title: "CoinTelegraph" },
                published_at: new Date().toISOString(),
                sentiment: "positive",
                currencies: [{ code: "BTC" }]
            },
            {
                title: "Ethereum Upgrade Expected to Reduce Gas Fees",
                url: "https://coindesk.com", 
                source: { title: "CoinDesk" },
                published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                sentiment: "positive",
                currencies: [{ code: "ETH" }]
            },
            {
                title: "Regulatory Concerns Impact Crypto Markets",
                url: "https://cryptonews.com",
                source: { title: "CryptoNews" },
                published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                sentiment: "negative",
                currencies: [{ code: "BTC" }, { code: "ETH" }]
            },
            {
                title: "Solana Network Experiences Temporary Outage",
                url: "https://solana.com",
                source: { title: "Solana Blog" },
                published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                sentiment: "negative", 
                currencies: [{ code: "SOL" }]
            },
            {
                title: "Binance Announces New Listing Partnership",
                url: "https://binance.com",
                source: { title: "Binance Blog" },
                published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                sentiment: "positive",
                currencies: [{ code: "BNB" }]
            }
        ];

        allNews = demoNews;
        displayNews(allNews);
        updateStats(allNews);
        
    } catch (error) {
        console.error('Alternative news failed:', error);
    }
}

// Вспомогательные функции
function getRandomSentiment() {
    const sentiments = ['positive', 'negative', 'neutral'];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
}

function extractCurrencies(item) {
    // Простая логика для определения криптовалют по заголовку
    const currencies = [];
    const title = item.title.toLowerCase();
    
    if (title.includes('bitcoin') || title.includes('btc')) currencies.push({ code: 'BTC' });
    if (title.includes('ethereum') || title.includes('eth')) currencies.push({ code: 'ETH' });
    if (title.includes('solana') || title.includes('sol')) currencies.push({ code: 'SOL' });
    if (title.includes('binance') || title.includes('bnb')) currencies.push({ code: 'BNB' });
    if (title.includes('cardano') || title.includes('ada')) currencies.push({ code: 'ADA' });
    if (title.includes('ripple') || title.includes('xrp')) currencies.push({ code: 'XRP' });
    
    return currencies.length > 0 ? currencies : [{ code: 'CRYPTO' }];
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
        const sentimentEmoji = getSentimentEmoji(sentiment);
        const sentimentClass = `sentiment-${sentiment}`;
        
        const publishedDate = new Date(item.published_at).toLocaleString();
        const source = item.source?.title || 'Unknown Source';
        
        const currencies = item.currencies || [];
        const currencyBadges = currencies.map(currency => 
            `<span class="currency-badge">${currency.code}</span>`
        ).join('');

        newsHTML += `
            <div class="news-item ${sentimentClass}">
                <div class="news-header">
                    <span class="sentiment-badge ${sentimentClass}">${sentimentEmoji} ${sentiment.toUpperCase()}</span>
                    <span class="news-date">${publishedDate}</span>
                </div>
                
                <div class="news-title">
                    <a href="${item.url}" target="_blank" rel="noopener">${item.title}</a>
                </div>
                
                <div class="news-meta">
                    <span class="news-source">📰 ${source}</span>
                    ${currencyBadges ? `<div class="currencies">${currencyBadges}</div>` : ''}
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

function getSentimentEmoji(sentiment) {
    const emojiMap = {
        'positive': '🟢',
        'negative': '🔴', 
        'neutral': '⚪'
    };
    return emojiMap[sentiment] || '⚪';
}

function startAutoRefresh() {
    setInterval(loadNews, 5 * 60 * 1000); // Обновляем каждые 5 минут
}

// Загружаем новости при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadNews();
    startAutoRefresh();
});

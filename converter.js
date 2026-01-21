// Currency converter with modern design
let exchangeRates = {};
let ratesLoaded = false;

async function loadExchangeRates() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,cardano,ripple,tether&vs_currencies=usd,eur,gbp');
        const data = await response.json();
        
        exchangeRates = {
            bitcoin: data.bitcoin?.usd || 45000,
            ethereum: data.ethereum?.usd || 2400,
            binancecoin: data.binancecoin?.usd || 310,
            solana: data.solana?.usd || 100,
            cardano: data.cardano?.usd || 0.45,
            ripple: data.ripple?.usd || 0.60,
            tether: data.tether?.usd || 1,
            usd: 1,
            eur: 0.92,
            gbp: 0.79
        };
        
        ratesLoaded = true;
        console.log('Exchange rates loaded successfully');
        updateRateDisplay();
        
    } catch (error) {
        console.error('Error loading exchange rates:', error);
        // Fallback rates
        exchangeRates = {
            bitcoin: 45000,
            ethereum: 2400,
            binancecoin: 310,
            solana: 100,
            cardano: 0.45,
            ripple: 0.60,
            tether: 1,
            usd: 1,
            eur: 0.92,
            gbp: 0.79
        };
        ratesLoaded = true;
        updateRateDisplay();
    }
}

async function convertCurrency() {
    const amount = parseFloat(document.getElementById('amountInput').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultDiv = document.getElementById('conversionResult');
    
    if (!amount || amount <= 0) {
        resultDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter a valid amount';
        return;
    }
    
    if (!ratesLoaded) {
        resultDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading exchange rates...';
        await loadExchangeRates();
    }
    
    if (fromCurrency === toCurrency) {
        const result = document.getElementById('resultInput');
        result.value = amount;
        resultDiv.innerHTML = `${amount} ${getCurrencySymbol(fromCurrency)} = ${amount} ${getCurrencySymbol(toCurrency)}`;
        return;
    }

    try {
        const fromRate = exchangeRates[fromCurrency];
        const toRate = exchangeRates[toCurrency];
        
        if (!fromRate || !toRate) {
            throw new Error('Exchange rate not available');
        }
        
        const amountInUSD = fromCurrency === 'usd' ? amount : amount * fromRate;
        const result = toCurrency === 'usd' ? amountInUSD : amountInUSD / toRate;
        
        const resultInput = document.getElementById('resultInput');
        resultInput.value = result.toFixed(6);
        
        const fromSymbol = getCurrencySymbol(fromCurrency);
        const toSymbol = getCurrencySymbol(toCurrency);
        const rate = fromRate / toRate;
        
        resultDiv.innerHTML = `
            <div style="margin-bottom: 10px;">
                ${amount.toLocaleString('en-US', { maximumFractionDigits: 6 })} ${fromSymbol} = 
                <strong style="color: var(--secondary);">${result.toLocaleString('en-US', { maximumFractionDigits: 6 })} ${toSymbol}</strong>
            </div>
            <div style="font-size: 0.9em; color: var(--text-dim);">
                1 ${fromSymbol} = ${rate.toFixed(6)} ${toSymbol}
            </div>
        `;
        
    } catch (error) {
        console.error('Conversion error:', error);
        resultDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Conversion error. Please try again.';
    }
}

function swapCurrencies() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const amountInput = document.getElementById('amountInput');
    const resultInput = document.getElementById('resultInput');
    
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    
    if (resultInput.value && resultInput.value !== '') {
        const tempAmount = amountInput.value;
        amountInput.value = resultInput.value;
        resultInput.value = tempAmount;
    }
    
    if (amountInput.value && parseFloat(amountInput.value) > 0) {
        convertCurrency();
    }
}

function getCurrencySymbol(currencyId) {
    const symbols = {
        'bitcoin': 'BTC',
        'ethereum': 'ETH',
        'binancecoin': 'BNB',
        'solana': 'SOL',
        'cardano': 'ADA',
        'ripple': 'XRP',
        'tether': 'USDT',
        'usd': 'USD',
        'eur': 'EUR',
        'gbp': 'GBP'
    };
    
    return symbols[currencyId] || currencyId.toUpperCase();
}

function updateRateDisplay() {
    if (exchangeRates.bitcoin && exchangeRates.ethereum) {
        const rateInfo = document.createElement('div');
        rateInfo.style.cssText = 'margin-top: 20px; padding: 15px; background: var(--bg-dark); border-radius: 8px; color: var(--text-dim); font-size: 0.9em;';
        rateInfo.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>BTC/USD:</span>
                <span>$${exchangeRates.bitcoin.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>ETH/USD:</span>
                <span>$${exchangeRates.ethereum.toLocaleString()}</span>
            </div>
        `;
        
        const existingInfo = document.querySelector('.rate-info');
        if (existingInfo) existingInfo.remove();
        rateInfo.className = 'rate-info';
        document.querySelector('.converter-card').appendChild(rateInfo);
    }
}

// Event listeners
document.getElementById('amountInput').addEventListener('input', function() {
    if (this.value && parseFloat(this.value) > 0) {
        convertCurrency();
    }
});

document.getElementById('fromCurrency').addEventListener('change', function() {
    const amount = document.getElementById('amountInput').value;
    if (amount && parseFloat(amount) > 0) {
        convertCurrency();
    }
});

document.getElementById('toCurrency').addEventListener('change', function() {
    const amount = document.getElementById('amountInput').value;
    if (amount && parseFloat(amount) > 0) {
        convertCurrency();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadExchangeRates().then(() => {
        setTimeout(convertCurrency, 500);
    });
});

async function convertCurrency() {
    const amount = parseFloat(document.getElementById('amountInput').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultDiv = document.getElementById('conversionResult');
    
    if (!amount || amount <= 0) {
        resultDiv.textContent = 'Please enter a valid amount';
        resultDiv.style.color = '#ff6b6b';
        return;
    }
    
    if (fromCurrency === toCurrency) {
        const result = document.getElementById('resultInput');
        result.value = amount;
        resultDiv.textContent = `${amount} ${getCurrencyName(fromCurrency)} = ${amount} ${getCurrencyName(toCurrency)}`;
        resultDiv.style.color = '#00ff88';
        return;
    }

    
    try {
        let rate = 1;
        
        if (fromCurrency !== 'usd' && toCurrency !== 'usd') {
            const fromResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=usd`);
            const fromData = await fromResponse.json();
            const fromPrice = fromData[fromCurrency].usd;
            
            const toResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${toCurrency}&vs_currencies=usd`);
            const toData = await toResponse.json();
            const toPrice = toData[toCurrency].usd;
            
            rate = fromPrice / toPrice;
        } else if (fromCurrency === 'usd') {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${toCurrency}&vs_currencies=usd`);
            const data = await response.json();
            rate = 1 / data[toCurrency].usd;
        } else {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=usd`);
            const data = await response.json();
            rate = data[fromCurrency].usd;
        }
        
        const result = amount * rate;
        const resultInput = document.getElementById('resultInput');
        resultInput.value = result.toFixed(6);
        
        resultDiv.textContent = `${amount} ${getCurrencyName(fromCurrency)} = ${result.toFixed(6)} ${getCurrencyName(toCurrency)}`;
        resultDiv.style.color = '#00ff88';
        
    } catch (error) {
        console.error('Conversion error:', error);
        resultDiv.textContent = 'Conversion error. Please try again later.';
        resultDiv.style.color = '#ff6b6b';
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

function getCurrencyName(currencyId) {
    const names = {
        'bitcoin': 'BTC',
        'ethereum': 'ETH',
        'tether': 'USDT',
        'usd': 'USD',
        'binancecoin': 'BNB',
        'solana': 'SOL'
    };
    return names[currencyId] || currencyId.toUpperCase();
}

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

document.addEventListener('DOMContentLoaded', function() {
    convertCurrency();
});


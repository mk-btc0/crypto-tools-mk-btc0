// Modern TradingView chart with large display
let tvWidget = null;
let isFullscreen = false;

function initializeChart() {
    const symbol = document.getElementById('chartSymbol').value;
    const interval = document.getElementById('chartInterval').value;
    const theme = document.getElementById('chartTheme').value;
    
    if (tvWidget !== null) {
        tvWidget.remove();
        tvWidget = null;
    }
    
    // Show loading state
    const chartContainer = document.getElementById('tradingview_chart');
    chartContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-dim);">
            <div style="text-align: center;">
                <div style="font-size: 2em; margin-bottom: 20px;">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <div>Loading TradingView chart...</div>
            </div>
        </div>
    `;
    
    const widgetOptions = {
        container_id: "tradingview_chart",
        autosize: true,
        symbol: symbol,
        interval: interval,
        timezone: "Etc/UTC",
        theme: theme,
        style: "1",
        locale: "en",
        toolbar_bg: theme === 'dark' ? "#151522" : "#f1f5f9",
        enable_publishing: false,
        allow_symbol_change: true,
        save_image: false,
        height: "100%",
        width: "100%",
        hide_side_toolbar: false,
        studies: [
            "RSI@tv-basicstudies",
            "MACD@tv-basicstudies",
            "Volume@tv-basicstudies",
            "BB@tv-basicstudies"
        ],
        disabled_features: [
            "header_symbol_search",
            "symbol_search_hot_key"
        ],
        enabled_features: [
            "study_templates",
            "move_logo_to_main_pane",
            "side_toolbar_in_fullscreen_mode"
        ],
        overrides: {
            "paneProperties.background": theme === 'dark' ? "#0a0a0f" : "#ffffff",
            "paneProperties.vertGridProperties.color": theme === 'dark' ? "#2a2a3a" : "#e2e8f0",
            "paneProperties.horzGridProperties.color": theme === 'dark' ? "#2a2a3a" : "#e2e8f0",
            "scalesProperties.textColor": theme === 'dark' ? "#8a8aa3" : "#475569",
            "mainSeriesProperties.candleStyle.upColor": "#00ff88",
            "mainSeriesProperties.candleStyle.downColor": "#ff5555",
            "mainSeriesProperties.candleStyle.borderUpColor": "#00ff88",
            "mainSeriesProperties.candleStyle.borderDownColor": "#ff5555",
            "mainSeriesProperties.candleStyle.wickUpColor": "#00ff88",
            "mainSeriesProperties.candleStyle.wickDownColor": "#ff5555"
        },
        studies_overrides: {
            "volume.volume.color.0": "#ff5555",
            "volume.volume.color.1": "#00ff88",
            "rsi.linecolor": "#6c63ff",
            "rsi.levels.0.color": "#ff5555",
            "rsi.levels.0.value": 70,
            "rsi.levels.1.color": "#00ff88",
            "rsi.levels.1.value": 30,
            "macd.fastlinecolor": "#00ff88",
            "macd.slowlinecolor": "#6c63ff",
            "macd.histogram.up": "#00ff88",
            "macd.histogram.down": "#ff5555"
        }
    };
    
    setTimeout(() => {
        if (typeof TradingView !== 'undefined') {
            tvWidget = new TradingView.widget(widgetOptions);
        } else {
            console.error('TradingView library not loaded');
            chartContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 2rem;">
                    <div style="font-size: 3em; color: var(--danger); margin-bottom: 1rem;">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3 style="margin-bottom: 1rem;">Chart Loading Error</h3>
                    <p style="color: var(--text-dim); margin-bottom: 2rem;">
                        Unable to load TradingView chart. Please check your internet connection.
                    </p>
                    <button onclick="location.reload()" style="
                        background: var(--primary);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: inherit;
                    ">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
        }
    }, 500);
}

function updateChart() {
    initializeChart();
}

function fullscreenChart() {
    const chartContainer = document.querySelector('.chart-container');
    
    if (!isFullscreen) {
        if (chartContainer.requestFullscreen) {
            chartContainer.requestFullscreen();
        } else if (chartContainer.webkitRequestFullscreen) {
            chartContainer.webkitRequestFullscreen();
        } else if (chartContainer.msRequestFullscreen) {
            chartContainer.msRequestFullscreen();
        }
        isFullscreen = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        isFullscreen = false;
    }
}

// Load TradingView script
function loadTradingViewScript() {
    return new Promise((resolve) => {
        if (typeof TradingView !== 'undefined') {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.async = true;
        
        script.onload = () => {
            setTimeout(() => resolve(), 1000);
        };
        
        script.onerror = () => {
            console.error('Failed to load TradingView script');
            resolve(); // Still resolve to show error message
        };
        
        document.head.appendChild(script);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTradingViewScript()
        .then(() => {
            setTimeout(initializeChart, 1500);
        })
        .catch(() => {
            initializeChart();
        });
    
    // Handle fullscreen change
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            isFullscreen = false;
        }
    });
});

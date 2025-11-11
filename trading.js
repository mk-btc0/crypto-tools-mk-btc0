let tvWidget = null;

function initializeChart() {
    const symbol = document.getElementById('chartSymbol').value;
    const interval = document.getElementById('chartInterval').value;
    const theme = document.getElementById('chartTheme').value;

    if (tvWidget !== null) {
        tvWidget.remove();
        tvWidget = null;
    }

    tvWidget = new TradingView.widget({
        container_id: "tradingview_chart",
        autosize: true,
        symbol: symbol,
        interval: interval,
        timezone: "Etc/UTC",
        theme: theme,
        style: "1",
        locale: "en",   
        toolbar_bg: "#1a1a1a",
        enable_publishing: false,
        allow_symbol_change: true,
        height: "100%",
        width: "100%",
        hide_side_toolbar: false,
        studies: [
            "RSI@tv-basicstudies",
            "MACD@tv-basicstudies", 
            "Volume@tv-basicstudies",
            "BB@tv-basicstudies",
            "StochasticRSI@tv-basicstudies"
        ],
        show_popup_button: true,
        popup_width: "100%",
        popup_height: "100%",
        disabled_features: [
            "header_symbol_search",
            "symbol_search_hot_key",
            "header_compare"
        ],
        enabled_features: [
            "study_templates",
            "move_logo_to_main_pane",
            "side_toolbar_in_fullscreen_mode"
        ],
        overrides: {
            "paneProperties.background": theme === 'dark' ? "#0a0a0a" : "#ffffff",
            "paneProperties.vertGridProperties.color": theme === 'dark' ? "#1a1a1a" : "#e0e0e0",
            "paneProperties.horzGridProperties.color": theme === 'dark' ? "#1a1a1a" : "#e0e0e0",
            "symbolWatermarkProperties.transparency": 90,
            "scalesProperties.textColor": theme === 'dark' ? "#AAA" : "#333",
            "mainSeriesProperties.candleStyle.upColor": "#00ff88",
            "mainSeriesProperties.candleStyle.downColor": "#ff6b6b",
            "mainSeriesProperties.candleStyle.borderUpColor": "#00ff88",
            "mainSeriesProperties.candleStyle.borderDownColor": "#ff6b6b",
            "mainSeriesProperties.candleStyle.wickUpColor": "#00ff88",
            "mainSeriesProperties.candleStyle.wickDownColor": "#ff6b6b"
        },
        studies_overrides: {
            "rsi.display": "line",
            "rsi.linecolor": "#4d5df9",
            "rsi.levels.0.color": "#ff6b6b",
            "rsi.levels.0.value": 70,
            "rsi.levels.1.color": "#00ff88", 
            "rsi.levels.1.value": 30,
            "macd.fastlinecolor": "#00ff88",
            "macd.slowlinecolor": "#4d5df9",
            "macd.histogram.up": "#00ff88",
            "macd.histogram.down": "#ff6b6b"
        }
    });
}

function updateChart() {
    initializeChart();
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof TradingView !== 'undefined') {
        initializeChart();
    } else {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.onload = initializeChart;
        document.head.appendChild(script);
    }
});
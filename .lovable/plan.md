

# Indian Stock Market Analytics Dashboard

A professional "Bloomberg-style" terminal for NSE/BSE stock analysis with a midnight blue theme.

---

## Layout & Design

- **Dark terminal aesthetic** with midnight blue (`#0a1628`) background, cyan/gold accent colors
- **Three-column layout**: Left sidebar (Watchlist), Main content (Charts + Analysis), Right sidebar (India Factor)
- **Sharp, data-dense UI** with monospace fonts for numbers and clean card components

---

## Core Features

### 1. Stock Search & Header
- Search bar supporting Indian tickers (HDFCBANK, TCS, ZOMATO, RELIANCE, etc.)
- Auto-complete dropdown with stock name and exchange (NSE/BSE)
- Current price, day change (%), and 52-week high/low display

### 2. Technical Charts (Lightweight Charts)
- Interactive candlestick charts with volume overlay
- Timeframe toggles: 1D, 1W, 1M
- Technical overlays: Moving averages (20/50 SMA)
- Responsive and performant charting

### 3. My Portfolio Watchlist (Left Sidebar)
- Add/remove stocks to personal watchlist
- Quick view of price and daily change for each stock
- Stored in browser's local storage
- Click to switch main view to that stock

---

## India Factor Panel (Right Sidebar)

### 4. FII/DII Sentiment Indicator
- Visual gauge showing institutional buying/selling pressure
- Labels: Strong Sell → Neutral → Strong Buy
- Based on simulated FII/DII net flow data

### 5. Nifty/Sensex Correlation
- Correlation coefficient display (-1 to +1)
- Visual indicator showing if stock moves with or against the market
- Benchmark comparison (Nifty 50 or Sensex)

### 6. Macro Impact Summary
- RBI policy sentiment indicator (Hawkish/Neutral/Dovish)
- Crude oil price impact on sector
- Brief AI-style text summary of macro factors

---

## Analysis Cards

### 7. AI Prediction Engine (Rule-Based)
- "Next Week's Probability" display with Bullish/Bearish meter
- Confidence percentage based on technical indicators
- "Key Reason" card (e.g., "RSI oversold + Positive DII inflow")
- Uses RSI, MACD, and moving average crossover signals

### 8. Financial Highlights
- TTM PE Ratio with industry comparison
- Dividend Yield percentage
- Debt-to-Equity ratio
- Market Cap in ₹ Crores (Indian format)
- All displayed with proper Indian number formatting (Lakhs/Crores)

---

## Sample Stock Data

Pre-loaded mock data for 15-20 popular Indian stocks including:
- Large caps: RELIANCE, TCS, HDFCBANK, INFY, ICICIBANK
- Mid caps: ZOMATO, NYKAA, PAYTM, POLICYBAZAAR
- Sectors: IT, Banking, FMCG, Pharma, Auto

---

## Technical Implementation

- **Lightweight Charts** library for high-performance charting
- **Local Storage** for watchlist persistence
- **Responsive design** for desktop-first with tablet support
- **Mock data service** structured for easy future API integration


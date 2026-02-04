// Mock data for Indian stocks - structured for easy API migration

export interface Stock {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  sector: string;
  currentPrice: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  weekHigh52: number;
  weekLow52: number;
  allTimeHigh: number; // Historical Peak
  allTimeLow: number;  // Historical Floor
  athDate: string;     // Date of ATH
  atlDate: string;     // Date of ATL
  volume: number;
  marketCap: number; // in Crores
  peRatio: number;
  dividendYield: number;
  debtToEquity: number;
  industryPE: number;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndiaFactorData {
  fiiNetFlow: number; // in Crores (positive = buying)
  diiNetFlow: number;
  niftyCorrelation: number; // -1 to 1
  sensexCorrelation: number;
  rbiSentiment: 'hawkish' | 'neutral' | 'dovish';
  crudeImpact: 'positive' | 'neutral' | 'negative';
  macroSummary: string;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: { value: number; signal: number; histogram: number };
  sma20: number;
  sma50: number;
  prediction: {
    direction: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    keyReason: string;
  };
}

// 20 Popular Indian Stocks
export const stocksData: Record<string, Stock> = {
  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    exchange: 'NSE',
    sector: 'Energy',
    currentPrice: 2456.75,
    previousClose: 2432.10,
    dayHigh: 2478.90,
    dayLow: 2428.30,
    weekHigh52: 2856.15,
    weekLow52: 2180.00,
    allTimeHigh: 3024.90,
    allTimeLow: 145.50,
    athDate: '2024-07-08',
    atlDate: '2003-04-28',
    volume: 8542310,
    marketCap: 1662500,
    peRatio: 24.8,
    dividendYield: 0.35,
    debtToEquity: 0.42,
    industryPE: 22.5,
  },
  TCS: {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    exchange: 'NSE',
    sector: 'IT',
    currentPrice: 3842.50,
    previousClose: 3798.25,
    dayHigh: 3865.00,
    dayLow: 3785.40,
    weekHigh52: 4255.00,
    weekLow52: 3056.00,
    allTimeHigh: 4592.25,
    allTimeLow: 134.15,
    athDate: '2024-03-01',
    atlDate: '2009-03-06',
    volume: 2156780,
    marketCap: 1395000,
    peRatio: 28.5,
    dividendYield: 1.25,
    debtToEquity: 0.05,
    industryPE: 26.2,
  },
  HDFCBANK: {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    exchange: 'NSE',
    sector: 'Banking',
    currentPrice: 1678.45,
    previousClose: 1695.30,
    dayHigh: 1702.15,
    dayLow: 1665.80,
    weekHigh52: 1794.00,
    weekLow52: 1363.55,
    allTimeHigh: 1794.00,
    allTimeLow: 15.75,
    athDate: '2024-12-15',
    atlDate: '2003-05-28',
    volume: 12568420,
    marketCap: 1275000,
    peRatio: 19.2,
    dividendYield: 1.15,
    debtToEquity: 6.85,
    industryPE: 18.5,
  },
  INFY: {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    exchange: 'NSE',
    sector: 'IT',
    currentPrice: 1542.80,
    previousClose: 1528.65,
    dayHigh: 1558.25,
    dayLow: 1522.40,
    weekHigh52: 1953.90,
    weekLow52: 1358.35,
    allTimeHigh: 1953.90,
    allTimeLow: 32.65,
    athDate: '2024-09-14',
    atlDate: '2003-04-04',
    volume: 6854230,
    marketCap: 640000,
    peRatio: 23.6,
    dividendYield: 2.45,
    debtToEquity: 0.08,
    industryPE: 26.2,
  },
  ICICIBANK: {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    exchange: 'NSE',
    sector: 'Banking',
    currentPrice: 1085.60,
    previousClose: 1072.45,
    dayHigh: 1095.80,
    dayLow: 1068.25,
    weekHigh52: 1258.00,
    weekLow52: 875.20,
    allTimeHigh: 1362.35,
    allTimeLow: 33.55,
    athDate: '2024-07-30',
    atlDate: '2009-03-06',
    volume: 9856340,
    marketCap: 762000,
    peRatio: 17.8,
    dividendYield: 0.85,
    debtToEquity: 5.92,
    industryPE: 18.5,
  },
  HINDUNILVR: {
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever Ltd',
    exchange: 'NSE',
    sector: 'FMCG',
    currentPrice: 2356.40,
    previousClose: 2378.90,
    dayHigh: 2398.50,
    dayLow: 2345.20,
    weekHigh52: 2859.30,
    weekLow52: 2136.00,
    allTimeHigh: 2859.30,
    allTimeLow: 124.25,
    athDate: '2024-01-18',
    atlDate: '2003-03-13',
    volume: 1256780,
    marketCap: 553500,
    peRatio: 52.4,
    dividendYield: 1.65,
    debtToEquity: 0.12,
    industryPE: 45.8,
  },
  BHARTIARTL: {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd',
    exchange: 'NSE',
    sector: 'Telecom',
    currentPrice: 1542.30,
    previousClose: 1518.75,
    dayHigh: 1558.40,
    dayLow: 1512.65,
    weekHigh52: 1678.00,
    weekLow52: 874.60,
    allTimeHigh: 1778.95,
    allTimeLow: 156.45,
    athDate: '2024-11-22',
    atlDate: '2012-05-24',
    volume: 4568920,
    marketCap: 925000,
    peRatio: 68.5,
    dividendYield: 0.45,
    debtToEquity: 1.82,
    industryPE: 55.2,
  },
  SBIN: {
    symbol: 'SBIN',
    name: 'State Bank of India',
    exchange: 'NSE',
    sector: 'Banking',
    currentPrice: 782.55,
    previousClose: 775.80,
    dayHigh: 792.40,
    dayLow: 772.15,
    weekHigh52: 912.00,
    weekLow52: 555.30,
    allTimeHigh: 912.00,
    allTimeLow: 42.50,
    athDate: '2024-06-03',
    atlDate: '2003-04-28',
    volume: 15687420,
    marketCap: 698500,
    peRatio: 11.2,
    dividendYield: 1.85,
    debtToEquity: 12.5,
    industryPE: 18.5,
  },
  ZOMATO: {
    symbol: 'ZOMATO',
    name: 'Zomato Ltd',
    exchange: 'NSE',
    sector: 'Internet',
    currentPrice: 185.45,
    previousClose: 178.90,
    dayHigh: 189.50,
    dayLow: 176.80,
    weekHigh52: 285.00,
    weekLow52: 85.50,
    allTimeHigh: 285.00,
    allTimeLow: 40.55,
    athDate: '2024-11-28',
    atlDate: '2022-07-26',
    volume: 28965430,
    marketCap: 162500,
    peRatio: 485.2,
    dividendYield: 0,
    debtToEquity: 0.02,
    industryPE: 320.0,
  },
  NYKAA: {
    symbol: 'NYKAA',
    name: 'FSN E-Commerce Ventures',
    exchange: 'NSE',
    sector: 'E-Commerce',
    currentPrice: 165.80,
    previousClose: 168.45,
    dayHigh: 172.30,
    dayLow: 162.50,
    weekHigh52: 225.00,
    weekLow52: 128.65,
    allTimeHigh: 2574.90,
    allTimeLow: 128.65,
    athDate: '2021-11-26',
    atlDate: '2024-06-04',
    volume: 8564230,
    marketCap: 47200,
    peRatio: 856.3,
    dividendYield: 0,
    debtToEquity: 0.15,
    industryPE: 450.0,
  },
  PAYTM: {
    symbol: 'PAYTM',
    name: 'One97 Communications',
    exchange: 'NSE',
    sector: 'Fintech',
    currentPrice: 425.60,
    previousClose: 418.75,
    dayHigh: 432.80,
    dayLow: 415.20,
    weekHigh52: 998.30,
    weekLow52: 310.00,
    allTimeHigh: 1961.05,
    allTimeLow: 310.00,
    athDate: '2021-11-18',
    atlDate: '2024-02-01',
    volume: 12568940,
    marketCap: 27050,
    peRatio: -15.2,
    dividendYield: 0,
    debtToEquity: 0.05,
    industryPE: 85.0,
  },
  TATAMOTORS: {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    exchange: 'NSE',
    sector: 'Auto',
    currentPrice: 845.70,
    previousClose: 832.45,
    dayHigh: 858.90,
    dayLow: 828.30,
    weekHigh52: 1024.00,
    weekLow52: 486.75,
    allTimeHigh: 1179.00,
    allTimeLow: 63.80,
    athDate: '2024-07-31',
    atlDate: '2020-03-24',
    volume: 18954620,
    marketCap: 312500,
    peRatio: 8.5,
    dividendYield: 0.25,
    debtToEquity: 1.45,
    industryPE: 25.8,
  },
  SUNPHARMA: {
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical',
    exchange: 'NSE',
    sector: 'Pharma',
    currentPrice: 1425.80,
    previousClose: 1412.35,
    dayHigh: 1445.60,
    dayLow: 1405.25,
    weekHigh52: 1685.00,
    weekLow52: 1028.55,
    allTimeHigh: 1960.35,
    allTimeLow: 78.45,
    athDate: '2024-09-27',
    atlDate: '2003-05-19',
    volume: 3256890,
    marketCap: 342000,
    peRatio: 32.8,
    dividendYield: 0.75,
    debtToEquity: 0.18,
    industryPE: 35.2,
  },
  WIPRO: {
    symbol: 'WIPRO',
    name: 'Wipro Ltd',
    exchange: 'NSE',
    sector: 'IT',
    currentPrice: 485.60,
    previousClose: 478.90,
    dayHigh: 492.30,
    dayLow: 475.40,
    weekHigh52: 575.00,
    weekLow52: 362.45,
    allTimeHigh: 739.85,
    allTimeLow: 48.30,
    athDate: '2021-10-11',
    atlDate: '2009-03-09',
    volume: 5684320,
    marketCap: 254000,
    peRatio: 21.5,
    dividendYield: 1.85,
    debtToEquity: 0.22,
    industryPE: 26.2,
  },
  AXISBANK: {
    symbol: 'AXISBANK',
    name: 'Axis Bank Ltd',
    exchange: 'NSE',
    sector: 'Banking',
    currentPrice: 1125.40,
    previousClose: 1118.65,
    dayHigh: 1138.75,
    dayLow: 1112.30,
    weekHigh52: 1340.00,
    weekLow52: 855.00,
    allTimeHigh: 1340.00,
    allTimeLow: 28.65,
    athDate: '2024-07-12',
    atlDate: '2009-03-06',
    volume: 7856420,
    marketCap: 347200,
    peRatio: 14.2,
    dividendYield: 0.45,
    debtToEquity: 8.15,
    industryPE: 18.5,
  },
  MARUTI: {
    symbol: 'MARUTI',
    name: 'Maruti Suzuki India',
    exchange: 'NSE',
    sector: 'Auto',
    currentPrice: 10856.75,
    previousClose: 10725.40,
    dayHigh: 10985.00,
    dayLow: 10680.25,
    weekHigh52: 13500.00,
    weekLow52: 9825.00,
    allTimeHigh: 13680.00,
    allTimeLow: 452.25,
    athDate: '2024-08-27',
    atlDate: '2009-03-09',
    volume: 856420,
    marketCap: 342500,
    peRatio: 28.5,
    dividendYield: 0.85,
    debtToEquity: 0.02,
    industryPE: 25.8,
  },
  ASIANPAINT: {
    symbol: 'ASIANPAINT',
    name: 'Asian Paints Ltd',
    exchange: 'NSE',
    sector: 'Consumer',
    currentPrice: 2785.60,
    previousClose: 2812.45,
    dayHigh: 2835.00,
    dayLow: 2768.30,
    weekHigh52: 3485.00,
    weekLow52: 2454.25,
    allTimeHigh: 3589.90,
    allTimeLow: 85.55,
    athDate: '2022-12-01',
    atlDate: '2009-03-09',
    volume: 1568420,
    marketCap: 267200,
    peRatio: 58.2,
    dividendYield: 0.65,
    debtToEquity: 0.08,
    industryPE: 52.5,
  },
  LT: {
    symbol: 'LT',
    name: 'Larsen & Toubro Ltd',
    exchange: 'NSE',
    sector: 'Infrastructure',
    currentPrice: 3425.80,
    previousClose: 3392.15,
    dayHigh: 3465.40,
    dayLow: 3378.60,
    weekHigh52: 3925.00,
    weekLow52: 2685.00,
    allTimeHigh: 3925.00,
    allTimeLow: 142.85,
    athDate: '2024-12-09',
    atlDate: '2003-04-28',
    volume: 2568940,
    marketCap: 470500,
    peRatio: 32.5,
    dividendYield: 0.95,
    debtToEquity: 1.25,
    industryPE: 28.5,
  },
  POLICYBZR: {
    symbol: 'POLICYBZR',
    name: 'PB Fintech Ltd',
    exchange: 'NSE',
    sector: 'Fintech',
    currentPrice: 1425.60,
    previousClose: 1398.75,
    dayHigh: 1458.90,
    dayLow: 1385.40,
    weekHigh52: 1895.00,
    weekLow52: 585.20,
    allTimeHigh: 1895.00,
    allTimeLow: 308.15,
    athDate: '2024-12-02',
    atlDate: '2022-06-17',
    volume: 4568920,
    marketCap: 64500,
    peRatio: -42.5,
    dividendYield: 0,
    debtToEquity: 0.01,
    industryPE: 85.0,
  },
  TITAN: {
    symbol: 'TITAN',
    name: 'Titan Company Ltd',
    exchange: 'NSE',
    sector: 'Consumer',
    currentPrice: 3256.45,
    previousClose: 3218.90,
    dayHigh: 3285.70,
    dayLow: 3198.30,
    weekHigh52: 3886.95,
    weekLow52: 2725.00,
    allTimeHigh: 3886.95,
    allTimeLow: 35.85,
    athDate: '2024-09-12',
    atlDate: '2009-03-09',
    volume: 1856420,
    marketCap: 289200,
    peRatio: 82.5,
    dividendYield: 0.35,
    debtToEquity: 0.45,
    industryPE: 65.0,
  },
};

// Generate mock OHLCV data for charts
export function generateCandleData(
  symbol: string,
  timeframe: '1D' | '1W' | '1M'
): CandleData[] {
  const stock = stocksData[symbol];
  if (!stock) return [];

  const basePrice = stock.currentPrice;
  const volatility = basePrice * 0.02;
  const data: CandleData[] = [];

  let dataPoints: number;
  let intervalMinutes: number;

  switch (timeframe) {
    case '1D':
      dataPoints = 78; // 6.5 hours * 12 (5-min candles)
      intervalMinutes = 5;
      break;
    case '1W':
      dataPoints = 35; // 7 days * 5 (hourly candles during market hours)
      intervalMinutes = 60;
      break;
    case '1M':
      dataPoints = 22; // ~22 trading days
      intervalMinutes = 1440;
      break;
  }

  const now = Date.now();
  let currentPrice = basePrice * 0.95;

  for (let i = dataPoints; i >= 0; i--) {
    const time = Math.floor((now - i * intervalMinutes * 60 * 1000) / 1000);
    const change = (Math.random() - 0.48) * volatility;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * stock.volume * 0.1);

    data.push({
      time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });

    currentPrice = close;
  }

  return data;
}

// Generate India Factor data
export function getIndiaFactorData(symbol: string): IndiaFactorData {
  const stock = stocksData[symbol];
  if (!stock) {
    return {
      fiiNetFlow: 0,
      diiNetFlow: 0,
      niftyCorrelation: 0,
      sensexCorrelation: 0,
      rbiSentiment: 'neutral',
      crudeImpact: 'neutral',
      macroSummary: 'No data available',
    };
  }

  const sectorImpacts: Record<string, { crude: 'positive' | 'neutral' | 'negative'; rbi: 'hawkish' | 'neutral' | 'dovish' }> = {
    Energy: { crude: 'positive', rbi: 'neutral' },
    IT: { crude: 'neutral', rbi: 'neutral' },
    Banking: { crude: 'neutral', rbi: 'hawkish' },
    FMCG: { crude: 'negative', rbi: 'neutral' },
    Telecom: { crude: 'neutral', rbi: 'neutral' },
    Internet: { crude: 'neutral', rbi: 'dovish' },
    'E-Commerce': { crude: 'negative', rbi: 'dovish' },
    Fintech: { crude: 'neutral', rbi: 'hawkish' },
    Auto: { crude: 'negative', rbi: 'neutral' },
    Pharma: { crude: 'neutral', rbi: 'neutral' },
    Consumer: { crude: 'negative', rbi: 'neutral' },
    Infrastructure: { crude: 'negative', rbi: 'dovish' },
  };

  const impact = sectorImpacts[stock.sector] || { crude: 'neutral', rbi: 'neutral' };
  const fii = Math.round((Math.random() - 0.45) * 5000);
  const dii = Math.round((Math.random() - 0.4) * 4000);

  const summaries: Record<string, string> = {
    Energy: 'Elevated crude prices benefit upstream operations. RBI stability supports sector growth.',
    IT: 'Dollar strength favors IT exports. Stable monetary policy provides earnings visibility.',
    Banking: 'RBI hawkish stance may compress NIMs. Strong credit growth outlook remains intact.',
    FMCG: 'Rural recovery gaining momentum. Input cost pressures easing with commodity softening.',
    Telecom: 'Tariff hikes improving ARPUs. 5G capex cycle providing growth visibility.',
    Auto: 'EV transition accelerating. High crude prices impacting margin outlook for ICE segment.',
    Pharma: 'US FDA clearances positive. Domestic formulations showing strong growth trajectory.',
    Consumer: 'Premium segment demand resilient. Discretionary spending recovery in urban centers.',
  };

  return {
    fiiNetFlow: fii,
    diiNetFlow: dii,
    niftyCorrelation: parseFloat((Math.random() * 0.6 + 0.3).toFixed(2)),
    sensexCorrelation: parseFloat((Math.random() * 0.6 + 0.35).toFixed(2)),
    rbiSentiment: impact.rbi,
    crudeImpact: impact.crude,
    macroSummary: summaries[stock.sector] || 'Sector fundamentals remain stable with positive long-term outlook.',
  };
}

// Calculate technical indicators
export function getTechnicalIndicators(symbol: string): TechnicalIndicators {
  const stock = stocksData[symbol];
  if (!stock) {
    return {
      rsi: 50,
      macd: { value: 0, signal: 0, histogram: 0 },
      sma20: 0,
      sma50: 0,
      prediction: { direction: 'neutral', confidence: 50, keyReason: 'Insufficient data' },
    };
  }

  const priceChange = ((stock.currentPrice - stock.previousClose) / stock.previousClose) * 100;
  const rsi = Math.min(85, Math.max(15, 50 + priceChange * 5 + (Math.random() - 0.5) * 20));
  
  const sma20 = stock.currentPrice * (1 + (Math.random() - 0.5) * 0.05);
  const sma50 = stock.currentPrice * (1 + (Math.random() - 0.5) * 0.08);
  
  const macdValue = (stock.currentPrice - sma20) * 0.1;
  const macdSignal = macdValue * 0.8;
  const histogram = macdValue - macdSignal;

  // Rule-based prediction
  let bullishSignals = 0;
  let bearishSignals = 0;
  const reasons: string[] = [];

  if (rsi < 30) { bullishSignals += 2; reasons.push('RSI oversold'); }
  else if (rsi > 70) { bearishSignals += 2; reasons.push('RSI overbought'); }

  if (stock.currentPrice > sma20) { bullishSignals += 1; reasons.push('Above 20 SMA'); }
  else { bearishSignals += 1; }

  if (stock.currentPrice > sma50) { bullishSignals += 1; reasons.push('Above 50 SMA'); }
  else { bearishSignals += 1; }

  if (histogram > 0) { bullishSignals += 1; reasons.push('Positive MACD'); }
  else { bearishSignals += 1; reasons.push('Negative MACD'); }

  if (priceChange > 0) { bullishSignals += 1; reasons.push('Positive momentum'); }
  else { bearishSignals += 1; }

  const indiaFactor = getIndiaFactorData(symbol);
  if (indiaFactor.fiiNetFlow > 0) { bullishSignals += 1; reasons.push('FII buying'); }
  else if (indiaFactor.fiiNetFlow < -1000) { bearishSignals += 1; reasons.push('FII selling'); }

  const totalSignals = bullishSignals + bearishSignals;
  const confidence = Math.round((Math.max(bullishSignals, bearishSignals) / totalSignals) * 100);
  
  let direction: 'bullish' | 'bearish' | 'neutral';
  if (bullishSignals > bearishSignals + 1) direction = 'bullish';
  else if (bearishSignals > bullishSignals + 1) direction = 'bearish';
  else direction = 'neutral';

  const topReasons = reasons.slice(0, 2).join(' + ');

  return {
    rsi: parseFloat(rsi.toFixed(1)),
    macd: {
      value: parseFloat(macdValue.toFixed(2)),
      signal: parseFloat(macdSignal.toFixed(2)),
      histogram: parseFloat(histogram.toFixed(2)),
    },
    sma20: parseFloat(sma20.toFixed(2)),
    sma50: parseFloat(sma50.toFixed(2)),
    prediction: {
      direction,
      confidence,
      keyReason: topReasons || 'Mixed signals',
    },
  };
}

// Format number in Indian style (Lakhs, Crores)
export function formatIndianNumber(num: number): string {
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  } else if (num >= 1000) {
    return `₹${(num / 1000).toFixed(2)} K`;
  }
  return `₹${num.toFixed(2)}`;
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function getStockList(): Stock[] {
  return Object.values(stocksData);
}

export function getStock(symbol: string): Stock | undefined {
  return stocksData[symbol];
}

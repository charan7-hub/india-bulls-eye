export interface FinancialTerm {
  term: string;
  definition: string;
  description: string;
  example: string;
}

export const financialDictionary: FinancialTerm[] = [
  {
    term: "P/E Ratio",
    definition: "Price-to-Earnings Ratio — how much investors pay per rupee of earnings.",
    description: "The P/E ratio is calculated by dividing a company's current stock price by its earnings per share (EPS). It tells you how expensive a stock is relative to its profits.\n\n• A high P/E (e.g., 40+) suggests investors expect strong future growth.\n• A low P/E (e.g., below 15) may indicate the stock is undervalued or the company faces challenges.\n• Compare P/E within the same sector — IT companies typically trade at higher P/E than banks.",
    example: "If TCS trades at ₹3,500 and its EPS is ₹100, the P/E ratio is 35. This means investors are willing to pay ₹35 for every ₹1 of earnings."
  },
  {
    term: "Market Cap",
    definition: "Total market value of a company's outstanding shares.",
    description: "Market capitalization is calculated by multiplying the current share price by the total number of shares outstanding. It classifies companies by size.\n\n• Large Cap: ₹20,000 Cr+ (e.g., Reliance, TCS) — stable, lower risk.\n• Mid Cap: ₹5,000–₹20,000 Cr — moderate growth and risk.\n• Small Cap: Below ₹5,000 Cr — higher growth potential but volatile.",
    example: "If Infosys has 420 crore shares outstanding and trades at ₹1,500 per share, its market cap is ₹6,30,000 crore (₹6.3 lakh crore)."
  },
  {
    term: "RSI",
    definition: "Relative Strength Index — a momentum indicator measuring speed and change of price movements.",
    description: "RSI oscillates between 0 and 100 and is typically calculated over 14 periods.\n\n• RSI above 70: The stock may be overbought (potential pullback ahead).\n• RSI below 30: The stock may be oversold (potential bounce ahead).\n• RSI around 50: Neutral momentum.\n\nTraders use RSI to time entries and exits, often combining it with other indicators for confirmation.",
    example: "If Reliance's RSI hits 75, it signals the stock may be overbought after a sharp rally. A trader might wait for a pullback before buying."
  },
  {
    term: "Dividend",
    definition: "A portion of a company's profit paid out to shareholders.",
    description: "Dividends are typically declared per share and paid quarterly or annually. Not all companies pay dividends — growth companies often reinvest profits instead.\n\n• Dividend Yield = (Annual Dividend / Share Price) × 100.\n• High-yield stocks (3%+) are popular for income-focused investors.\n• Dividend consistency signals financial health and management confidence.",
    example: "If ITC declares a dividend of ₹6 per share and the stock trades at ₹400, the dividend yield is 1.5%."
  },
  {
    term: "Bull Market",
    definition: "A market condition where prices are rising or expected to rise.",
    description: "A bull market is generally defined as a sustained rise of 20% or more from recent lows. Characteristics include:\n\n• Increasing investor confidence and optimism.\n• Rising trading volumes.\n• Strong economic indicators (GDP growth, low unemployment).\n• Typically lasts months to years.\n\nThe opposite is a bear market, where prices decline 20%+ from recent highs.",
    example: "The Indian stock market experienced a strong bull run from March 2020 to October 2021, with the Nifty 50 rising from ~7,500 to ~18,600."
  },
  {
    term: "Bear Market",
    definition: "A market condition where prices are falling or expected to fall by 20% or more.",
    description: "Bear markets are characterized by widespread pessimism and negative sentiment.\n\n• Investors sell holdings, driving prices lower.\n• Economic slowdowns or recessions often accompany bear markets.\n• They create buying opportunities for long-term investors.\n• Historically, bear markets are shorter than bull markets.",
    example: "During the COVID crash in March 2020, the Nifty 50 fell from ~12,000 to ~7,500 in just one month — a classic bear market."
  },
  {
    term: "EPS",
    definition: "Earnings Per Share — the profit allocated to each outstanding share.",
    description: "EPS = (Net Income − Preferred Dividends) / Average Outstanding Shares.\n\n• Higher EPS indicates greater profitability.\n• EPS growth over consecutive quarters signals a healthy company.\n• Diluted EPS accounts for stock options and convertible securities.\n• Used as the denominator in P/E ratio calculations.",
    example: "If HDFC Bank earns ₹40,000 crore in net profit with 550 crore shares outstanding, its EPS is approximately ₹72.7."
  },
  {
    term: "Volume",
    definition: "The number of shares traded during a given period.",
    description: "Volume indicates the level of activity and liquidity in a stock.\n\n• High volume on price increase: Strong buying interest (bullish signal).\n• High volume on price decrease: Strong selling pressure (bearish signal).\n• Low volume: Lack of interest; price moves may not be sustainable.\n• Average daily volume helps compare activity across stocks.",
    example: "If Tata Motors normally trades 2 crore shares daily but suddenly trades 8 crore shares, it signals significant news or institutional activity."
  },
  {
    term: "MACD",
    definition: "Moving Average Convergence Divergence — a trend-following momentum indicator.",
    description: "MACD shows the relationship between two moving averages of a stock's price.\n\n• MACD Line = 12-day EMA − 26-day EMA.\n• Signal Line = 9-day EMA of the MACD line.\n• When MACD crosses above the signal line: Bullish signal.\n• When MACD crosses below the signal line: Bearish signal.\n• The histogram shows the distance between the two lines.",
    example: "If Infosys's MACD line crosses above its signal line after a period of decline, it may indicate the start of an upward trend."
  },
  {
    term: "SIP",
    definition: "Systematic Investment Plan — investing a fixed amount regularly in mutual funds.",
    description: "SIP is one of the most popular investment methods in India.\n\n• Invest a fixed amount (e.g., ₹5,000) monthly into a chosen mutual fund.\n• Benefits from rupee cost averaging — buy more units when prices are low.\n• Removes the need to time the market.\n• Compounding effect grows wealth significantly over long periods.\n• Can be started with as little as ₹500/month.",
    example: "A ₹10,000 monthly SIP in a Nifty 50 index fund over 10 years (assuming 12% annual returns) would grow to approximately ₹23 lakh from ₹12 lakh invested."
  },
  {
    term: "NAV",
    definition: "Net Asset Value — the per-unit price of a mutual fund.",
    description: "NAV = (Total Assets − Total Liabilities) / Number of Units Outstanding.\n\n• NAV is updated at the end of each trading day.\n• A higher NAV doesn't mean the fund is expensive — it reflects accumulated growth.\n• New investments are allotted units based on the current NAV.\n• Compare fund performance using returns percentage, not NAV.",
    example: "If a mutual fund has total assets of ₹1,000 crore, liabilities of ₹10 crore, and 50 crore units, its NAV is ₹19.80."
  },
  {
    term: "Stop Loss",
    definition: "An order to sell a stock when it reaches a specific price to limit losses.",
    description: "A stop loss is a risk management tool used by traders.\n\n• Set below the current price to limit downside risk.\n• Triggers an automatic sell order when the price hits the stop level.\n• Trailing stop loss adjusts upward as the stock price rises.\n• Common practice: Set stop loss 5-10% below entry price.\n• Prevents emotional decision-making during volatile markets.",
    example: "You buy Bajaj Finance at ₹7,000 and set a stop loss at ₹6,650 (5% below). If the stock drops to ₹6,650, it auto-sells, capping your loss at ₹350 per share."
  },
  {
    term: "Blue Chip",
    definition: "Large, well-established, financially sound companies with a track record of reliable performance.",
    description: "Blue chip stocks are considered the safest equity investments.\n\n• Typically part of major indices like Nifty 50 or Sensex.\n• Consistent dividend payments.\n• Strong balance sheets and established market positions.\n• Lower volatility compared to mid/small caps.\n• Examples in India: Reliance, TCS, HDFC Bank, Infosys, ITC.",
    example: "TCS is a blue chip stock — it has been consistently profitable, pays regular dividends, and has a market cap exceeding ₹12 lakh crore."
  },
  {
    term: "IPO",
    definition: "Initial Public Offering — when a private company sells shares to the public for the first time.",
    description: "An IPO marks a company's transition from private to publicly traded.\n\n• Companies raise capital for expansion, debt repayment, or other purposes.\n• SEBI regulates IPOs in India.\n• Investors can apply through ASBA (Application Supported by Blocked Amount).\n• Listing day can see significant price volatility.\n• Lock-in periods apply for promoters and anchor investors.",
    example: "Zomato's IPO in July 2021 was priced at ₹76 per share and listed at ₹116, giving investors a ~53% listing gain."
  },
  {
    term: "Nifty 50",
    definition: "India's benchmark stock index comprising the 50 largest companies listed on NSE.",
    description: "The Nifty 50 is managed by NSE Indices Limited.\n\n• Represents ~65% of the free-float market capitalization of NSE.\n• Covers 13 sectors of the Indian economy.\n• Used as a benchmark by mutual funds and portfolio managers.\n• Rebalanced semi-annually (March and September).\n• Serves as the underlying for India's most traded derivatives.",
    example: "If someone says 'the market is up 1% today,' they're typically referring to the Nifty 50 index moving from, say, 22,000 to 22,220 points."
  },
  {
    term: "Sensex",
    definition: "India's oldest stock index comprising 30 established companies listed on BSE.",
    description: "Sensex (Sensitive Index) was introduced in 1986.\n\n• Tracks 30 of the largest and most actively traded stocks on BSE.\n• Calculated using the free-float market capitalization method.\n• Often quoted alongside Nifty 50 in market reports.\n• Acts as a barometer of the Indian economy.\n• Base year: 1978-79, with a base value of 100.",
    example: "The Sensex crossed 70,000 for the first time in December 2023, reflecting strong investor confidence in India's growth story."
  },
  {
    term: "Demat Account",
    definition: "An electronic account that holds shares and securities in digital form.",
    description: "Demat (dematerialized) accounts replaced physical share certificates in India.\n\n• Mandatory for trading stocks in India since 1996.\n• NSDL and CDSL are the two depositories.\n• Linked with a trading account and bank account.\n• No risk of theft, damage, or forgery of certificates.\n• Charges include annual maintenance and transaction fees.",
    example: "When you buy 100 shares of Reliance through Zerodha, the shares are credited to your Demat account held with CDSL or NSDL."
  },
  {
    term: "FII",
    definition: "Foreign Institutional Investors — overseas entities investing in India's financial markets.",
    description: "FIIs are major market movers in India.\n\n• Include hedge funds, pension funds, mutual funds, and insurance companies.\n• FII buying typically pushes markets up; selling pulls them down.\n• SEBI monitors and regulates FII investments.\n• Net FII flows are a key indicator watched by traders.\n• Also known as FPIs (Foreign Portfolio Investors) under newer regulations.",
    example: "In 2023, FIIs invested over ₹1.7 lakh crore in Indian equities, contributing to the Nifty 50's ~20% annual gain."
  },
  {
    term: "DII",
    definition: "Domestic Institutional Investors — Indian entities like mutual funds and insurance companies investing in markets.",
    description: "DIIs act as a counterbalance to FII flows.\n\n• Include LIC, SBI Mutual Fund, HDFC AMC, and other domestic institutions.\n• Growing SIP inflows have made DIIs increasingly powerful.\n• Often buy when FIIs sell, providing market stability.\n• DII buying is seen as a long-term positive signal.\n• SEBI tracks and publishes daily DII activity data.",
    example: "During the FII sell-off in October 2022, DIIs invested ₹8,500 crore net, preventing a steeper market decline."
  },
  {
    term: "P/B Ratio",
    definition: "Price-to-Book Ratio — compares a stock's market value to its book value.",
    description: "P/B = Market Price per Share / Book Value per Share.\n\n• Book value = Total Assets − Total Liabilities.\n• P/B below 1 may indicate the stock is undervalued.\n• P/B above 3 suggests the market values intangible assets (brand, IP).\n• Most useful for valuing banks and financial companies.\n• Less relevant for asset-light tech companies.",
    example: "If SBI trades at ₹600 and its book value per share is ₹400, the P/B ratio is 1.5 — meaning the market values it at 1.5x its net assets."
  },
  {
    term: "Dividend Yield",
    definition: "Annual dividend income as a percentage of the stock's current price.",
    description: "Dividend Yield = (Annual Dividend per Share / Current Market Price) × 100.\n\n• Higher yield means more income relative to the price paid.\n• Yields above 3-4% are considered attractive in India.\n• Falling stock prices can inflate yield — check if dividends are sustainable.\n• Compare yields within the same sector for meaningful analysis.",
    example: "Coal India pays ~₹24 annual dividend. If it trades at ₹400, the yield is 6% — one of the highest among Indian blue chips."
  },
  {
    term: "Moving Average",
    definition: "The average price of a stock over a specific number of periods, smoothing out short-term fluctuations.",
    description: "Moving averages help identify trend direction.\n\n• SMA (Simple Moving Average): Equal weight to all periods.\n• EMA (Exponential Moving Average): More weight to recent prices.\n• 50-day MA: Medium-term trend indicator.\n• 200-day MA: Long-term trend indicator.\n• Golden Cross (50 MA crosses above 200 MA): Bullish signal.\n• Death Cross (50 MA crosses below 200 MA): Bearish signal.",
    example: "If HDFC Bank's stock price crosses above its 200-day moving average of ₹1,550, technical analysts would consider this a bullish signal."
  },
  {
    term: "Volatility",
    definition: "A measure of how much a stock's price fluctuates over time.",
    description: "Volatility indicates the degree of risk and uncertainty.\n\n• Measured using standard deviation of returns.\n• India VIX (Volatility Index) measures expected market volatility.\n• High volatility: Bigger price swings, more risk and opportunity.\n• Low volatility: Stable prices, lower risk.\n• Options premiums increase with higher volatility.",
    example: "India VIX spiking from 12 to 25 during election results indicates the market expects large price swings in the coming days."
  },
  {
    term: "Circuit Breaker",
    definition: "A mechanism that halts trading when a stock or index moves beyond a predetermined percentage.",
    description: "Circuit breakers protect markets from extreme volatility.\n\n• Upper Circuit: Maximum price a stock can reach in a day.\n• Lower Circuit: Minimum price a stock can fall to in a day.\n• Index-wide circuit breakers trigger at 10%, 15%, and 20% moves.\n• Stocks in F&O segment don't have individual circuit limits.\n• When triggered, trading is paused for a cooling-off period.",
    example: "If a small-cap stock has a 20% circuit limit and opens at ₹100, it can only trade between ₹80 (lower circuit) and ₹120 (upper circuit)."
  },
  {
    term: "Book Value",
    definition: "The net asset value of a company — total assets minus total liabilities.",
    description: "Book value represents what shareholders would theoretically receive if the company were liquidated.\n\n• Book Value per Share = (Total Assets − Total Liabilities) / Shares Outstanding.\n• Important metric for value investors.\n• A stock trading below book value might be undervalued.\n• Tangible book value excludes intangible assets like goodwill.\n• More relevant for asset-heavy sectors (banking, manufacturing).",
    example: "If a company has ₹500 crore in assets, ₹200 crore in liabilities, and 10 crore shares, the book value per share is ₹30."
  },
  {
    term: "Face Value",
    definition: "The original value of a share as stated by the company at the time of issuance.",
    description: "Face value (or par value) is a nominal value assigned to a share.\n\n• Most Indian stocks have a face value of ₹1, ₹2, ₹5, or ₹10.\n• Market price can differ significantly from face value.\n• Dividends are often declared as a percentage of face value.\n• Stock splits reduce face value (e.g., ₹10 to ₹2 = 5:1 split).\n• Face value determines the number of shares issued during IPO.",
    example: "MRF has a face value of ₹10 but trades at ~₹1,00,000+ — the market price reflects the company's growth over decades."
  },
  {
    term: "Short Selling",
    definition: "Selling borrowed shares hoping to buy them back at a lower price for profit.",
    description: "Short selling allows traders to profit from falling prices.\n\n• Borrow shares → Sell at current price → Buy back later at lower price → Return shares.\n• In India, intraday short selling is common; delivery-based short selling has restrictions.\n• High risk: Losses are theoretically unlimited if the price rises.\n• Short squeeze: When many short sellers cover positions simultaneously, pushing prices sharply up.\n• SEBI regulates short selling activities.",
    example: "A trader shorts 100 shares of a stock at ₹500, expecting bad earnings. The stock drops to ₹450, and they cover for a profit of ₹5,000."
  },
  {
    term: "Margin Trading",
    definition: "Borrowing funds from a broker to buy more securities than you can afford with your own capital.",
    description: "Margin trading amplifies both gains and losses.\n\n• Initial margin: The minimum amount you must deposit (typically 20-50%).\n• Maintenance margin: Minimum balance to keep the position open.\n• Margin call: Broker demands additional funds when your balance drops below maintenance margin.\n• Interest is charged on borrowed funds.\n• Popular in F&O trading in India.",
    example: "With ₹1 lakh capital and 5x margin, you can take a ₹5 lakh position. A 2% stock move means 10% gain/loss on your capital."
  },
  {
    term: "Mutual Fund",
    definition: "A professionally managed investment fund that pools money from many investors to buy securities.",
    description: "Mutual funds offer diversification and professional management.\n\n• Types: Equity, Debt, Hybrid, Index, ELSS (tax-saving).\n• Managed by AMCs (Asset Management Companies) like SBI MF, HDFC AMC.\n• Regulated by SEBI in India.\n• Expense ratio: Annual fee charged by the fund (typically 0.5-2.5%).\n• Direct plans have lower expense ratios than regular plans.\n• Returns are not guaranteed.",
    example: "Investing ₹10,000/month in an equity mutual fund via SIP for 15 years at ~12% CAGR could grow to approximately ₹50 lakh."
  },
  {
    term: "ETF",
    definition: "Exchange-Traded Fund — a basket of securities that trades on stock exchanges like a regular stock.",
    description: "ETFs combine the diversification of mutual funds with the flexibility of stock trading.\n\n• Track indices (Nifty 50, Bank Nifty), commodities (Gold), or sectors.\n• Lower expense ratios compared to actively managed mutual funds.\n• Can be bought/sold throughout the trading day at market prices.\n• Require a Demat account.\n• Popular ETFs in India: Nifty BeES, Gold BeES, Bank BeES.",
    example: "Buying Nifty BeES ETF at ₹220 gives you exposure to all 50 Nifty stocks in a single transaction, with an expense ratio of just 0.05%."
  },
  {
    term: "Intraday Trading",
    definition: "Buying and selling stocks within the same trading day to profit from short-term price movements.",
    description: "Intraday traders close all positions before the market closes at 3:30 PM.\n\n• No delivery of shares — all positions are squared off the same day.\n• Leverage (margin) is available, amplifying gains and losses.\n• Requires active monitoring and quick decision-making.\n• Transaction costs include brokerage, STT, and GST.\n• Statistically, most intraday traders lose money over time.",
    example: "A trader buys 500 shares of ICICI Bank at ₹1,000 at 10 AM, sells at ₹1,015 at 1 PM, making a ₹7,500 profit (before charges)."
  },
  {
    term: "Delivery Trading",
    definition: "Buying shares and holding them in your Demat account beyond the trading day.",
    description: "Delivery trading is the standard way of investing for the long term.\n\n• Shares are credited to your Demat account after T+1 settlement.\n• No leverage — you pay the full amount.\n• Lower brokerage charges compared to intraday.\n• No time pressure to sell.\n• Suitable for long-term wealth creation.",
    example: "Buying 50 shares of Reliance at ₹2,500 for delivery means they'll be in your Demat account, and you can hold them for years."
  },
  {
    term: "Support Level",
    definition: "A price level where a stock tends to find buying interest and stop falling.",
    description: "Support levels are key concepts in technical analysis.\n\n• Formed when demand increases at a specific price, preventing further decline.\n• Multiple bounces from the same level strengthen the support.\n• A break below support is a bearish signal.\n• Previous resistance can become new support after a breakout.\n• Traders use support levels to set buy orders and stop losses.",
    example: "If Nifty 50 has bounced off 21,800 three times in the past month, 21,800 is considered a strong support level."
  },
  {
    term: "Resistance Level",
    definition: "A price level where a stock tends to face selling pressure and stop rising.",
    description: "Resistance levels cap upward price movement.\n\n• Formed when supply increases at a specific price, preventing further rise.\n• Multiple rejections from the same level strengthen the resistance.\n• A break above resistance is a bullish signal (breakout).\n• Previous support can become new resistance after a breakdown.\n• Round numbers (₹100, ₹500, ₹1,000) often act as psychological resistance.",
    example: "If TCS repeatedly fails to close above ₹4,000, that level acts as strong resistance. A close above ₹4,000 could trigger a rally."
  },
  {
    term: "Candlestick",
    definition: "A chart pattern showing a stock's open, high, low, and close prices for a specific period.",
    description: "Candlestick charts originated in Japan and are the most popular chart type.\n\n• Green/White candle: Close > Open (bullish).\n• Red/Black candle: Close < Open (bearish).\n• Body: The area between open and close.\n• Wicks/Shadows: Lines above and below the body showing high and low.\n• Patterns like Doji, Hammer, and Engulfing signal potential reversals.",
    example: "A 'Hammer' candlestick at a support level — small body at the top with a long lower wick — suggests buyers are stepping in."
  },
  {
    term: "Bollinger Bands",
    definition: "A technical indicator with a moving average and two bands that expand and contract based on volatility.",
    description: "Bollinger Bands help identify overbought/oversold conditions and volatility.\n\n• Middle Band: 20-day Simple Moving Average.\n• Upper Band: Middle Band + 2 Standard Deviations.\n• Lower Band: Middle Band − 2 Standard Deviations.\n• Price touching upper band: Potentially overbought.\n• Price touching lower band: Potentially oversold.\n• Band squeeze (narrowing): Signals an upcoming big move.",
    example: "If Infosys's stock touches the lower Bollinger Band at ₹1,400 and starts bouncing, it could indicate an oversold condition ripe for a reversal."
  },
  {
    term: "Market Order",
    definition: "An order to buy or sell a stock immediately at the best available price.",
    description: "Market orders prioritize speed over price.\n\n• Executed almost instantly during market hours.\n• You don't control the exact execution price.\n• Suitable for liquid stocks where the bid-ask spread is tight.\n• Risky for illiquid stocks — you may get a poor price.\n• Most common order type for beginners.",
    example: "Placing a market buy order for Reliance when it's trading at ₹2,500 will execute immediately, possibly at ₹2,500-2,502 depending on liquidity."
  },
  {
    term: "Limit Order",
    definition: "An order to buy or sell a stock at a specific price or better.",
    description: "Limit orders give you price control but don't guarantee execution.\n\n• Buy limit: Set below the current market price.\n• Sell limit: Set above the current market price.\n• Order remains open until the price is reached, or the order expires.\n• Useful in volatile markets to avoid overpaying.\n• Can be set as Day orders or Good-Till-Cancelled (GTC).",
    example: "If HDFC Bank trades at ₹1,600, you can place a buy limit order at ₹1,570. It executes only if the price drops to ₹1,570 or below."
  },
  {
    term: "Bid-Ask Spread",
    definition: "The difference between the highest price a buyer will pay (bid) and the lowest price a seller will accept (ask).",
    description: "The spread indicates liquidity and transaction costs.\n\n• Tight spread (small difference): High liquidity, easy to trade.\n• Wide spread (large difference): Low liquidity, higher transaction cost.\n• Market makers profit from the spread.\n• Large-cap stocks typically have tighter spreads than small-caps.\n• Spread widens during volatile periods or after market hours.",
    example: "If Reliance has a bid of ₹2,499 and ask of ₹2,500, the spread is just ₹1 (very liquid). A small-cap might have a ₹5-10 spread."
  },
  {
    term: "Futures",
    definition: "A contract to buy or sell an asset at a predetermined price on a specific future date.",
    description: "Futures are derivative instruments used for hedging and speculation.\n\n• Standardized contracts traded on exchanges (NSE F&O segment).\n• Lot sizes are predefined (e.g., Nifty futures: 25 units).\n• Expiry: Last Thursday of every month.\n• Margin required: Only a fraction of the contract value.\n• Mark-to-market: Daily settlement of gains/losses.\n• Used by institutions to hedge portfolio risk.",
    example: "Buying 1 lot of Nifty futures at 22,000 (25 units) means your contract value is ₹5,50,000. A 100-point move = ₹2,500 profit/loss."
  },
  {
    term: "Options",
    definition: "Contracts giving the right, but not the obligation, to buy or sell an asset at a specific price before expiry.",
    description: "Options are the most traded derivatives in India.\n\n• Call Option: Right to buy at the strike price.\n• Put Option: Right to sell at the strike price.\n• Premium: The price paid for the option.\n• Strike Price: The price at which the option can be exercised.\n• In-the-money (ITM), At-the-money (ATM), Out-of-the-money (OTM).\n• Weekly options available for Nifty and Bank Nifty.",
    example: "Buying a Nifty 22,000 Call option at ₹200 premium (lot size 25) costs ₹5,000. If Nifty rises to 22,500, the option could be worth ₹500+."
  },
  {
    term: "CAGR",
    definition: "Compound Annual Growth Rate — the average annual growth rate of an investment over a specified period.",
    description: "CAGR smooths out volatility to show consistent growth.\n\n• CAGR = (Ending Value / Beginning Value)^(1/Years) − 1.\n• More accurate than simple average returns.\n• Useful for comparing different investments over the same period.\n• Does not reflect risk or volatility.\n• Commonly used to evaluate mutual fund performance.",
    example: "If you invested ₹1 lakh 5 years ago and it's now worth ₹2 lakh, the CAGR is approximately 14.87% per year."
  },
  {
    term: "ROE",
    definition: "Return on Equity — measures how efficiently a company uses shareholder equity to generate profit.",
    description: "ROE = (Net Income / Shareholder Equity) × 100.\n\n• Higher ROE indicates better management efficiency.\n• ROE above 15% is generally considered good in India.\n• Compare ROE within the same industry.\n• Consistently high ROE suggests a competitive advantage.\n• Very high ROE with high debt should be examined carefully.",
    example: "If TCS has net income of ₹40,000 crore and shareholder equity of ₹80,000 crore, its ROE is 50% — exceptionally high."
  },
  {
    term: "Debt-to-Equity Ratio",
    definition: "A measure of a company's financial leverage — how much debt it uses relative to shareholder equity.",
    description: "D/E Ratio = Total Debt / Total Shareholder Equity.\n\n• Lower ratio: Less financial risk, more conservative.\n• Higher ratio: More leveraged, potentially higher returns but riskier.\n• Below 1: Company has more equity than debt.\n• Above 2: Generally considered risky for most sectors.\n• Banks naturally have higher D/E ratios due to their business model.",
    example: "If a company has ₹200 crore debt and ₹400 crore equity, D/E is 0.5 — a healthy, conservative balance sheet."
  },
  {
    term: "ELSS",
    definition: "Equity Linked Savings Scheme — a tax-saving mutual fund with a 3-year lock-in period.",
    description: "ELSS is one of the most popular tax-saving instruments under Section 80C.\n\n• Maximum deduction: ₹1.5 lakh per financial year.\n• Shortest lock-in among Section 80C options (3 years vs 5-15 years for others).\n• Invested primarily in equity markets.\n• Potential for higher returns compared to PPF, FD, or NSC.\n• Both lump sum and SIP investments are allowed.\n• LTCG tax applies on gains above ₹1 lakh.",
    example: "Investing ₹1.5 lakh in ELSS saves up to ₹46,800 in taxes (30% bracket) while potentially earning 12-15% returns over the lock-in period."
  },
  {
    term: "Promoter Holding",
    definition: "The percentage of a company's shares owned by its promoters (founders or founding entities).",
    description: "Promoter holding indicates the founders' confidence in their own company.\n\n• High promoter holding (>50%): Strong confidence, aligned interests.\n• Declining promoter holding: Potential red flag (selling shares).\n• Pledged promoter shares: Shares used as collateral for loans — risky.\n• SEBI mandates disclosure of promoter holding changes.\n• FII + DII + Promoter + Public = 100% shareholding.",
    example: "Reliance Industries has ~50% promoter holding (Mukesh Ambani family). If this drops significantly, it could signal concerns."
  },
  {
    term: "Penny Stock",
    definition: "Very low-priced stocks, typically trading below ₹10, with small market capitalization.",
    description: "Penny stocks are highly speculative investments.\n\n• Extremely volatile — can gain or lose 20%+ in a single day.\n• Low liquidity makes them difficult to buy and sell.\n• Often targeted in pump-and-dump schemes.\n• Minimal regulatory compliance and transparency.\n• SEBI has strict surveillance measures on suspicious penny stocks.\n• Not suitable for beginners or risk-averse investors.",
    example: "A penny stock at ₹2 might hit its 20% upper circuit to ₹2.40. While it looks like a 20% gain, the actual profit on 1,000 shares is just ₹400."
  },
  {
    term: "Beta",
    definition: "A measure of a stock's volatility relative to the overall market.",
    description: "Beta indicates how much a stock moves compared to the index.\n\n• Beta = 1: Stock moves in line with the market.\n• Beta > 1: Stock is more volatile (e.g., 1.5 beta = 50% more volatile).\n• Beta < 1: Stock is less volatile than the market.\n• Negative beta: Stock moves opposite to the market (rare).\n• High-beta stocks amplify gains in bull markets but also amplify losses.",
    example: "If Tata Motors has a beta of 1.3 and Nifty rises 2%, Tata Motors is expected to rise ~2.6%. If Nifty falls 2%, it may fall ~2.6%."
  },
  {
    term: "Alpha",
    definition: "The excess return of an investment compared to its benchmark index.",
    description: "Alpha measures a fund manager's or stock's ability to beat the market.\n\n• Positive alpha: Outperforming the benchmark (good).\n• Negative alpha: Underperforming the benchmark (poor).\n• Alpha of 0: Performing exactly like the benchmark.\n• Active fund managers are judged by their ability to generate alpha.\n• Index funds by definition have near-zero alpha.",
    example: "If a fund returns 18% while the Nifty 50 returns 14%, the fund has an alpha of 4% — it outperformed the market by 4 percentage points."
  },
  {
    term: "Liquidity",
    definition: "How easily a stock can be bought or sold without significantly affecting its price.",
    description: "Liquidity is crucial for smooth trading.\n\n• Highly liquid: Large-cap stocks like Reliance, TCS — easy to trade large quantities.\n• Illiquid: Small-cap stocks — large orders can move the price significantly.\n• Measured by trading volume and bid-ask spread.\n• Higher liquidity = lower transaction costs.\n• Market makers help provide liquidity.\n• Liquidity can dry up during market crises.",
    example: "Reliance trades ~2 crore shares daily (highly liquid). A small-cap trading 5,000 shares daily would be very illiquid."
  },
  {
    term: "Bonus Shares",
    definition: "Free additional shares issued to existing shareholders based on their current holdings.",
    description: "Companies issue bonus shares to reward shareholders without cash outflow.\n\n• Issued in a ratio (e.g., 1:1 means 1 free share for every 1 held).\n• Share price adjusts proportionally (2:1 bonus = price halves).\n• Total investment value remains the same immediately.\n• Signals management's confidence in future earnings.\n• No tax on receiving bonus shares (tax applies on selling).",
    example: "If you hold 100 shares at ₹1,000 and the company declares 1:1 bonus, you'll have 200 shares at ₹500 each. Total value stays ₹1,00,000."
  },
  {
    term: "Stock Split",
    definition: "Dividing existing shares into multiple shares, reducing the face value proportionally.",
    description: "Stock splits make shares more affordable without changing total value.\n\n• A 5:1 split means each ₹100 share becomes five ₹20 shares.\n• Total market cap remains unchanged.\n• Increases liquidity and makes shares accessible to retail investors.\n• Often signals management confidence.\n• Reverse stock split combines shares (rare in India).",
    example: "MRF (₹1,00,000+ per share) has never split its stock. If it did a 10:1 split, each share would be ~₹10,000, making it more accessible."
  },
  {
    term: "Buyback",
    definition: "When a company repurchases its own shares from the open market.",
    description: "Buybacks reduce the number of outstanding shares.\n\n• Increases EPS (same earnings, fewer shares).\n• Signals management believes the stock is undervalued.\n• Returns cash to shareholders (alternative to dividends).\n• SEBI regulates buyback procedures and limits.\n• Tender route and open market are two common methods.\n• Buyback tax of 20% was applicable (now shifted to shareholders).",
    example: "TCS regularly conducts buybacks. In its 2022 buyback, it repurchased shares at ₹4,500 — a premium to the market price of ~₹3,200."
  },
];

export function searchDictionary(query: string): FinancialTerm[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return financialDictionary.filter(
    (t) =>
      t.term.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q)
  ).slice(0, 3);
}

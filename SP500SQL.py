import yfinance as yf
import psycopg2
from tqdm import tqdm  # Importing progress bar

# Database connection setup
conn = psycopg2.connect(
    dbname='advcompro',
    user='temp',
    password='temp',
    host='localhost',
    port='5432'
)
cursor = conn.cursor()

# Create table if not exists
cursor.execute("""
CREATE TABLE IF NOT EXISTS SP500 (
    company VARCHAR(10),
    stock_price NUMERIC,
    intrinsic_value NUMERIC,
    margin_of_safety NUMERIC,
    rating NUMERIC,
    gross_profit_margin NUMERIC,
    return_on_equity NUMERIC,
    roic NUMERIC,
    sga_to_revenue NUMERIC,
    debt_to_equity NUMERIC,
    current_ratio NUMERIC,
    cash_ratio NUMERIC,
    quick_ratio NUMERIC,
    roa NUMERIC
)
""")

# Hard-coded list of ticker symbols, removing duplicates
ticker_symbols = list(set([    "MMM", "AOS", "ABT", "ABBV", "ACN", "ADBE", "AMD", "AES", "AFL", "A", "APD",
    "ABNB", "AKAM", "ALB", "ARE", "ALGN", "ALLE", "LNT", "ALL", "GOOGL", "GOOG",
    "MO", "AMZN", "AMCR", "AEE", "AEP", "AXP", "AIG", "AMT", "AWK", "AMP", "AME",
    "AMGN", "APH", "ADI", "ANSS", "AON", "APA", "AAPL", "AMAT", "APTV", "ACGL",
    "ADM", "ANET", "AJG", "AIZ", "T", "ATO", "ADSK", "ADP", "AZO", "AVB", "AVY",
    "AXON", "BKR", "BALL", "BAC", "BK", "BBWI", "BAX", "BDX", "BRK-B", "BBY",
    "TECH", "BIIB", "BLK", "BX", "BA", "BKNG", "BWA", "BSX", "BMY", "AVGO", "BR",
    "BRO", "BF-B", "BLDR", "BG", "BXP", "CHRW", "CDNS", "CZR", "CPT", "CPB", "COF",
    "CAH", "KMX", "CCL", "CARR", "CTLT", "CAT", "CBOE", "CBRE", "CDW", "CE", "COR",
    "CNC", "CNP", "CF", "CRL", "SCHW", "CHTR", "CVX", "CMG", "CB", "CHD", "CI",
    "CINF", "CTAS", "CSCO", "C", "CFG", "CLX", "CME", "CMS", "KO", "CTSH", "CL",
    "CMCSA", "CAG", "COP", "ED", "STZ", "CEG", "COO", "CPRT", "GLW", "CPAY", "CTVA",
    "CSGP", "COST", "CTRA", "CRWD", "CCI", "CSX", "CMI", "CVS", "DHR", "DRI", "DVA",
    "DAY", "DECK", "DE", "DELL", "DAL", "DVN", "DXCM", "FANG", "DLR", "DFS", "DG",
    "DLTR", "D", "DPZ", "DOV", "DOW", "DHI", "DTE", "DUK", "DD", "EMN", "ETN",
    "EBAY", "ECL", "EIX", "EW", "EA", "ELV", "EMR", "ENPH", "ETR", "EOG", "EPAM",
    "EQT", "EFX", "EQIX", "EQR", "ERIE", "ESS", "EL", "EG", "EVRG", "ES", "EXC",
    "EXPE", "EXPD", "EXR", "XOM", "FFIV", "FDS", "FICO", "FAST", "FRT", "FDX",
    "FIS", "FITB", "FSLR", "FE", "FI", "FMC", "F", "FTNT", "FTV", "FOXA", "FOX",
    "BEN", "FCX", "GRMN", "IT", "GE", "GEHC", "GEV", "GEN", "GNRC", "GD", "GIS",
    "GM", "GPC", "GILD", "GPN", "GL", "GDDY", "GS", "HAL", "HIG", "HAS", "HCA",
    "DOC", "HSIC", "HSY", "HES", "HPE", "HLT", "HOLX", "HD", "HON", "HRL", "HST",
    "HWM", "HPQ", "HUBB", "HUM", "HBAN", "HII", "IBM", "IEX", "IDXX", "ITW",
    "INCY", "IR", "PODD", "INTC", "ICE", "IFF", "IP", "IPG", "INTU", "ISRG", "IVZ",
    "INVH", "IQV", "IRM", "JBHT", "JBL", "JKHY", "J", "JNJ", "JCI", "JPM", "JNPR",
    "K", "KVUE", "KDP", "KEY", "KEYS", "KMB", "KIM", "KMI", "KKR", "KLAC", "KHC",
    "KR", "LHX", "LH", "LRCX", "LW", "LVS", "LDOS", "LEN", "LLY", "LIN", "LYV",
    "LKQ", "LMT", "L", "LOW", "LULU", "LYB", "MTB", "MRO", "MPC", "MKTX", "MAR",
    "MMC", "MLM", "MAS", "MA", "MTCH", "MKC", "MCD", "MCK", "MDT", "MRK", "META",
    "MET", "MTD", "MGM", "MCHP", "MU", "MSFT", "MAA", "MRNA", "MHK", "MOH", "TAP",
    "MDLZ", "MPWR", "MNST", "MCO", "MS", "MOS", "MSI", "MSCI", "NDAQ", "NTAP",
    "NFLX", "NEM", "NWSA", "NWS", "NEE", "NKE", "NI", "NDSN", "NSC", "NTRS", "NOC",
    "NCLH", "NRG", "NUE", "NVDA", "NVR", "NXPI", "ORLY", "OXY", "ODFL", "OMC",
    "ON", "OKE", "ORCL", "OTIS", "PCAR", "PKG", "PLTR", "PANW", "PARA", "PH",
    "PAYX", "PAYC", "PYPL", "PNR", "PEP", "PFE", "PCG", "PM", "PSX", "PNW", "PNC",
    "POOL", "PPG", "PPL", "PFG", "PG", "PGR", "PLD", "PRU", "PEG", "PTC", "PSA",
    "PHM", "QRVO", "PWR", "QCOM", "DGX", "RL", "RJF", "RTX", "O", "REG", "REGN",
    "RF", "RSG", "RMD", "RVTY", "ROK", "ROL", "ROP", "ROST", "RCL", "SPGI", "CRM",
    "SBAC", "SLB", "STX", "SRE", "NOW", "SHW", "SPG", "SWKS", "SJM", "SW", "SNA",
    "SOLV", "SO", "LUV", "SWK", "SBUX", "STT", "STLD", "STE", "SYK", "SMCI", "SYF",
    "SNPS", "SYY", "TMUS", "TROW", "TTWO", "TPR", "TRGP", "TGT", "TEL", "TDY",
    "TFX", "TER", "TSLA", "TXN", "TXT", "TMO", "TJX", "TSCO", "TT", "TDG", "TRV",
    "TRMB", "TFC", "TYL", "TSN", "USB", "UBER", "UDR", "ULTA", "UNP", "UAL", "UPS",
    "URI", "UNH", "UHS", "VLO", "VTR", "VLTO", "VRSN", "VRSK", "VZ", "VRTX", "VTRS",
    "VICI", "V", "VST", "VMC", "WRB", "GWW", "WAB", "WBA", "WMT", "DIS", "WBD",
    "WM", "WAT", "WEC", "WFC", "WELL", "WST", "WDC", "WY", "WMB", "WTW", "WYNN",
    "XEL", "XYL", "YUM", "ZBRA", "ZBH", "ZTS"]))

# Set a static expected growth rate
Expected_Growth = 8.0

# Add progress bar for ticker processing
for ticker_symbol in tqdm(ticker_symbols, desc="Processing Tickers", ncols=100):
    try:
        # Fetch data using yfinance
        ticker = yf.Ticker(ticker_symbol)
        financials = ticker.financials
        balance_sheet = ticker.balance_sheet
        info = ticker.info

        # Extract relevant data
        data = {
            "Revenue": financials.loc["Total Revenue"].values[0] if "Total Revenue" in financials.index else 0,
            "Cost_of_goods_sold": financials.loc["Cost Of Revenue"].values[0] if "Cost Of Revenue" in financials.index else 0,
            "Net_Income": financials.loc["Net Income"].values[0] if "Net Income" in financials.index else 0,
            "Share_holder_Equity": balance_sheet.loc["Stockholders Equity"].values[0] if "Stockholders Equity" in balance_sheet.index else 0,
            "SGA_and_A": financials.loc["Selling General And Administration"].values[0] if "Selling General And Administration" in financials.index else 0,
            "Total_debt": balance_sheet.loc["Total Debt"].values[0] if "Total Debt" in balance_sheet.index else 0,
            "current_asset": balance_sheet.loc["Total Assets"].values[0] if "Total Assets" in balance_sheet.index else 0,
            "current_liability": balance_sheet.loc["Total Liabilities Net Minority Interest"].values[0] if "Total Liabilities Net Minority Interest" in balance_sheet.index else 0,
            "Cash_and_Cash_Equivalents": balance_sheet.loc["Cash And Cash Equivalents"].values[0] if "Cash And Cash Equivalents" in balance_sheet.index else 0,
            "earnings_per_share": info.get("trailingEps"),
            "growth_rate": Expected_Growth,
            "corporate_bond_yield": 4.6,  # Assuming a fixed value
            "stock_price": info.get("currentPrice"),
            "Quick_ratio": ((balance_sheet.loc["Current Assets"].values[0] - balance_sheet.loc["Inventory"].values[0]) / balance_sheet.loc["Current Liabilities"].values[0]) if all(key in balance_sheet.index for key in ["Current Assets", "Inventory", "Current Liabilities"]) else None,
            "ROA": (financials.loc["Net Income"].values[0] / balance_sheet.loc["Total Assets"].values[0]) * 100 if "Net Income" in financials.index and "Total Assets" in balance_sheet.index else None        
        }

        # Calculate NOPAT and Invested Capital for ROIC
        operating_income = financials.loc["Operating Income"].values[0] if "Operating Income" in financials.index else 0
        tax_rate = info.get("effectiveTaxRate", 0.21)  # Default to 21% if not available
        nopat = operating_income * (1 - tax_rate)

        total_assets = balance_sheet.loc["Total Assets"].values[0] if "Total Assets" in balance_sheet.index else 0
        current_liabilities = balance_sheet.loc["Current Liabilities"].values[0] if "Current Liabilities" in balance_sheet.index else 0
        cash_and_cash_equivalents = data["Cash_and_Cash_Equivalents"]

        invested_capital = total_assets - current_liabilities - cash_and_cash_equivalents
        roic = nopat / invested_capital if invested_capital != 0 else 0

        data["ROIC"] = roic * 100  # Convert to percentage

        # Initialize variables for scoring
        a = 0
        b = 0
        c = 0

        # Gross Profit Margin
        Gross_Profit_Margin = ((data["Revenue"] - data["Cost_of_goods_sold"]) / data["Revenue"]) * 100 if data["Revenue"] != 0 else 0
        if Gross_Profit_Margin > 40:
            a += 1

        # Return on Equity (ROE)
        Return_on_equity = (data["Net_Income"] / data["Share_holder_Equity"]) * 100 if data["Share_holder_Equity"] != 0 else 0
        if Return_on_equity > 20:
            a += 1

        # ROIC
        if data["ROIC"] > 30:
            a += 1

        # SG&A to Revenue
        SGA_to_Revenue = (data["SGA_and_A"] / data["Revenue"]) * 100 if data["Revenue"] != 0 and data["SGA_and_A"] is not None else None
        if SGA_to_Revenue is not None and SGA_to_Revenue < 30:
            a += 1

        # Debt Level
        Debt_Equity = data["Total_debt"] / data["Share_holder_Equity"] if data["Share_holder_Equity"] != 0 else 0
        if Debt_Equity < 0.8:
            b += 1

        # Current Ratio
        Current_Ratio = data["current_asset"] / data["current_liability"] if data["current_liability"] != 0 else 0
        if Current_Ratio > 1.5:
            c += 1

        # Cash Ratio
        Cash_Ratio = data["Cash_and_Cash_Equivalents"] / data["current_liability"] if data["current_liability"] != 0 else 0
        if Cash_Ratio > 1:
            c += 1

        # Quick Ratio
        if data["Quick_ratio"] is not None and data["Quick_ratio"] > 1:
            c += 1

        if c == 3:
            b += 1
        elif c == 2:
            b += 0.5
        elif c == 1:
            b += 0.25

        # Return on Assets (ROA)
        if data.get("ROA") is not None and data["ROA"] > 10:
            b += 1

        x = (a + b) / 8

        # Calculate intrinsic value
        intrinsic_value = data["earnings_per_share"] * (8.5 + 2 * data["growth_rate"]) * 4.4 / data["corporate_bond_yield"] if data["earnings_per_share"] is not None else 0

        # Calculate margin of safety
        margin_of_safety = (intrinsic_value - data["stock_price"]) / intrinsic_value if intrinsic_value > 0 else None

        # Normalize the margin of safety
        normalized_value = 0
        if margin_of_safety is not None:
            if margin_of_safety >= 0.4:
                normalized_value = 1
            elif margin_of_safety <= 0:
                normalized_value = 0
            else:
                normalized_value = margin_of_safety / 0.4

        # Calculate the rating score
        rating = (normalized_value + x) * 50

        # Insert into SQL database
        cursor.execute("""
        INSERT INTO SP500 (company, stock_price, intrinsic_value, margin_of_safety, rating, gross_profit_margin, return_on_equity, roic, sga_to_revenue, debt_to_equity, current_ratio, cash_ratio, quick_ratio, roa)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            ticker_symbol,
            data['stock_price'],
            intrinsic_value,
            margin_of_safety,
            rating,
            Gross_Profit_Margin,
            Return_on_equity,
            data['ROIC'],
            SGA_to_Revenue,
            Debt_Equity,
            Current_Ratio,
            Cash_Ratio,
            data['Quick_ratio'],
            data.get('ROA')
        ))

    except Exception as e:
        print(f"Could not process {ticker_symbol}: {e}")

# Commit and close the connection
conn.commit()
cursor.close()
conn.close()

print("Data has been successfully saved to the database.")

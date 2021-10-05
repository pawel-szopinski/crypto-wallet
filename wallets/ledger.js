const fetch = require('node-fetch');

const name = 'Ledger';
const uri = 'https://bitbay.net/API/Public/$ticker/ticker.json';
const btcPlnTicker = 'BTCPLN';
const ethPlnTicker = 'ETHPLN';
const btcUsdtTicker = 'BTCUSDT';
const ethUsdtTicker = 'ETHUSDT';

async function getSingleCoinValue(ticker, amount) {
    const response = await fetch(uri.replace('$ticker', ticker));
    const json = await response.json();

    return json.ask * amount;
}

async function getLedgerData(btcAmount, ethAmount, plnInvested) {
    let plnBalance = 0;
    let usdtBalance = 0;
    let plnCoins = [];
    let usdtCoins = [];

    if (btcAmount !== 0) {
        plnCoins.push(getSingleCoinValue(btcPlnTicker, btcAmount));
        usdtCoins.push(getSingleCoinValue(btcUsdtTicker, btcAmount));
    }

    if (ethAmount !== 0) {
        plnCoins.push(getSingleCoinValue(ethPlnTicker, ethAmount));
        usdtCoins.push(getSingleCoinValue(ethUsdtTicker, ethAmount));
    }

    if (plnCoins.length > 0) {
        plnBalance = await Promise.all(plnCoins)
            .then((values) => {
                return values.reduce((a, b) => a + b, 0);
            });

        usdtBalance = await Promise.all(usdtCoins)
            .then((values) => {
                return values.reduce((a, b) => a + b, 0);
            });
    }

    return {
        name,
        plnInvested,
        plnBalance,
        plnProfit: plnBalance - plnInvested,
        usdtBalance
    }
}

module.exports = getLedgerData;
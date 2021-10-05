const fetch = require('node-fetch');
const crypto = require('crypto');
const propertiesReader = require('properties-reader');

const props = propertiesReader(`${require('path').resolve(__dirname, '..')}/app.properties`);

const name = 'Binance';
const domain = 'https://api.binance.com';
const balanceEntpoint = '/api/v3/account?timestamp=$ts&signature=$sig';
const usdtCoinEndpoint = '/api/v3/ticker/price?symbol=$symbolUSDT';

const apiKey = props.get('binance.apiKey');
const secret = props.get('binance.secret');

async function getWallet() {
    const ts = new Date().getTime();

    const signature = crypto
        .createHmac('sha256', secret)
        .update(`timestamp=${ts}`)
        .digest('hex');

    const args = {
        headers: {
            'X-MBX-APIKEY': apiKey
        }
    }

    const res = await fetch(
        `${domain}${balanceEntpoint.replace('$ts', ts).replace('$sig', signature)}`, args);

    const data = await res.json();

    return data.balances
        .filter(el => parseFloat(el.free) > 0)
        .map(el => {
            const container = {};

            container.asset = el.asset;
            container.availableBalance = parseFloat(el.free);

            return container;
        });
}

async function getSingleCoinUsdtValue(symbol, amount) {
    if (symbol === 'USDT' || symbol === 'USDC' || symbol === 'BUSD') {
        return amount;
    }

    const response = await fetch(`${domain}${usdtCoinEndpoint.replace('$symbol', symbol)}`);
    const json = await response.json();

    return parseFloat(json.price) * amount;
}

async function getUsdtBalance(wallet) {
    let allCoinsUsdtValues = [];

    wallet.forEach(coin => allCoinsUsdtValues.push(getSingleCoinUsdtValue(coin.asset, coin.availableBalance)));

    return await Promise
        .all(allCoinsUsdtValues)
        .then((values) => {
            return values.reduce((a, b) => a + b, 0);
        });
}

async function getBinanceData(plnInvested, usdtPlnAsk) {
    const wallet = await getWallet();
    const usdtBalance = await getUsdtBalance(wallet);
    const plnBalance = usdtBalance * usdtPlnAsk;

    return {
        name,
        plnInvested,
        plnBalance,
        plnProfit: plnBalance - plnInvested,
        usdtBalance
    };
}

module.exports = getBinanceData;
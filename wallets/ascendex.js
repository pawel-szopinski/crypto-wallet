const fetch = require('node-fetch');
const crypto = require('crypto');
const propertiesReader = require('properties-reader');

const props = propertiesReader(`${require('path').resolve(__dirname, '..')}/app.properties`);

const name = 'AscendEX';
const domain = 'https://ascendex.com';
const balanceEndpoint = '/4/api/pro/v1/cash/balance';
const balanceApiPath = 'balance';
const usdtCoinEndpoint = '/api/pro/v1/ticker?symbol=$symbol/USDT';

const apiKey = props.get('ascendex.apiKey');
const secret = props.get('ascendex.secret');

async function getWallet() {
    const ts = new Date().getTime();

    const signature = crypto
        .createHmac('sha256', secret).update(`${ts}${balanceApiPath}`).digest('hex');

    const args = {
        headers: {
            'x-auth-key': apiKey,
            'x-auth-signature': signature,
            'x-auth-timestamp': ts
        }
    }

    const res = await fetch(`${domain}${balanceEndpoint}`, args);
    const json = await res.json();

    return json.data;
}

async function getSingleCoinUsdtValue(symbol, amount) {
    //remove -S, since it only means that this is staked coin
    const symbolParsed = symbol.replace('-S', '');

    if (symbolParsed === 'USDT' || symbolParsed === 'USDC') {
        return amount;
    }

    const response = await fetch(`${domain}${usdtCoinEndpoint.replace('$symbol', symbolParsed)}`);
    const json = await response.json();

    return parseFloat(json.data.ask[0]) * amount;
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

async function getAscendexData(plnInvested, usdtPlnAsk) {
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

module.exports = getAscendexData;
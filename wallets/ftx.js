const fetch = require('node-fetch');
const crypto = require('crypto');
const propertiesReader = require('properties-reader');

const props = propertiesReader(`${require('path').resolve(__dirname, '..')}/app.properties`);

const name = 'FTX';
const domain = 'https://ftx.com';
const usdEndpoint = '/api/wallet/all_balances'
const method = 'GET';

const apiKey = props.get('ftx.apiKey');
const secret = props.get('ftx.secret');

async function getWallet() {
    const ts = new Date().getTime();

    const signature = crypto
        .createHmac('sha256', secret).update(`${ts}${method}${usdEndpoint}`).digest('hex');

    const args = {
        headers: {
            'FTX-KEY': apiKey,
            'FTX-TS': ts,
            'FTX-SIGN': signature
        }
    }

    const res = await fetch(`${domain}${usdEndpoint}`, args);
    const json = await res.json();

    const coins = json.result.main;
    let balance = 0;

    coins.forEach(c => {
        balance += c.usdValue;
    })

    return balance;
}

async function getFtxData(plnInvested, usdtPlnAsk) {
    const usdtBalance = await getWallet();
    const plnBalance = usdtBalance * usdtPlnAsk;

    return {
        name,
        plnInvested,
        plnBalance,
        plnProfit: plnBalance - plnInvested,
        usdtBalance
    }
}

module.exports = getFtxData;
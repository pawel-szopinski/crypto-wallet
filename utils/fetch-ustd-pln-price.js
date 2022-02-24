const fetch = require('node-fetch');

const uri = 'https://api.zonda.exchange/rest/trading/ticker/USDT-PLN';

async function fetchUsdtPlnPrice() {
    const res = await fetch(uri);
    const data = await res.json();

    return data.ticker.lowestAsk;
}

module.exports = fetchUsdtPlnPrice;
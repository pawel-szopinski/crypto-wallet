const fetch = require('node-fetch');

const uri = 'https://bitbay.net/API/Public/USDTPLN/ticker.json';

async function fetchUsdtPlnPrice() {
    const res = await fetch(uri);
    const data = await res.json();

    return data.ask;
}

module.exports = fetchUsdtPlnPrice;
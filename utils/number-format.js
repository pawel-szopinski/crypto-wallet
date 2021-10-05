function formatExchangeDataOutput(exchanges) {
    exchanges.forEach(e => {
        e.plnBalance = numberWithCommas(parseInt(e.plnBalance));
        e.plnProfit = numberWithCommas(parseInt(e.plnProfit));
        e.plnInvested = numberWithCommas(parseInt(e.plnInvested));
        e.usdtBalance = numberWithCommas(parseInt(e.usdtBalance));
    });
}

function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = formatExchangeDataOutput;
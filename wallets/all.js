const ascendexWallet = require('./ascendex');
const binanceWallet = require('./binance');
const ftxWallet = require('./ftx');
const ledgerWallet = require('./ledger');
const usdtPlnConverter = require('../utils/fetch-ustd-pln-price');

async function wallets(ascendexPlnInvested, binancePlnInvested, ftxPlnInvested,
                      ledgerBtcAmount, ledgerEthAmount, ledgerPlnInvested) {
    const usdtPlnAsk = await usdtPlnConverter();

    const [ascendex, binance, ftx, ledger] = await Promise.all(
        [
            ascendexWallet(ascendexPlnInvested, usdtPlnAsk),
            binanceWallet(binancePlnInvested, usdtPlnAsk),
            ftxWallet(ftxPlnInvested, usdtPlnAsk),
            ledgerWallet(ledgerBtcAmount, ledgerEthAmount, ledgerPlnInvested)
        ]);

    const combined = {
        name: 'Combined',
        plnInvested: ascendex.plnInvested + ledger.plnInvested + binance.plnInvested + ftx.plnInvested,
        plnBalance: ascendex.plnBalance + ledger.plnBalance + binance.plnBalance + ftx.plnBalance,
        plnProfit: ascendex.plnProfit + ledger.plnProfit + binance.plnProfit + ftx.plnProfit,
        usdtBalance: ascendex.usdtBalance + ledger.usdtBalance + binance.usdtBalance + ftx.usdtBalance
    }

    return [combined, ascendex, ftx, binance, ledger];
}

module.exports = wallets;
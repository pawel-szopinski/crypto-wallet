const wallet = require('./wallets/all');
const formatExchangeDataOutput = require('./utils/number-format');
const argv = require('minimist')(process.argv.slice(2));

async function printBalances() {

    if (isNaN(argv.ascendexPlnInvested) || isNaN(argv.binancePlnInvested) || isNaN(argv.ftxPlnInvested) ||
        isNaN(argv.ledgerBtcAmount) || isNaN(argv.ledgerEthAmount) || isNaN(argv.ledgerPlnInvested)) {
        return 'Fix your argument variables!';
    }

    const exchanges = await wallet(argv.ascendexPlnInvested, argv.binancePlnInvested, argv.ftxPlnInvested,
        argv.ledgerBtcAmount, argv.ledgerEthAmount, argv.ledgerPlnInvested);

    formatExchangeDataOutput(exchanges);

    let formatted = '\n';

    exchanges.forEach(e => {
        formatted = formatted + `<b>${e.name}</b>\n` +
            `Balance PLN:  <b>${e.plnBalance}</b>\n` +
            `Balance USD:  ${e.usdtBalance}\n` +
            `P/L PLN:      ${e.plnProfit}\n` +
            `Invested PLN: ${e.plnInvested}\n\n`;
    });

    return formatted.trimEnd();
}

printBalances().then(v => console.log(v));
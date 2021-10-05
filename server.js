const express = require('express');
const nocache = require('nocache');
const wallet = require('./wallets/all');
const formatExchangeDataOutput = require('./utils/number-format');

const app = express();

app.use(nocache());
app.set('etag', false);

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const q = req.query;

    if (isNaN(q.ascendexPlnInvested) || isNaN(q.binancePlnInvested) || isNaN(q.ftxPlnInvested) ||
        isNaN(q.ledgerBtcAmount) || isNaN(q.ledgerEthAmount) || isNaN(q.ledgerPlnInvested)) {
        res.status(400).send('Error! All query params (numbers) are required:<br>' +
            '- ascendexPlnInvested<br>' +
            '- binancePlnInvested<br>' +
            '- ftxPlnInvested<br>' +
            '- ledgerBtcAmount<br>' +
            '- ledgerEthAmount<br>' +
            '- ledgerPlnInvested');
        return;
    }

    const wallets = await wallet(parseFloat(q.ascendexPlnInvested), parseFloat(q.binancePlnInvested), parseFloat(q.ftxPlnInvested),
        parseFloat(q.ledgerBtcAmount), parseFloat(q.ledgerEthAmount), parseFloat(q.ledgerPlnInvested));

    formatExchangeDataOutput(wallets);

    res.render('index', {
        wallets
    });
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port: ${port}`));
const router = require('express').Router();
const paypal = require('paypal-rest-sdk');
const paypalConfig = require('../config/paypal');

paypal.configure(paypalConfig);

const { products } = require('../config/products');

router.get('/', (req, res) => res.render('index', { products }));

router.post('/buy', (req, res) => {
    res.send({ success: true }); //Quando cliente clicar pra comprar
});

router.get('/success', (req, res) => {
    res.send('success'); //Quando cliente pagar a compra
});

router.get('/cancel', (req, res) => {
    res.send('cancel'); //Quando cliente cancelar a compra
});

module.exports = router;
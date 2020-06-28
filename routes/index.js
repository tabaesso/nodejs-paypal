const router = require('express').Router();
const paypal = require('paypal-rest-sdk');
const paypalConfig = require('../config/paypal');

paypal.configure(paypalConfig);

const { products } = require('../config/products');

router.get('/', (req, res) => res.render('index', { products }));

let valor = {};

router.post('/buy', (req, res) => {
    const productId = req.query.id;
    const product = products.reduce((all, item) => item.id.toString() === productId ? item : all, {})

    if(!product.id) return res.render('index', { products });

    const carrinho = [{
        "name": product.titulo,
        "sku": product.id,
        "price": product.preco.toFixed(2),
        "currency": "BRL",
        "quantity": 1,
    }];

    valor = { "currency":"BRL", "total":product.preco.toFixed(2)};
    const descricao = product.descricao;

    const json_pagamento = {
        "intent": "sale",
        "payer": { payment_method: "paypal" },
        "redirect_urls": {
            "return_url":"http://localhost:3000/success",
            "cancel_url":"http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {"items": carrinho},
            "amount": valor,
            "description": descricao
        }]
    };

    paypal.payment.create(json_pagamento, (err, pagamento) => {
        if(err) {
            console.warn(err);
        } else {
            pagamento.links.forEach((link) => {
                if(link.rel === 'approval_url') return res.redirect(link.href); //armazenar esses dados no banco de dados, pra depois cobrar o cliente do valor do produto e pra trocar a variável global de valor pelo dado inserido no bd
            })
        }
    });
});

router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": valor
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
        if(error){
            console.warn(error.response);
            throw error;
        } else {
            console.log("Pagamento concluído com sucesso!");
            console.log(JSON.stringify(payment)); //importante inserir esses dados no banco pra constar que o pagamento foi concluído
            res.render('success'); //Quando cliente pagar a compra
        }
    })
});

router.get('/cancel', (req, res) => {
    res.render('cancel'); //Quando cliente cancelar a compra
});

module.exports = router;
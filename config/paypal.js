const dotenv = require('dotenv');

dotenv.config();

const { PAYPAL_MODE, PAYPAL_CLIENT, PAYPAL_SECRET } = process.env;

module.exports = {
	mode: PAYPAL_MODE,
    client_id: PAYPAL_CLIENT,
    client_secret: PAYPAL_SECRET
};
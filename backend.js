const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');

app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = process.env.PROD_ACCESS_TOKEN;

app.post('/crear-preferencia', async (req, res) => {
    try {
        const preference = {
            items: [
                {
                    title: 'Curso de Producto',
                    quantity: 1,
                    unit_price: 15000,
                    currency_id: 'ARS',
                },
            ],
            back_urls: {
                success: 'https://crissanchez.me/gracias',
                failure: 'https://crissanchez.me/error',
                pending: 'https://crissanchez.me/pendiente',
            },
            auto_return: 'approved',
        };

        const response = await axios.post(
            'https://api.mercadopago.com/checkout/preferences',
            preference,
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json({ init_point: response.data.init_point });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Error al crear preferencia' });
    }
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));

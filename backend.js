const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

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
                success: 'https://www.crissanchez.me/gracias',
                failure: 'https://www.crissanchez.me/error',
                pending: 'https://www.crissanchez.me/pendiente',
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
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al crear preferencia' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

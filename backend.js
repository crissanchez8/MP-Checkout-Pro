const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

app.post('/crear-preferencia', async (req, res) => {
    console.log('🟡 Body recibido en /crear-preferencia:', req.body);
    const cursoElegido = req.body.curso?.toLowerCase(); // 🔒 robustez máxima
    console.log('Curso recibido:', cursoElegido);

    const cursosDisponibles = {
        fundamentals: {
            title: 'Curso Product Fundamentals',
            unit_price: 66000,
            description:
                'Un curso intensivo para aprender las bases del rol de Product Manager.',
            picture_url:
                'https://lumi-uploads-prod.s3.us-east-1.amazonaws.com/Portada%20Curso%20-%20Product%20Fundamentals.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAULCCUWMPDWQUNXXR%2F20250628%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250628T134209Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDU14G%2FDB8GJzgQwYFxNqR0EcnWc9oOsFkLhT2rCPB0wgIhAO9Bbgl%2FtTMvW0zv1wVmiS2yC8jeJnHV72IQfdOrj8sMKuMCCI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMMjk4NjM5OTk1Njc4IgyZDTvwGd46XlHQ3lcqtwKj9dvmizFANvKhHBGCsDQouGICb09P8OYLsGS4PJWJvgvnNMQr6aKyd8crUaNZK2uGoTLtCtw9jOhpQpFfqwsg4w3r6JRdnuURUfWw20TJ%2BdBfuHBJuPHWatCd6NGOLyd0iSjRp80VFr8yQrsIVVzFqj1745PqAudymtd1rMg%2BbsEgUBG9Ga5u5P7xruuVJ0hB84gV2ZOvGlg06whf2qyMVf3CYri2jW2oXagUcRtUw%2FNVoeHxR%2BLTm1ILPkcVeAO59T2SM15jntqbZ6PLoqzK7EWcCy7f58CkPSUTywiU3pqN6Wu1lHDIous8MbaMpGzZ%2BCIDh23AT31oioJhsTZ37xO0d8jruNrriSmWvvrDlJBAh4%2FYUS1MUmcqwoTDAcN9oeiVDXwcP%2FKL%2BBofMwNTPqUpMfUQszC74f%2FCBjqsAvlSSKDvhrLd06mRhkH46YPkavH7mBTT6n2LuWFj%2BuSEcWeqTa7B5jBJrt2AgCtlkLnYz5x9Byvd95vpi%2Fu8XZPM104SyPffMMC8ZyZsRqBWSsXOnVtUQdRqxDl%2BKQJPBmYnSIrOSrz2bWaV9OEi07F5ZuXlqs%2BbYOqpxUqz7foq5TxxS3SaGPoPWZ%2BcLwPL5XCtAp%2BjV44eAKYceQ5FyyCs9WVCtkbB610GCgTttRHaKXKPg3sLlMDUNdTKBk2vRGJefd9%2FObac0iyMG71OFjF5c%2F%2FV5edDD%2BeVL%2FkJWui9u5%2FnMWZ6QvKVJ%2FhVglXLiST%2BFjyMepkvlgRtlJno2the5hYTIt203cDnpNoaCdIMDAK8x0kUM4z6LQEgUJczQ6oglP%2B1DjtD8Pudsg%3D%3D&X-Amz-Signature=541dc2a50e10757701c460845b53e1afeeb44c14e62da2d39b8befc91eefbe91&X-Amz-SignedHeaders=host&response-content-disposition=inline',
        },
        analytics: {
            title: 'Curso Product Analytics',
            unit_price: 120000,
            description:
                'Aprendé a medir y tomar decisiones basadas en datos con herramientas modernas.',
            picture_url:
                'https://lumi-uploads-prod.s3.us-east-1.amazonaws.com/Portada%20Curso%20-%20Product%20Analytics.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAULCCUWMPDWQUNXXR%2F20250628%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250628T134215Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDU14G%2FDB8GJzgQwYFxNqR0EcnWc9oOsFkLhT2rCPB0wgIhAO9Bbgl%2FtTMvW0zv1wVmiS2yC8jeJnHV72IQfdOrj8sMKuMCCI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMMjk4NjM5OTk1Njc4IgyZDTvwGd46XlHQ3lcqtwKj9dvmizFANvKhHBGCsDQouGICb09P8OYLsGS4PJWJvgvnNMQr6aKyd8crUaNZK2uGoTLtCtw9jOhpQpFfqwsg4w3r6JRdnuURUfWw20TJ%2BdBfuHBJuPHWatCd6NGOLyd0iSjRp80VFr8yQrsIVVzFqj1745PqAudymtd1rMg%2BbsEgUBG9Ga5u5P7xruuVJ0hB84gV2ZOvGlg06whf2qyMVf3CYri2jW2oXagUcRtUw%2FNVoeHxR%2BLTm1ILPkcVeAO59T2SM15jntqbZ6PLoqzK7EWcCy7f58CkPSUTywiU3pqN6Wu1lHDIous8MbaMpGzZ%2BCIDh23AT31oioJhsTZ37xO0d8jruNrriSmWvvrDlJBAh4%2FYUS1MUmcqwoTDAcN9oeiVDXwcP%2FKL%2BBofMwNTPqUpMfUQszC74f%2FCBjqsAvlSSKDvhrLd06mRhkH46YPkavH7mBTT6n2LuWFj%2BuSEcWeqTa7B5jBJrt2AgCtlkLnYz5x9Byvd95vpi%2Fu8XZPM104SyPffMMC8ZyZsRqBWSsXOnVtUQdRqxDl%2BKQJPBmYnSIrOSrz2bWaV9OEi07F5ZuXlqs%2BbYOqpxUqz7foq5TxxS3SaGPoPWZ%2BcLwPL5XCtAp%2BjV44eAKYceQ5FyyCs9WVCtkbB610GCgTttRHaKXKPg3sLlMDUNdTKBk2vRGJefd9%2FObac0iyMG71OFjF5c%2F%2FV5edDD%2BeVL%2FkJWui9u5%2FnMWZ6QvKVJ%2FhVglXLiST%2BFjyMepkvlgRtlJno2the5hYTIt203cDnpNoaCdIMDAK8x0kUM4z6LQEgUJczQ6oglP%2B1DjtD8Pudsg%3D%3D&X-Amz-Signature=c846671ea6385bddfdde25a728a012a772378deccd899ea41addad80dcabc46a&X-Amz-SignedHeaders=host&response-content-disposition=inline',
        },
    };

    const curso = cursosDisponibles[cursoElegido];

    if (!curso) {
        // En lugar de enviar error, podés redirigir, loguear o devolver un fallback si querés
        console.warn('Curso inválido recibido:', cursoElegido);
        return res.status(400).json({ error: 'Curso inválido' });
    }

    const preference = {
        items: [
            {
                title: curso.title,
                description: curso.description,
                quantity: 1,
                unit_price: curso.unit_price,
                currency_id: 'ARS',
                picture_url: curso.picture_url,
            },
        ],
        back_urls: {
            success: 'https://www.crissanchez.me/gracias',
            failure: 'https://www.crissanchez.me/error',
            pending: 'https://www.crissanchez.me/pendiente',
        },
        auto_return: 'approved',
    };

    try {
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
        console.error(
            'Error al crear preferencia:',
            error.response?.data || error.message
        );
        res.status(500).json({
            error: 'No se pudo crear la preferencia de pago',
        });
    }
});

/* app.post('/crear-preferencia', async (req, res) => {
    const cursoElegido = req.body.curso; // 'fundamentals' o 'analytics'

    let curso = {};

    if (cursoElegido === 'fundamentals') {
        curso = {
            title: 'Curso Product Fundamentals',
            unit_price: 66000,
            description:
                'Un curso intensivo para aprender las bases del rol de Product Manager.',
            picture_url:
                'https://lumi-uploads-prod.s3.us-east-1.amazonaws.com/Portada%20Curso%20-%20Product%20Fundamentals.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAULCCUWMPDWQUNXXR%2F20250628%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250628T134209Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDU14G%2FDB8GJzgQwYFxNqR0EcnWc9oOsFkLhT2rCPB0wgIhAO9Bbgl%2FtTMvW0zv1wVmiS2yC8jeJnHV72IQfdOrj8sMKuMCCI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMMjk4NjM5OTk1Njc4IgyZDTvwGd46XlHQ3lcqtwKj9dvmizFANvKhHBGCsDQouGICb09P8OYLsGS4PJWJvgvnNMQr6aKyd8crUaNZK2uGoTLtCtw9jOhpQpFfqwsg4w3r6JRdnuURUfWw20TJ%2BdBfuHBJuPHWatCd6NGOLyd0iSjRp80VFr8yQrsIVVzFqj1745PqAudymtd1rMg%2BbsEgUBG9Ga5u5P7xruuVJ0hB84gV2ZOvGlg06whf2qyMVf3CYri2jW2oXagUcRtUw%2FNVoeHxR%2BLTm1ILPkcVeAO59T2SM15jntqbZ6PLoqzK7EWcCy7f58CkPSUTywiU3pqN6Wu1lHDIous8MbaMpGzZ%2BCIDh23AT31oioJhsTZ37xO0d8jruNrriSmWvvrDlJBAh4%2FYUS1MUmcqwoTDAcN9oeiVDXwcP%2FKL%2BBofMwNTPqUpMfUQszC74f%2FCBjqsAvlSSKDvhrLd06mRhkH46YPkavH7mBTT6n2LuWFj%2BuSEcWeqTa7B5jBJrt2AgCtlkLnYz5x9Byvd95vpi%2Fu8XZPM104SyPffMMC8ZyZsRqBWSsXOnVtUQdRqxDl%2BKQJPBmYnSIrOSrz2bWaV9OEi07F5ZuXlqs%2BbYOqpxUqz7foq5TxxS3SaGPoPWZ%2BcLwPL5XCtAp%2BjV44eAKYceQ5FyyCs9WVCtkbB610GCgTttRHaKXKPg3sLlMDUNdTKBk2vRGJefd9%2FObac0iyMG71OFjF5c%2F%2FV5edDD%2BeVL%2FkJWui9u5%2FnMWZ6QvKVJ%2FhVglXLiST%2BFjyMepkvlgRtlJno2the5hYTIt203cDnpNoaCdIMDAK8x0kUM4z6LQEgUJczQ6oglP%2B1DjtD8Pudsg%3D%3D&X-Amz-Signature=541dc2a50e10757701c460845b53e1afeeb44c14e62da2d39b8befc91eefbe91&X-Amz-SignedHeaders=host&response-content-disposition=inline',
        };
    } else if (cursoElegido === 'analytics') {
        curso = {
            title: 'Curso Product Analytics',
            unit_price: 120000,
            description:
                'Aprendé a medir y tomar decisiones basadas en datos con herramientas modernas.',
            picture_url:
                'https://lumi-uploads-prod.s3.us-east-1.amazonaws.com/Portada%20Curso%20-%20Product%20Analytics.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAULCCUWMPDWQUNXXR%2F20250628%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250628T134215Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDU14G%2FDB8GJzgQwYFxNqR0EcnWc9oOsFkLhT2rCPB0wgIhAO9Bbgl%2FtTMvW0zv1wVmiS2yC8jeJnHV72IQfdOrj8sMKuMCCI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMMjk4NjM5OTk1Njc4IgyZDTvwGd46XlHQ3lcqtwKj9dvmizFANvKhHBGCsDQouGICb09P8OYLsGS4PJWJvgvnNMQr6aKyd8crUaNZK2uGoTLtCtw9jOhpQpFfqwsg4w3r6JRdnuURUfWw20TJ%2BdBfuHBJuPHWatCd6NGOLyd0iSjRp80VFr8yQrsIVVzFqj1745PqAudymtd1rMg%2BbsEgUBG9Ga5u5P7xruuVJ0hB84gV2ZOvGlg06whf2qyMVf3CYri2jW2oXagUcRtUw%2FNVoeHxR%2BLTm1ILPkcVeAO59T2SM15jntqbZ6PLoqzK7EWcCy7f58CkPSUTywiU3pqN6Wu1lHDIous8MbaMpGzZ%2BCIDh23AT31oioJhsTZ37xO0d8jruNrriSmWvvrDlJBAh4%2FYUS1MUmcqwoTDAcN9oeiVDXwcP%2FKL%2BBofMwNTPqUpMfUQszC74f%2FCBjqsAvlSSKDvhrLd06mRhkH46YPkavH7mBTT6n2LuWFj%2BuSEcWeqTa7B5jBJrt2AgCtlkLnYz5x9Byvd95vpi%2Fu8XZPM104SyPffMMC8ZyZsRqBWSsXOnVtUQdRqxDl%2BKQJPBmYnSIrOSrz2bWaV9OEi07F5ZuXlqs%2BbYOqpxUqz7foq5TxxS3SaGPoPWZ%2BcLwPL5XCtAp%2BjV44eAKYceQ5FyyCs9WVCtkbB610GCgTttRHaKXKPg3sLlMDUNdTKBk2vRGJefd9%2FObac0iyMG71OFjF5c%2F%2FV5edDD%2BeVL%2FkJWui9u5%2FnMWZ6QvKVJ%2FhVglXLiST%2BFjyMepkvlgRtlJno2the5hYTIt203cDnpNoaCdIMDAK8x0kUM4z6LQEgUJczQ6oglP%2B1DjtD8Pudsg%3D%3D&X-Amz-Signature=c846671ea6385bddfdde25a728a012a772378deccd899ea41addad80dcabc46a&X-Amz-SignedHeaders=host&response-content-disposition=inline',
        };
    } else {
        return res.status(400).json({ error: 'Curso inválido' });
    }

    const preference = {
        items: [
            {
                title: curso.title,
                description: curso.description,
                quantity: 1,
                unit_price: curso.unit_price,
                currency_id: 'ARS',
                picture_url: curso.picture_url,
            },
        ],
        back_urls: {
            success: 'https://www.crissanchez.me/gracias',
            failure: 'https://www.crissanchez.me/error',
            pending: 'https://www.crissanchez.me/pendiente',
        },
        auto_return: 'approved',
        payment_methods: {
            installments: 3,
        },
    };

    try {
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
        console.error(
            'Error al crear preferencia:',
            error.response?.data || error.message
        );
        res.status(500).json({
            error: 'No se pudo crear la preferencia de pago',
        });
    }
}); */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

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
        'product-fundamentals': {
            title: 'Curso Product Fundamentals',
            unit_price: 90000,
            description:
                'Un curso intensivo para aprender las bases del rol de Product Manager.',
            picture_url:
                'https://lumi-uploads-prod.s3.us-east-1.amazonaws.com/Portada%20Curso%20-%20Product%20Fundamentals.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAULCCUWMPDWQUNXXR%2F20250628%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250628T134209Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDU14G%2FDB8GJzgQwYFxNqR0EcnWc9oOsFkLhT2rCPB0wgIhAO9Bbgl%2FtTMvW0zv1wVmiS2yC8jeJnHV72IQfdOrj8sMKuMCCI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMMjk4NjM5OTk1Njc4IgyZDTvwGd46XlHQ3lcqtwKj9dvmizFANvKhHBGCsDQouGICb09P8OYLsGS4PJWJvgvnNMQr6aKyd8crUaNZK2uGoTLtCtw9jOhpQpFfqwsg4w3r6JRdnuURUfWw20TJ%2BdBfuHBJuPHWatCd6NGOLyd0iSjRp80VFr8yQrsIVVzFqj1745PqAudymtd1rMg%2BbsEgUBG9Ga5u5P7xruuVJ0hB84gV2ZOvGlg06whf2qyMVf3CYri2jW2oXagUcRtUw%2FNVoeHxR%2BLTm1ILPkcVeAO59T2SM15jntqbZ6PLoqzK7EWcCy7f58CkPSUTywiU3pqN6Wu1lHDIous8MbaMpGzZ%2BCIDh23AT31oioJhsTZ37xO0d8jruNrriSmWvvrDlJBAh4%2FYUS1MUmcqwoTDAcN9oeiVDXwcP%2FKL%2BBofMwNTPqUpMfUQszC74f%2FCBjqsAvlSSKDvhrLd06mRhkH46YPkavH7mBTT6n2LuWFj%2BuSEcWeqTa7B5jBJrt2AgCtlkLnYz5x9Byvd95vpi%2Fu8XZPM104SyPffMMC8ZyZsRqBWSsXOnVtUQdRqxDl%2BKQJPBmYnSIrOSrz2bWaV9OEi07F5ZuXlqs%2BbYOqpxUqz7foq5TxxS3SaGPoPWZ%2BcLwPL5XCtAp%2BjV44eAKYceQ5FyyCs9WVCtkbB610GCgTttRHaKXKPg3sLlMDUNdTKBk2vRGJefd9%2FObac0iyMG71OFjF5c%2F%2FV5edDD%2BeVL%2FkJWui9u5%2FnMWZ6QvKVJ%2FhVglXLiST%2BFjyMepkvlgRtlJno2the5hYTIt203cDnpNoaCdIMDAK8x0kUM4z6LQEgUJczQ6oglP%2B1DjtD8Pudsg%3D%3D&X-Amz-Signature=541dc2a50e10757701c460845b53e1afeeb44c14e62da2d39b8befc91eefbe91&X-Amz-SignedHeaders=host&response-content-disposition=inline',
        },
        'product-analytics-con-amplitude': {
            title: 'Curso Product Analytics',
            unit_price: 180000,
            description:
                'Aprendé a medir y tomar decisiones basadas en datos con herramientas modernas.',
            picture_url:
                'https://lumi-uploads-prod.s3.us-east-1.amazonaws.com/Portada%20Curso%20-%20Product%20Analytics.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAULCCUWMPDWQUNXXR%2F20250628%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250628T134215Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDU14G%2FDB8GJzgQwYFxNqR0EcnWc9oOsFkLhT2rCPB0wgIhAO9Bbgl%2FtTMvW0zv1wVmiS2yC8jeJnHV72IQfdOrj8sMKuMCCI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMMjk4NjM5OTk1Njc4IgyZDTvwGd46XlHQ3lcqtwKj9dvmizFANvKhHBGCsDQouGICb09P8OYLsGS4PJWJvgvnNMQr6aKyd8crUaNZK2uGoTLtCtw9jOhpQpFfqwsg4w3r6JRdnuURUfWw20TJ%2BdBfuHBJuPHWatCd6NGOLyd0iSjRp80VFr8yQrsIVVzFqj1745PqAudymtd1rMg%2BbsEgUBG9Ga5u5P7xruuVJ0hB84gV2ZOvGlg06whf2qyMVf3CYri2jW2oXagUcRtUw%2FNVoeHxR%2BLTm1ILPkcVeAO59T2SM15jntqbZ6PLoqzK7EWcCy7f58CkPSUTywiU3pqN6Wu1lHDIous8MbaMpGzZ%2BCIDh23AT31oioJhsTZ37xO0d8jruNrriSmWvvrDlJBAh4%2FYUS1MUmcqwoTDAcN9oeiVDXwcP%2FKL%2BBofMwNTPqUpMfUQszC74f%2FCBjqsAvlSSKDvhrLd06mRhkH46YPkavH7mBTT6n2LuWFj%2BuSEcWeqTa7B5jBJrt2AgCtlkLnYz5x9Byvd95vpi%2Fu8XZPM104SyPffMMC8ZyZsRqBWSsXOnVtUQdRqxDl%2BKQJPBmYnSIrOSrz2bWaV9OEi07F5ZuXlqs%2BbYOqpxUqz7foq5TxxS3SaGPoPWZ%2BcLwPL5XCtAp%2BjV44eAKYceQ5FyyCs9WVCtkbB610GCgTttRHaKXKPg3sLlMDUNdTKBk2vRGJefd9%2FObac0iyMG71OFjF5c%2F%2FV5edDD%2BeVL%2FkJWui9u5%2FnMWZ6QvKVJ%2FhVglXLiST%2BFjyMepkvlgRtlJno2the5hYTIt203cDnpNoaCdIMDAK8x0kUM4z6LQEgUJczQ6oglP%2B1DjtD8Pudsg%3D%3D&X-Amz-Signature=c846671ea6385bddfdde25a728a012a772378deccd899ea41addad80dcabc46a&X-Amz-SignedHeaders=host&response-content-disposition=inline',
        },
        'estrategia-de-producto': {
            title: 'Curso Estrategia de Producto',
            unit_price: 300000,
            description:
                'Descubre como crear, sostener e iterar una estrategia de producto que conecte la visión del negocio, objetivos, métricas y expectativas de stakeholders con la ejecución diaria de ideas, proyectos e iniciativas.',
            picture_url:
                'https://lumi-uploads-prod.s3.us-east-1.amazonaws.com/Portada%20Curso%20-%20Product%20Analytics.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAULCCUWMPDWQUNXXR%2F20250628%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250628T134215Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDU14G%2FDB8GJzgQwYFxNqR0EcnWc9oOsFkLhT2rCPB0wgIhAO9Bbgl%2FtTMvW0zv1wVmiS2yC8jeJnHV72IQfdOrj8sMKuMCCI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMMjk4NjM5OTk1Njc4IgyZDTvwGd46XlHQ3lcqtwKj9dvmizFANvKhHBGCsDQouGICb09P8OYLsGS4PJWJvgvnNMQr6aKyd8crUaNZK2uGoTLtCtw9jOhpQpFfqwsg4w3r6JRdnuURUfWw20TJ%2BdBfuHBJuPHWatCd6NGOLyd0iSjRp80VFr8yQrsIVVzFqj1745PqAudymtd1rMg%2BbsEgUBG9Ga5u5P7xruuVJ0hB84gV2ZOvGlg06whf2qyMVf3CYri2jW2oXagUcRtUw%2FNVoeHxR%2BLTm1ILPkcVeAO59T2SM15jntqbZ6PLoqzK7EWcCy7f58CkPSUTywiU3pqN6Wu1lHDIous8MbaMpGzZ%2BCIDh23AT31oioJhsTZ37xO0d8jruNrriSmWvvrDlJBAh4%2FYUS1MUmcqwoTDAcN9oeiVDXwcP%2FKL%2BBofMwNTPqUpMfUQszC74f%2FCBjqsAvlSSKDvhrLd06mRhkH46YPkavH7mBTT6n2LuWFj%2BuSEcWeqTa7B5jBJrt2AgCtlkLnYz5x9Byvd95vpi%2Fu8XZPM104SyPffMMC8ZyZsRqBWSsXOnVtUQdRqxDl%2BKQJPBmYnSIrOSrz2bWaV9OEi07F5ZuXlqs%2BbYOqpxUqz7foq5TxxS3SaGPoPWZ%2BcLwPL5XCtAp%2BjV44eAKYceQ5FyyCs9WVCtkbB610GCgTttRHaKXKPg3sLlMDUNdTKBk2vRGJefd9%2FObac0iyMG71OFjF5c%2F%2FV5edDD%2BeVL%2FkJWui9u5%2FnMWZ6QvKVJ%2FhVglXLiST%2BFjyMepkvlgRtlJno2the5hYTIt203cDnpNoaCdIMDAK8x0kUM4z6LQEgUJczQ6oglP%2B1DjtD8Pudsg%3D%3D&X-Amz-Signature=c846671ea6385bddfdde25a728a012a772378deccd899ea41addad80dcabc46a&X-Amz-SignedHeaders=host&response-content-disposition=inline',
        },
        'product-discovery-con-jobs-to-be-done': {
            title: 'Product Discovery con Jobs-to-be-done',
            unit_price: 240000,
            description:
                'Aprende a descubrir necesidades de tus usuarios, transformarlas en oportunidades de negocio y validar tus ideas para reducir riesgo de mercado.',
            picture_url:
                'https://lumi-uploads-prod.s3.us-east-1.amazonaws.com/Portada%20Curso%20-%20Product%20Analytics.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAULCCUWMPDWQUNXXR%2F20250628%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250628T134215Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDU14G%2FDB8GJzgQwYFxNqR0EcnWc9oOsFkLhT2rCPB0wgIhAO9Bbgl%2FtTMvW0zv1wVmiS2yC8jeJnHV72IQfdOrj8sMKuMCCI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMMjk4NjM5OTk1Njc4IgyZDTvwGd46XlHQ3lcqtwKj9dvmizFANvKhHBGCsDQouGICb09P8OYLsGS4PJWJvgvnNMQr6aKyd8crUaNZK2uGoTLtCtw9jOhpQpFfqwsg4w3r6JRdnuURUfWw20TJ%2BdBfuHBJuPHWatCd6NGOLyd0iSjRp80VFr8yQrsIVVzFqj1745PqAudymtd1rMg%2BbsEgUBG9Ga5u5P7xruuVJ0hB84gV2ZOvGlg06whf2qyMVf3CYri2jW2oXagUcRtUw%2FNVoeHxR%2BLTm1ILPkcVeAO59T2SM15jntqbZ6PLoqzK7EWcCy7f58CkPSUTywiU3pqN6Wu1lHDIous8MbaMpGzZ%2BCIDh23AT31oioJhsTZ37xO0d8jruNrriSmWvvrDlJBAh4%2FYUS1MUmcqwoTDAcN9oeiVDXwcP%2FKL%2BBofMwNTPqUpMfUQszC74f%2FCBjqsAvlSSKDvhrLd06mRhkH46YPkavH7mBTT6n2LuWFj%2BuSEcWeqTa7B5jBJrt2AgCtlkLnYz5x9Byvd95vpi%2Fu8XZPM104SyPffMMC8ZyZsRqBWSsXOnVtUQdRqxDl%2BKQJPBmYnSIrOSrz2bWaV9OEi07F5ZuXlqs%2BbYOqpxUqz7foq5TxxS3SaGPoPWZ%2BcLwPL5XCtAp%2BjV44eAKYceQ5FyyCs9WVCtkbB610GCgTttRHaKXKPg3sLlMDUNdTKBk2vRGJefd9%2FObac0iyMG71OFjF5c%2F%2FV5edDD%2BeVL%2FkJWui9u5%2FnMWZ6QvKVJ%2FhVglXLiST%2BFjyMepkvlgRtlJno2the5hYTIt203cDnpNoaCdIMDAK8x0kUM4z6LQEgUJczQ6oglP%2B1DjtD8Pudsg%3D%3D&X-Amz-Signature=c846671ea6385bddfdde25a728a012a772378deccd899ea41addad80dcabc46a&X-Amz-SignedHeaders=host&response-content-disposition=inline',
        },
    };

    /*     const cuponesValidos = {
        LORA1234: 0.1,
    };
 */
    const curso = cursosDisponibles[cursoElegido];

    /*     let descuento = 0;
    let coupon = req.body.cupon?.toUpperCase();

    if (coupon && cuponesValidos[coupon]) {
        const valor = cuponesValidos[coupon];
        descuento = valor < 1 ? curso.unit_price * valor : valor; // porcentaje vs monto fijo
    }

    const finalPrice = curso.unit_price - descuento; */

    if (!curso) {
        // En lugar de enviar error, podés redirigir, loguear o devolver un fallback si querés
        console.warn('Curso inválido recibido:', cursoElegido);
        return res.status(400).json({ error: 'Curso inválido' });
    }

    // 👤 Extraer los datos del formulario
    const { nombre, apellido, telefono, email } = req.body;
    const today = new Date();

    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Mes comienza en 0
    const year = today.getFullYear();

    const fechaFormateada = `${day}/${month}/${year}`;

    // 📬 Enviar a Sheets
    await axios.post('https://sheetdb.io/api/v1/1t0ntd4d4686t', {
        data: {
            Nombre: nombre,
            Apellido: apellido,
            Telefono: telefono,
            Email: email,
            Curso: cursoElegido,
            Fecha: fechaFormateada,
            Status: 'LEAD',
        },
    });

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
            success: `https://www.crissanchez.me/gracias/${cursoElegido}`,
            failure: 'https://www.crissanchez.me/error',
            pending: 'https://www.crissanchez.me/pendiente',
        },
        auto_return: 'approved',
        notification_url: 'https://www.crissanchez.me/webhooks/mercadopago',
        external_reference: email,
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

app.post('/webhooks/mercadopago', (req, res) => {
    console.log('🔔 Webhook recibido:', req.body);
    res.sendStatus(200); // MercadoPago espera un 200 OK
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

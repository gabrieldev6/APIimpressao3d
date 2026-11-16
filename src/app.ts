import express from 'express';

// documentação com swagger
import swaggerUi from 'swagger-ui-express';
import { parse } from 'yaml';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';


// Routes
import orderRoutes from './routes/order.routes';
import orderItemRoutes from './routes/orderItem.routes';
import materialRoutes from './routes/material.routes';
import userRoutes from './routes/user.routes';
import paymentRoutes from './routes/payment.routes';
import productRoutes from './routes/product.routes';
import printerRoutes from './routes/printer.routes';
import printJobRoutes from './routes/printJob.routes';
import customerRoutes from './routes/customer.routes';

const app = express();

const openApiDocument = parse(
  readFileSync(
    resolve(process.cwd(), 'docs/openapi.yaml'),
    'utf8'
  )
);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument)
);

app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).send('Welcome to the API');
});

app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/printers', printerRoutes);
app.use('/api/print-jobs', printJobRoutes);
app.use('/api/products', productRoutes);
app.use('/api/materials', materialRoutes);

export default app;

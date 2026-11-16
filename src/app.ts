import express from 'express';

// Routes
import orderRoutes from './routes/order.routes';
import materialRoutes from './routes/material.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import printerRoutes from './routes/printer.routes';
import printJobRoutes from './routes/printJob.routes';
import customerRoutes from './routes/customer.routes';

const app = express();

app.use(express.json());

app.use('/', (req, res) => {
  res.send('Welcome to the API').status(200);
});

app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/printers', printerRoutes);
app.use('/api/print-jobs', printJobRoutes);
app.use('/api/products', productRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/orders', orderRoutes);

export default app;

import express from 'express';
import { Request, Response } from 'express';

// Routes
import orderRoutes from './routes/order.routes';
import materialRoutes from './routes/material.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';

const app = express();

app.use(express.json());

app.use('api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/orders', orderRoutes);

export default app;

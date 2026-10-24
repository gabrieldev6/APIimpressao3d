import Customer from './Customer';
import Material from './Material';
import Order from './Order';
import OrderItem from './OrderItem';
import Payment from './Payment';
import Printer from './Printer';
import PrintJob from './PrintJob';
import Product from './Product';
import User from './User';

// Um cliente pode realizar vários pedidos.
Customer.hasMany(Order, {
  foreignKey: 'customerId',
  as: 'orders',
});

Order.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
});

// Um pedido possui vários itens.
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items',
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
});

// Um produto pode aparecer em vários itens de pedido.
Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  as: 'orderItems',
});

OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

// Um pedido pode ter vários pagamentos.
Order.hasMany(Payment, {
  foreignKey: 'orderId',
  as: 'payments',
});

Payment.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
});

// Um item de pedido pode ter vários trabalhos de impressão.
OrderItem.hasMany(PrintJob, {
  foreignKey: 'orderItemId',
  as: 'printJobs',
});

PrintJob.belongsTo(OrderItem, {
  foreignKey: 'orderItemId',
  as: 'orderItem',
});

// Uma impressora pode executar vários trabalhos ao longo do tempo.
Printer.hasMany(PrintJob, {
  foreignKey: 'printerId',
  as: 'printJobs',
});

PrintJob.belongsTo(Printer, {
  foreignKey: 'printerId',
  as: 'printer',
});

// Um material pode ser utilizado em vários trabalhos.
Material.hasMany(PrintJob, {
  foreignKey: 'materialId',
  as: 'printJobs',
});

PrintJob.belongsTo(Material, {
  foreignKey: 'materialId',
  as: 'material',
});

export {
  Customer,
  Material,
  Order,
  OrderItem,
  Payment,
  Printer,
  PrintJob,
  Product,
  User,
};
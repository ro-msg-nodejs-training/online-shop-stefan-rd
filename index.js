const Express = require('express');
const productRouter = require('./routes/product-routes');
const categoryRouter = require('./routes/category-routes');
const populateDatabaseRouter = require('./routes/populate-database-routes')
const orderRouter = require('./routes/order-routes')
const stockRouter = require('./routes/stock-routes')
const app = Express();
// eslint-disable-next-line no-unused-vars
const database = require('./database-connection');

const PORT = 3000;
app.use(Express.json());
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/populate-database', populateDatabaseRouter);
app.use('/orders', orderRouter);
app.use('/stock', stockRouter)

app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));
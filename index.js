const Express = require('express');
const productRouter = require('./routes/product-routes');
const categoryRouter = require('./routes/category-routes')
const app = Express();

// eslint-disable-next-line no-unused-vars
const database = require('./database-connection');




const PORT = 3000;

app.use(Express.json());

app.use('/categories', categoryRouter);
app.use('/products', productRouter)

app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));
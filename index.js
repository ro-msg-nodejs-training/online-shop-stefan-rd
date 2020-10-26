const Express = require('express');
const productRouter = require('./routes/product-router');
const categoryRouter = require('./routes/category-router')
const app = Express();
const PORT = 3000;

app.use(Express.json());

app.use('/categories', categoryRouter);
app.use('/products', productRouter)

app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));
const Express = require("express");
const productRouter = require("./src/routes/product-routes");
const categoryRouter = require("./src/routes/category-routes");
const populateDatabaseRouter = require("./src/routes/populate-database-routes");
const orderRouter = require("./src/routes/order-routes");
const stockRouter = require("./src/routes/stock-routes");
const app = Express();
// eslint-disable-next-line no-unused-vars
const database = require("./database-connection");

const PORT = 3000;
app.use(Express.json());
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/populate-database", populateDatabaseRouter);
app.use("/orders", orderRouter);
app.use("/stocks", stockRouter);

app.listen(PORT, () =>
  console.log(`Express server currently running on port ${PORT}`)
);

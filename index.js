const express = require("express");
const app = express();
const port = 3000;

const ProductCategoryRoute = require("./src/routes/product_category/ProductCategory.js");
const SupplierRoute = require("./src/routes/supplier/Supplier.js");
const MaterialRoute = require("./src/routes/raw_material/RawMaterial.js");
const ProductRoute = require("./src/routes/product/Product.js");
const MaterialProductRoute = require("./src/routes/material_product/MaterialProduct.js");
const OrderMoRoute = require('./src/routes/order_mo/Order_Mo.js');
const PurchaseOrderRoute = require('./src/routes/purchase_order/PurchaseOrder.js');
const cors = require("cors");

app.use(express.json())

app.use(
    cors({
        origin: "http://localhost:3001",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // If you're using cookies or sessions
        optionsSuccessStatus: 204,
    })
);

app.use('/api', ProductCategoryRoute)
app.use('/api', SupplierRoute)
app.use('/api', MaterialRoute)
app.use('/api', ProductRoute)
app.use('/api', MaterialProductRoute)
app.use('/api', OrderMoRoute)
app.use('/api', PurchaseOrderRoute)

app.listen(port, () => {
  console.log(`app running on port http://localhost:${port}/api`);
});

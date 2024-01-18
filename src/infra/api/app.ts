import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import  ProductModelCatalog from "../../modules/store-catalog/repository/product.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { ItemModel } from "../../modules/invoice/repository/item.model";
import { Umzug } from "umzug";
import { clientRoute } from "./routes/client.route";
import { productRoute } from "./routes/product.route";
import { invoiceRoute } from "./routes/invoice.route";
import { checkoutRoute } from "./routes/checkout.route";

export const app: Express = express();
app.use(express.json());
app.use("/client", clientRoute);
app.use("/product", productRoute);
app.use("/invoice", invoiceRoute);
app.use("/checkout", checkoutRoute)
app.get("/", (req, res) => {

  return res.send("Hello World!");
})
export let sequelize: Sequelize;
async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels([ClientModel, ProductModel, TransactionModel, InvoiceModel, ItemModel]);
  await sequelize.sync();
}
setupDb();
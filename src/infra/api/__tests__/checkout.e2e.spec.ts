import { Sequelize } from "sequelize-typescript"
import request from 'supertest'
import ProductModel from "../../../modules/store-catalog/repository/product.model";
import { app } from "../app";
import { OrderModel } from "../../../modules/checkout/repository/order.model";
import { OrderProductModel } from "../../../modules/checkout/repository/order-product.model";
import { ClientModel } from "../../../modules/checkout/repository/client.model";

describe("E2E test for checkout", () => { 

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    })
    
    sequelize.addModels([ClientModel,ProductModel,OrderModel,OrderProductModel])
    await sequelize.sync();  })

    afterEach(async () => {
      await sequelize.close();
    });
  
  it("should create a checkout", async () => {
    
    const client = await request(app)
      .post("/client")
      .send({   
        id: "1",     
        name: "Client",
        email: "Email",
        document: "1234",
        street: "Street",
        number: "100",
        complement: "apto",
        city: "City",
        state: "State",
        zipCode: "29000000",
      });  

      
      await ClientModel.create({
        id: client.body.id,
        name: client.body.name,
        email: client.body.email,
        document: client.body.document,
        street: client.body.address._street,
        number: client.body.address._number,
        complement: client.body.address._complement,
        city: client.body.address._city,
        state: client.body.address._state,
        zipcode: client.body.address._zipCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      const product1 = await request(app)
      .post("/product")
      .send({
          name: "Product1",
          description: "Description1",
          purchasePrice: 100,
          stock: 100
      });

      const product2 = await request(app)
      .post("/product")
      .send({
          name: "Product2",
          description: "Description2",
          purchasePrice: 200,
          stock: 200
      });

      await ProductModel.create({
        id: product1.body.id,
        name: product1.body.name,
        description: product1.body.description,
        salesPrice: 150,
      });
  
      await ProductModel.create({
        id: product2.body.id,
        name: product2.body.name,
        description: product2.body.description,
        salesPrice: 250,
      });
 
      const checkout = await request(app)
      .post("/checkout")
      .send({
        clientId: client.body.id,
        products: [
          {
            productId: product1.body.id,
          },
          {
            productId: product2.body.id,
          }
        ]
      });

      expect(checkout.status).toBe(200);
      expect(checkout.body.products.length).toBe(2);
      expect(checkout.body.total).toBe(400);
      expect(checkout.body.status).toBe('approved');
      const orders = await OrderModel.findAll()
    });
});
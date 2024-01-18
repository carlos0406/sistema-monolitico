import { Sequelize } from "sequelize-typescript"
import { ClientModel } from "./client.model"
import Client from "../domain/client.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import Product from "../domain/product.entity"
import Order from "../domain/order.entity"
import CheckoutRepository from "./checkout.repository"
import { OrderModel } from "./order.model"
import ProductModel from "./product.model"
import { OrderProductModel } from "./order-product.model"

describe("Client Repository test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    try {
      sequelize.addModels([ClientModel,OrderModel,ProductModel,OrderProductModel])
    }catch(error){
      console.log(error)
    }
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create a order", async () => {

    const client = new Client({
      id: new Id("1"),
      name: "Lucian",
      email: "lucian@teste.com",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      )
    })
    const product =  new Product({
      id: new Id("1"),
      name: "Produto 1",
      description: "Produto 1",
      salesPrice: 10
    })
    const clientDB = await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: "document",
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipcode: client.address.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    
    })
    const productDb=await ProductModel.create({
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice
    })
   

    const order = new Order({
      id: new Id("1"),
      client,
      products: [product],
      status: "created"
    })
    
    

    const repository = new CheckoutRepository()
    await repository.addOrder(order)
    const orderDB = await OrderModel.findOne({
      where:{
        id: order.id.id
      }
    })
    expect(orderDB.client_id).toEqual(client.id.id)
    expect(orderDB.status).toEqual(order.status)

    
  })
})
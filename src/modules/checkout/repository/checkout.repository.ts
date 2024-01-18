import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkoutgateway";
import { OrderModel } from "./order.model";

export default class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
   try{
    await OrderModel.create({
      id: order.id.id,
      client_id: order.client.id.id,
      status: order.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
   }catch(error){
    console.log(error);
   }
  }
  async findOrder(id: string): Promise<Order> {
    const order = await OrderModel.findOne({
      where: { id },
    });

    if (!order) {
      throw new Error(`order with id ${id} not found`);
    }

    return new Order({
      id: new Id(order.id),
      client: new Client({
        id: new Id(order.client_id),
        name: order.client.name,
        email: order.client.email,
        address: new Address(
          order.client.street,
          order.client.number,
          order.client.complement,
          order.client.city,
          order.client.state,
          order.client.zipcode
        ),
      }),
      status: order.status,
      products: order.products.map(product =>(
        new Product({
          id: new Id(product.id),
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        })
      ))
    });
  }
}

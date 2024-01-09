import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import invoiceEntity from "../domain/invoice.entity";
import Item from "../domain/item.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";
import { ItemModel } from "./item.model";

export default class InvoiceRepository implements InvoiceGateway {
  async create(invoice: invoiceEntity): Promise<void> {
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipcode: invoice.address.zipCode,
        items: invoice.items.map((item: Item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
        total: invoice.total,
        createdAt: invoice.createdAt,
      },
      {
        include: [ItemModel],
      }
    );
  }
  async find(id: string): Promise<invoiceEntity> {
    return InvoiceModel.findOne({
      where: {
        id,
      },
      include: [ItemModel],
    }).then((invoice: InvoiceModel) => {
      return new Invoice({
        id: new Id(invoice.id),
        name: invoice.name,
        document: invoice.document,
        //   city: string, state: string, zipCode: string
        address: new Address(
          invoice.street,
          invoice.number,
          invoice.complement,
          invoice.city,
          invoice.state,
          invoice.zipcode,
        ),
        items: invoice.items.map(
          (item: any) =>
            new Item({
              id: new Id(item.id),
              name: item.name,
              price: item.price,
            })
        ),
        createdAt: invoice.createdAt,
      });
    });
  }
}
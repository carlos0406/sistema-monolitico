import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import { InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import { ItemModel } from "./item.model";
import Invoice from "../domain/invoice.entity";
import Address from "../../@shared/domain/value-object/address";
import Item from "../domain/item.entity";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, ItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new invoice", async () => {
    const repository = new InvoiceRepository();
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice Teste",
      document: "123",
      address: new Address(
       "Rua Teste 1",
        "1",
        "11",
        "Vitória",
       "ES",
         "29000-000",
      ),
      items: [
        new Item({
          id: new Id("1"),
          name: "Item 1",
          price: 1,
        }),
        new Item({
          id: new Id("2"),
          name: "Item 2",
          price: 2,
        }),
      ],
    });
    await repository.create(invoice);

    const result = await InvoiceModel.findOne({
      where: { id: "1" },
      include: [ItemModel],
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.street).toBe(invoice.address.street);
    expect(result.number).toBe(invoice.address.number);
    expect(result.complement).toBe(invoice.address.complement);
    expect(result.city).toBe(invoice.address.city);
    expect(result.state).toBe(invoice.address.state);
    expect(result.zipcode).toBe(invoice.address.zipCode);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBe(invoice.items[0].id.id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
    expect(result.items[1].id).toBe(invoice.items[1].id.id);
    expect(result.items[1].name).toBe(invoice.items[1].name);
    expect(result.items[1].price).toBe(invoice.items[1].price);
    expect(result.total).toBe(
      invoice.items.reduce((total_price, item) => total_price + item.price, 0)
    );
  });

  it("should find an invoice", async () => {
    const repository = new InvoiceRepository();
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice Teste",
      document: "123",
      address: new Address(
        "Rua Teste 1",
         "1",
         "11",
         "Vitória",
         "ES",
         "29000-000",
      ),
      items: [
        new Item({
          id: new Id("1"),
          name: "Item 1",
          price: 1,
        }),
        new Item({
          id: new Id("2"),
          name: "Item 2",
          price: 2,
        }),
      ],
    });
    await repository.create(invoice);

    const result = await repository.find(invoice.id.id);

    expect(result).toBeDefined();
    expect(result.id.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id.id).toBe(invoice.items[0].id.id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
    expect(result.items[1].id.id).toBe(invoice.items[1].id.id);
    expect(result.items[1].name).toBe(invoice.items[1].name);
    expect(result.items[1].price).toBe(invoice.items[1].price);
    expect(result.total).toBe(
      invoice.items.reduce((total_price, item) => total_price + item.price, 0)
    );
  });
});
import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import { ItemModel } from "../repository/item.model";
import InvoiceFacadeFactory from "../factory/invoice.facede.factory";

describe("InvoiceFacade test", () => {
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

  it("should create a invoice", async () => {
    const input = {
      name: "Invoice",
      document: "123456789",
      street: "Rua da Invoice",
      number: "1",
      complement: "",
      city: "Vitória",
      state: "ES",
      zipCode: "29000-000",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 1,
        },
        {
          id: "2",
          name: "Intem 2",
          price: 2,
        },
      ],
    };

    const facade = InvoiceFacadeFactory.create();

    const output = await facade.create(input);

    expect(output).toBeDefined();
    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);
    expect(output.items.length).toBe(2);
    expect(output.total).toBe(
      input.items.reduce((total_price, item) => total_price + item.price, 0)
    );
  });

  it("should find a invoice", async () => {
    const input = {
      name: "Invoice",
      document: "123456789",
      street: "Rua da Invoice",
      number: "1",
      complement: "",
      city: "Vitória",
      state: "ES",
      zipCode: "29000-000",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 1,
        },
        {
          id: "2",
          name: "Intem 2",
          price: 2,
        },
      ],
    };

    const facade = InvoiceFacadeFactory.create();
    const output = await facade.create(input);
    const found = await facade.find(output.id);

    expect(found).toBeDefined();
    expect(found.id).toBeDefined();
    expect(found.name).toBe(input.name);
    expect(found.document).toBe(input.document);
    expect(found.address.street).toBe(input.street);
    expect(found.address.number).toBe(input.number);
    expect(found.address.complement).toBe(input.complement);
    expect(found.address.city).toBe(input.city);
    expect(found.address.state).toBe(input.state);
    expect(found.address.zipCode).toBe(input.zipCode);
    expect(found.items[0].id).toBeDefined;
    expect(found.items[0].name).toBe(input.items[0].name);
    expect(found.items[0].price).toBe(input.items[0].price);
    expect(found.items[1].id).toBeDefined;
    expect(found.items[1].name).toBe(input.items[1].name);
    expect(found.items[1].price).toBe(input.items[1].price);

    expect(found.total).toBe(
      input.items.reduce((total_price, item) => total_price + item.price, 0)
    );
  });
});

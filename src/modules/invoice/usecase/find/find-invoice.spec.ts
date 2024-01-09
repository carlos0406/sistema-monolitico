import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import Item from "../../domain/item.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

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

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find invoice usecase unit test", () => {
  it("should find an invoice", async () => {
    const mockInvoiceGateway = MockRepository();
    const usecase = new FindInvoiceUseCase(mockInvoiceGateway);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(result.id).toBeDefined();
    expect(mockInvoiceGateway.find).toHaveBeenCalled();
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBeDefined;
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
    expect(result.items[1].id).toBeDefined;
    expect(result.items[1].name).toBe(invoice.items[1].name);
    expect(result.items[1].price).toBe(invoice.items[1].price);
    expect(result.createdAt).toBe(invoice.createdAt);
    expect(result.total).toBe(
      invoice.items.reduce((total_price, item) => total_price + item.price, 0)
    );
  });
});
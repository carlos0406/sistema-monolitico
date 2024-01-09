import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
  };
};

describe("Generate invoice usecase test", () => {
  it("should generate an invoice", async () => {
    const mockInvoiceGateway = MockRepository();
    const usecase = new GenerateInvoiceUseCase(mockInvoiceGateway);

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

    const result = await usecase.execute(input);

    expect(result.id).toBeDefined();
    expect(mockInvoiceGateway.create).toHaveBeenCalled();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBeDefined;
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
    expect(result.items[1].id).toBeDefined;
    expect(result.items[1].name).toBe(input.items[1].name);
    expect(result.items[1].price).toBe(input.items[1].price);
    expect(result.total).toBe(
      input.items.reduce((total_price, item) => total_price + item.price, 0)
    );
  });
});
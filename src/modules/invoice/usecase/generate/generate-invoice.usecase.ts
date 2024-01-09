import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/invoice.entity";
import Item from "../../domain/item.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";


export default class GenerateInvoiceUseCase implements UseCaseInterface {
  constructor(private readonly invoiceGateway: InvoiceGateway) {}

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address: new Address(
        input.street,
         input.number,
         input.complement,
         input.city,
         input.state,
         input.zipCode,
      ),
      items: input.items.map(
        (item) =>
          new Item({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
          })
      ),
    })
    await this.invoiceGateway.create(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      })),
      total: invoice.total,
    };
  }   
}
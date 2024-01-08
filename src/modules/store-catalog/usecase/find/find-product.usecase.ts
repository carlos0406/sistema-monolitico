import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ProductGateway from "../../gateway/product.gateway";
import { FindInputProductDto, OutputFindProductDto } from "./find.dto";

export class FindProductUseCase implements UseCaseInterface {
  constructor(private productRepository: ProductGateway){}
  async  execute(input: FindInputProductDto): Promise<OutputFindProductDto> {
    const result = await this.productRepository.find(input.id)
    return {
      id: result.id.id,
      description: result.description,
      name: result.name,
      salesPrice: result.salesPrice
    }
  }
}
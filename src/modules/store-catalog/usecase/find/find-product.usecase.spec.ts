import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { FindProductUseCase } from './find-product.usecase';

const product = new Product({
  id: new Id("1"),
  description: "description",
  name: "name",
  salesPrice: 10,
})


const mockRepository  = () => ({
  findAll: jest.fn(),
  find : jest.fn().mockResolvedValueOnce(Promise.resolve(product)),
})

describe('Find Product use case unit test', () => {
  it("should find a product", async () => {
    const productRepository = mockRepository()
    const usecase = new  FindProductUseCase(productRepository)
    const result = await usecase.execute({id: product.id.id})

    expect(productRepository.find).toHaveBeenCalled()
    expect(result.id).toBe(product.id.id)
    expect(result.name).toBe(product.name)
    expect(result.description).toBe(product.description)
    expect(result.salesPrice).toBe(product.salesPrice)
  })
})
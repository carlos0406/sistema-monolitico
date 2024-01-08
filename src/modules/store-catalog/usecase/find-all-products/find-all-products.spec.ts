import { FindAllProductsDto } from './find-all-products.dto';
import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { FindAllProductsUseCase } from './find-all-products.usecase';

const product = new Product({
  id: new Id("1"),
  description: "description",
  name: "name",
  salesPrice: 10,
})


const product2 = new Product({
  id: new Id("2"),
  description: "description",
  name: "name",
  salesPrice: 10,
})

const mockRepository  = () => ({
  find: jest.fn(),
  findAll: jest.fn().mockResolvedValueOnce(Promise.resolve([product, product2])),
})

describe('FindAllProducts use case unit test', () => {
  it("should find all products", async () => {
    const productRepository = mockRepository()
    const usecase = new  FindAllProductsUseCase(productRepository)
    const result = await usecase.execute()

    expect(productRepository.findAll).toHaveBeenCalled()
    expect(result.products.length).toBe(2)
    expect(result.products[0].id).toBe(product.id.id)
    expect(result.products[1].id).toBe(product2.id.id)


  })
})
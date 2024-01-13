import Id from "../../../@shared/domain/value-object/id.value-object"
import Product from "../../domain/product.entity"
import { PlaceOrderInputDto } from "./place-order.dto"
import PlaceOrderUseCase from "./place-order.usecase"
const mockDate =  new Date(2000,1,1)
describe("place order usecase unit test",()=>{

  describe("validateProducts method",()=>{
    //@ts-expect-error
    const placeOrderUseCase = new PlaceOrderUseCase({ 
    })
    it("should throw if products are not selected",async ()=>{
  
      const input:PlaceOrderInputDto = {
        clientId: "123",
        products: []
      }
      await expect(placeOrderUseCase['validateProducts'](input)).rejects.toThrow("No products selected")
      
    })
    it("should throw if products when product is out of stock",async ()=>{
      const mockProductFacade  = {
        checkStock: jest.fn(
          ({productId}:{productId:string})=>Promise.resolve({stock:productId==='1'?0:1,productId})
        )
      }
      //@ts-expect-error
      placeOrderUseCase["_productFacade"] = mockProductFacade;
      let input:PlaceOrderInputDto = {
        clientId: "123",
        products: [{productId:"1"}]
      }
      await expect(placeOrderUseCase['validateProducts'](input)).rejects.toThrow("Product 1 is not available in stock")

      input ={
        clientId:"0",
        products:[{productId:"0"},{productId:"1"}]
      }
      
      await expect(placeOrderUseCase['validateProducts'](input)).rejects.toThrow("Product 1 is not available in stock")
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3)


      input ={
        clientId:"0",
        products:[{productId:"0"},{productId:"1"},{productId:"2"}]
      }
      await expect(placeOrderUseCase['validateProducts'](input)).rejects.toThrow("Product 1 is not available in stock")
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5)
    })

  })

  describe("test getProduct method", () =>{
    beforeAll(() =>{
      jest.setSystemTime(mockDate)
    })
    afterAll(()=>{
      jest.useRealTimers()
    })
    //@ts-expect-error
    const placeOrderUseCase = new PlaceOrderUseCase({})
    it("should throw error when product not found", async ()=>{
      
        const mockCatalogFacade = {
          find: jest.fn().mockResolvedValue(null)
        }
      
        //@ts-expect-error
        placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;
        await expect(placeOrderUseCase['getProduct']("1")).rejects.toThrow("Product not found")
    
    })
    
    it("should return a product ", async ()=>{
      
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: "1",
          name: "name",
          description: "description",
          salesPrice:0
        })
      }
    
      //@ts-expect-error
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;
      await expect(placeOrderUseCase['getProduct']("1")).resolves.toEqual(
        new Product({
          id: new Id("1"),
          description: "description",
          name: "name",
          salesPrice: 0
        })
      )
      
      expect(mockCatalogFacade.find).toHaveBeenCalled()
  })


  })

  describe("execute methotd",()=>{
    it("should throw an error if client is not found",async ()=>{
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null)
      }
      //@ts-expect-error no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase({ 
      })
      //@ts-expect-error force set clientFacade
      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const input:PlaceOrderInputDto = {
        clientId: "123",
        products: []
      }

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow("Client not found")
    })
    
    it("should throw an error when products are not valid",async ()=>{
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true)
      }
      //@ts-expect-error no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase({ 
      })
      const mockValidateProducts = jest
      //@ts-expect-error
      .spyOn(placeOrderUseCase,"validateProducts").mockRejectedValue(new Error("No products selected"))
      
      //@ts-expect-error force set clientFacade
      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const input:PlaceOrderInputDto = {
        clientId: "123",
        products: []
      }

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow("No products selected")
      expect(mockValidateProducts).toHaveBeenCalled()
    })

  })

})
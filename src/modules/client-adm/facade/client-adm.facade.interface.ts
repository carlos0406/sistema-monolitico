import Address from "../../@shared/domain/value-object/address"

export interface AddClientFacadeInputDto {
  id?: string
  name: string
  email: string
  document: string
  address: Address
}

export interface FindClientFacadeInputDto {
  id: string
}

export interface FindClientFacadeOutputDto {
  id: string
  name: string
  email: string
  document: string
  address: Address
  createdAt: Date
  updatedAt: Date,
  street: string,
  city: string,
  state: string,
  country: string,
  zipCode: string,
  number: string,
  complement: string,
}

export default interface ClientAdmFacadeInterface {
  add(input: AddClientFacadeInputDto): Promise<void>;
  find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto>;
}

import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Item from "./item.entity";

type InvoiceProps = {
  id?: Id;
  name: string;
  items: Item[];
  document: string;
  address: Address;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _address: Address;
  private _items: Item[];

  constructor(props: InvoiceProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._items = props.items;
    this._document = props.document;
    this._address = props.address;
  }

  get total(): number {
    return this._items.reduce((total_price, item) => total_price + item.price, 0);
  }

  get items(): Item[] {
    return this._items;
  }

  get address(): Address {
    return this._address;
  }

  get document(): string {
    return this._document;
  }

  get name(): string {
    return this._name;
  }
}
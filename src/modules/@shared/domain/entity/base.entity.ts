import type Id from '../value-object/id.value-object'

export default class BaseEntity {
  private _id: Id
  private _createdAt: Date
  private _updatedAt: Date

  get id (): Id {
    return this._id
  }

  set id (value: Id) {
    this._id = value
  }

  get createdAt (): Date {
    return this._createdAt
  }

  set createdAt (value: Date) {
    this._createdAt = value
  }

  get updatedAt (): Date {
    return this._updatedAt
  }

  set updatedAt (value: Date) {
    this._updatedAt = value
  }
}

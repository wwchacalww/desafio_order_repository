export default class OrderItem {
  private _id: string;
  private _productId: string;
  private _name: string;
  private _price: number;
  private _quantity: number;

  constructor(id: string, name: string, price: number, productId: string, quantity: number) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._productId = productId;
    this._quantity = quantity;

    this.validate();
  }

  validate(): boolean {
    if (this._quantity <= 0) {
      throw new Error("The quantity item must be greater than 0")
    }
    return true;
  }

  get id(): string {
    return this._id;
  }

  get productId(): string {
    return this._productId;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price * this._quantity;
  }

  get quantity(): number {
    return this._quantity;
  }



}
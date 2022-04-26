import Product from "../../domain/entity/product";
import product from "../../domain/entity/product";
import ProductRepositoryInterface from "../../domain/repositoy/product-repository.interface";
import ProductModel from "../db/sequelize/model/product.model";


export default class ProductRepository implements ProductRepositoryInterface {
  async create(entity: product): Promise<void> {
    await ProductModel.create({
      id: entity.id,
      name: entity.name,
      price: entity.price
    })
  }
  async update(entity: product): Promise<void> {
    await ProductModel.update({
      name: entity.name,
      price: entity.price,
    }, {
      where: { id: entity.id }
    });
  }
  async find(id: string): Promise<product> {
    const product = await ProductModel.findOne({ where: { id, } });

    return new Product(product.id, product.name, product.price);
  }
  async findAll(): Promise<Product[]> {
    const productModels = await ProductModel.findAll();
    return productModels.map((productModel) =>
      new Product(productModel.id, productModel.name, productModel.price)
    );
  }

}
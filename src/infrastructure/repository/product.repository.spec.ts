import { Sequelize } from "sequelize-typescript"
import Product from "../../domain/entity/product";
import ProductModel from "../db/sequelize/model/product.model";
import ProductRepository from "./product.repository";

describe("Product repository test", () => {
  let sequelize: Sequelize;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([ProductModel]);
    await sequelize.sync();

  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Should create a new product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product One", 10);

    await productRepository.create(product);

    const productFound = await ProductModel.findOne({ where: { id: "1" } });

    expect(productFound.toJSON()).toStrictEqual({
      id: "1",
      name: "Product One",
      price: 10
    });

  });

  it("Should update a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product One", 10);

    await productRepository.create(product);
    product.changeName("Product Two");
    product.changePrice(30);

    await productRepository.update(product);

    const productFound = await ProductModel.findOne({ where: { id: "1" } });

    expect(productFound.toJSON()).toStrictEqual({
      id: "1",
      name: "Product Two",
      price: 30
    });
  });

  it("Should find a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("1", "Product One", 10);

    await productRepository.create(product);

    const productModelFound = await ProductModel.findOne({ where: { id: "1" } });


    const productFound = await productRepository.find("1");

    expect(productModelFound.toJSON()).toStrictEqual({
      id: productFound.id,
      name: productFound.name,
      price: productFound.price
    });
  });

  it("Should list all products", async () => {
    const productRepository = new ProductRepository();
    const product1 = new Product("1", "Product One", 10);
    await productRepository.create(product1);
    const product2 = new Product("2", "Product Two", 20);
    await productRepository.create(product2);
    const products = [product1, product2];

    const productsFound = await productRepository.findAll();

    expect(products).toEqual(productsFound);
  });
})
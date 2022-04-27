import { Sequelize } from "sequelize-typescript"
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import OrderRepository from "./order.repository";
import ProductRepository from "./product.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
    await sequelize.sync();

  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Fulano");
    const address = new Address("Rua dos Bobos", 7, "234234", "Cidade");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem("i01", product.name, product.price, product.id, 2);

    const orderRepository = new OrderRepository();
    const order = new Order("o01", "123", [ordemItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"]
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "o01",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          product_id: ordemItem.productId,
          order_id: order.id,
        },
      ],
    })
  });

  it("Should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Fulano");
    const address = new Address("Rua dos Bobos", 7, "234234", "Cidade");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem("i01", product.name, product.price, product.id, 2);

    const orderRepository = new OrderRepository();
    const order = new Order("o01", "123", [ordemItem]);
    await orderRepository.create(order);

    const orderFound = await orderRepository.find(order.id);
    expect(orderFound).toStrictEqual({
      id: "o01",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          product_id: ordemItem.productId,
          order_id: order.id,
        },
      ],
    })
  });

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();

    expect(async () => {
      await orderRepository.find("id_none_exists");
    }).rejects.toThrow("Order not found");
  });

  it("Should update order", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();


    const customer1 = new Customer("123", "Fulano");
    const customer2 = new Customer("456", "Beltrano");
    const address = new Address("Rua dos Bobos", 7, "234234", "Cidade");
    customer1.changeAddress(address);
    customer2.changeAddress(address);
    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const product1 = new Product("p1", "Product 1", 10);
    const product2 = new Product("p2", "Product 2", 20);
    const product3 = new Product("p3", "Product 3", 30);
    await productRepository.create(product1);
    await productRepository.create(product2);
    await productRepository.create(product3);
    const ordemItem1 = new OrderItem("i01", product1.name, product1.price, product1.id, 2);
    const ordemItem2 = new OrderItem("i02", product2.name, product2.price, product2.id, 3);
    const ordemItem3 = new OrderItem("i03", product3.name, product3.price, product3.id, 1);

    const order = new Order("o01", "123", [
      ordemItem1,
      ordemItem2,
    ]);

    await orderRepository.create(order);
    const checkRewardPointsCostumer1 = await customerRepository.find("123");

    expect(checkRewardPointsCostumer1.rewardPoints).toEqual(40);

    const orderUpdate = new Order("o01", "456", [
      ordemItem2,
      ordemItem3,
    ]);
    await orderRepository.update(orderUpdate);
    const orderUpdated = await orderRepository.find("o01");
    const checkRewardPointsCostumer2 = await customerRepository.find("456");
    const checkRewardPointsCostumer3 = await customerRepository.find("123");

    expect(orderUpdated.customer_id).toBe("456");
    expect(checkRewardPointsCostumer2.rewardPoints).toEqual(45);
    expect(checkRewardPointsCostumer3.rewardPoints).toEqual(0);
  });

  it("Should list all orders", async () => {
    const customerRepository = new CustomerRepository();
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();

    const customer1 = new Customer("123", "Fulano");
    const customer2 = new Customer("456", "Beltrano");
    const customer3 = new Customer("789", "Siclano");
    const address = new Address("Rua dos Bobos", 7, "234234", "Cidade");
    customer1.changeAddress(address);
    customer2.changeAddress(address);
    customer3.changeAddress(address);
    await customerRepository.create(customer1);
    await customerRepository.create(customer2);
    await customerRepository.create(customer3);

    const product1 = new Product("p1", "Product 1", 10);
    const product2 = new Product("p2", "Product 2", 20);
    const product3 = new Product("p3", "Product 3", 30);
    await productRepository.create(product1);
    await productRepository.create(product2);
    await productRepository.create(product3);
    const ordemItem1 = new OrderItem("i01", product1.name, product1.price, product1.id, 2);
    const ordemItem2 = new OrderItem("i02", product2.name, product2.price, product2.id, 3);
    const ordemItem3 = new OrderItem("i03", product3.name, product3.price, product3.id, 1);

    const order1 = new Order("o01", "123", [ordemItem1]);
    const order2 = new Order("o02", "456", [ordemItem2]);
    const order3 = new Order("o03", "789", [ordemItem3]);

    await orderRepository.create(order1);
    await orderRepository.create(order2);
    await orderRepository.create(order3);

    const listOrders = await orderRepository.findAll();
    const orders = [order1, order2, order3];
    expect(orders).toStrictEqual(listOrders);


  });

});
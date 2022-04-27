import { Sequelize } from "sequelize-typescript"
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";

describe("Customer repository test", () => {
  let sequelize: Sequelize;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([CustomerModel]);
    await sequelize.sync();

  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Should create a new customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Fulando");
    const address = new Address("Rua tal", 123, "234234", "Raio Q Parta");
    customer.address = address;

    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: "123",
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      zip: address.zip,
      city: address.city,
    });
  });

  it("Should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Fulando");
    const address = new Address("Rua tal", 123, "234234", "Raio Q Parta");
    customer.address = address;

    await customerRepository.create(customer);


    customer.changeName("Siclano");

    await customerRepository.update(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "123" } });
    expect(customerModel.name).toBe('Siclano');
  });

  it("Should find a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Fulando");
    const address = new Address("Rua tal", 123, "234234", "Raio Q Parta");
    customer.address = address;

    await customerRepository.create(customer);

    const customerFind = await customerRepository.find("123");
    expect(customerFind).toStrictEqual(customer);
  });

  it("should throw an error when customer is not found", async () => {
    const customerRepository = new CustomerRepository();

    expect(async () => {
      await customerRepository.find("456ABC");
    }).rejects.toThrow("Customer not found");
  });

  it("Should find all customers", async () => {
    const customerRepository = new CustomerRepository();
    const customer1 = new Customer("123", "Customer 1");
    const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer1.address = address1;
    customer1.addRewardPoints(10);
    customer1.activate();

    const customer2 = new Customer("456", "Customer 2");
    const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
    customer2.address = address2;
    customer2.addRewardPoints(20);

    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const customers = await customerRepository.findAll();

    expect(customers).toHaveLength(2);
    expect(customers).toContainEqual(customer1);
    expect(customers).toContainEqual(customer2);
  });

  it("Should add reward points", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.address = address1;
    customer.addRewardPoints(10);
    customer.activate();
    await customerRepository.create(customer);

    const customerFound = await customerRepository.find("123");

    expect(customerFound.rewardPoints).toEqual(10);

    await customerRepository.addRewardPoints("123", 15);

    const customerFound2 = await customerRepository.find("123");

    expect(customerFound2.rewardPoints).toEqual(25);
  });

  it("Should remove reward points", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.address = address1;
    customer.addRewardPoints(50);
    customer.activate();
    await customerRepository.create(customer);

    const customerFound = await customerRepository.find("123");

    expect(customerFound.rewardPoints).toEqual(50);

    await customerRepository.removeRewardPoints("123", 15);

    const customerFound2 = await customerRepository.find("123");

    expect(customerFound2.rewardPoints).toEqual(35);
  });

  it("Should throw error when remove reward points less than 0", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.address = address1;
    customer.addRewardPoints(10);
    customer.activate();
    await customerRepository.create(customer);

    let customerFound;
    customerFound = await customerRepository.find("123");

    expect(customerFound.rewardPoints).toEqual(10);

    await customerRepository.removeRewardPoints("123", 15);

    customerFound = await customerRepository.find("123");

    expect(customerFound.rewardPoints).toEqual(0);
  });
});
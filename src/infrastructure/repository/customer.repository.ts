import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerRepositoryInterface from "../../domain/repositoy/customer-repository.interface";
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
      id: entity.customer_id,
      name: entity.name,
      street: entity.Address.street,
      number: entity.Address.number,
      zip: entity.Address.zip,
      city: entity.Address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    });
  }

  async update(entity: Customer): Promise<void> {
    await CustomerModel.update({
      name: entity.name,
      street: entity.Address.street,
      number: entity.Address.number,
      zip: entity.Address.zip,
      city: entity.Address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    }, {
      where: {
        id: entity.customer_id
      }
    });
  }

  async find(id: string): Promise<Customer> {
    let customer;
    try {
      customer = await CustomerModel.findOne({
        where: { id },
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Customer not found");
    }

    const address = new Address(customer.street, customer.number, customer.zip, customer.city);
    const result = new Customer(customer.id, customer.name);
    result.addRewardPoints(customer.rewardPoints);
    result.address = address;
    if (customer.active) { result.isActive(); }
    else { result.desactivate(); }
    return result;
  }

  async findAll(): Promise<Customer[]> {
    const customersModel = await CustomerModel.findAll();

    const customers = customersModel.map(cm => {
      let customer = new Customer(cm.id, cm.name);
      customer.addRewardPoints(cm.rewardPoints);
      const address = new Address(
        cm.street,
        cm.number,
        cm.zip,
        cm.city
      );
      customer.changeAddress(address);
      if (cm.active) { customer.activate(); }
      else { customer.desactivate(); }
      return customer;
    });
    return customers;
  }

  async addRewardPoints(customer_id: string, points: number): Promise<void> {
    let customer;
    try {
      customer = await CustomerModel.findOne({
        where: { id: customer_id },
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Customer not found");
    }

    const totalPoints = customer.rewardPoints + points;
    await CustomerModel.update({
      rewardPoints: totalPoints,
    }, {
      where: {
        id: customer_id
      }
    });
  }

  async removeRewardPoints(customer_id: string, points: number): Promise<void> {
    let customer;
    try {
      customer = await CustomerModel.findOne({
        where: { id: customer_id },
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Customer not found");
    }

    if (customer.rewardPoints < points) {
      points = customer.rewardPoints;
    }

    const totalPoints = customer.rewardPoints - points;
    await CustomerModel.update({
      rewardPoints: totalPoints,
    }, {
      where: {
        id: customer_id
      }
    });
  }

}
import Address from "./address";
import Customer from "./customer";

describe("customer unit tests", () => {
  it("Should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "Fulando de Tal");
    }).toThrowError("Id is required");
  });

  it("Should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123123", "");
    }).toThrowError("Name is required");
  });

  it("Should change name", () => {
    let customer = new Customer("12312", "Fulando de tal");
    customer.changeName("Siclano de Tal");

    expect(customer.name).toBe("Siclano de Tal");
  });

  it("Should activate customer", () => {
    let customer = new Customer("12312", "Fulando de tal");
    const address = new Address("Rua tal", 89, "4234230", "Samamba");
    customer.address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("Should desactivate customer", () => {
    let customer = new Customer("12312", "Fulando de tal");
    const address = new Address("Rua tal", 89, "4234230", "Samamba");
    customer.address = address;

    customer.activate();

    customer.desactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("Should throw error when address is undefined", () => {
    expect(() => {
      let customer = new Customer("12312", "Fulando de tal");

      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("Should add reward points in customer", () => {
    const customer = new Customer("c01", "Fulando");
    expect(customer.rewardPoints).toBe(0);
    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);
    customer.addRewardPoints(20);
    expect(customer.rewardPoints).toBe(30);
  });

});
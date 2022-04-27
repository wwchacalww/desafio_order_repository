import Customer from "./customer";
import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
  it("Should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("123", "Fulando de Tal");
      const item1 = new OrderItem("123", "Item1", 10, "Prod1", 2);

      const order = new Order("", "123", [item1]);

    }).toThrowError("Id is required");
  });

  it("Should throw error when customer_id is empty", () => {
    expect(() => {
      let customer = new Customer("123", "Fulando de Tal");
      const item1 = new OrderItem("123", "Item1", 10, "Prod1", 2);

      const order = new Order("123", "", [item1]);

    }).toThrowError("customer_id is required");
  });

  it("Should throw error when customer_id is empty", () => {
    expect(() => {
      let customer = new Customer("123", "Fulando de Tal");

      const order = new Order("123", "123", []);

    }).toThrowError("Item qtd must be greater than 0");
  });

  it("Should calculate total", () => {
    let customer = new Customer("123", "Fulando de Tal");
    const item1 = new OrderItem("123", "Item1", 10, "Prod1", 2);
    const item2 = new OrderItem("123", "Item2", 20, "Prod2", 2);

    const order = new Order("123", "123", [item1, item2]);
    expect(order.total()).toBe(60);
  });

  it("Should throw error if the qtd item is less or equal than 0", () => {
    expect(() => {
      let customer = new Customer("123", "Fulando de Tal");
      const item1 = new OrderItem("123", "Item1", 10, "Prod1", 0);
      const item2 = new OrderItem("123", "Item2", 20, "Prod2", 2);

      const order = new Order("123", "123", [item1, item2]);
    }).toThrowError("The quantity item must be greater than 0");

  });

});
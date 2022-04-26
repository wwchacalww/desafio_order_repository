import Customer from "../entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("Order service tests unit", () => {
  it("Should get total prices of all orders", () => {

    const item1 = new OrderItem("i01", "Item 01", 10, "p01", 2);
    const item2 = new OrderItem("i02", "Item 02", 30, "p02", 3);
    const item3 = new OrderItem("i03", "Item 03", 20, "p02", 1);

    const order1 = new Order("o01", "123", [item1, item2]); // 110
    const order2 = new Order("o02", "231", [item3, item2]); // 110
    const order3 = new Order("o03", "312", [item1, item3]); // 40 

    const orders = [order1, order2, order3];

    const total = OrderService.total(orders);

    expect(total).toEqual(260);

  });

  it("Should place an order", () => {
    const customer1 = new Customer("c01", "Fulando");
    const item = new OrderItem("i01", "Item 1", 10, "p01", 1);
    const order = OrderService.placeOrder(customer1, [item]);

    expect(customer1.rewardPoints).toEqual(5);
    expect(order.total()).toEqual(10);
  })
});
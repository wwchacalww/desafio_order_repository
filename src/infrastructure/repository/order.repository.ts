import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repositoy/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import CustomerRepository from "./customer.repository";


export default class OrderRepository implements OrderRepositoryInterface {

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customer_id,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          product_id: item.productId,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );

    const customerRepository = new CustomerRepository();
    const rewardPoints = entity.total() / 2;
    await customerRepository.addRewardPoints(entity.customer_id, rewardPoints);
  }

  async update(entity: Order): Promise<void> {
    const customerRepository = new CustomerRepository();

    let order;
    try {
      order = await OrderModel.findOne({
        where: { id: entity.id },
        include: ["items"],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const rewardPointsOld = order.total / 2;

    await customerRepository.removeRewardPoints(
      order.customer_id,
      rewardPointsOld
    );

    order.items.forEach(async (item) => {
      await OrderItemModel.destroy({
        where: {
          id: item.id
        }
      });
    });

    await OrderModel.update({
      customer_id: entity.customer_id,
      total: entity.total(),
    }, {
      where: {
        id: entity.id
      }
    });

    await customerRepository.addRewardPoints(entity.customer_id, entity.total() / 2);


    entity.items.forEach(async (item) => {
      const { id, name, price, productId, quantity } = item;
      await OrderItemModel.create({
        id,
        name,
        price,
        product_id: productId,
        quantity,
        order_id: entity.id
      });
    })

  }

  async find(id: string): Promise<Order> {
    let order;
    try {
      order = await OrderModel.findOne({
        where: { id },
        include: ["items"],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }
    return order.toJSON();
  }

  async findAll(): Promise<Order[]> {
    const orders: Order[] = [];
    const listOrder = await OrderModel.findAll({ include: ["items"] });
    listOrder.map(order => {
      const ordem = new Order(
        order.id,
        order.customer_id,
        order.items.map(item => {
          return new OrderItem(
            item.id,
            item.name,
            item.price / item.quantity,
            item.product_id,
            item.quantity
          );
        }),
      );
      orders.push(ordem);
    });
    return orders;
  }
}
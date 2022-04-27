import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import RepositoryInterface from "./repository.interface";



export default interface OrderRepositoryInterface extends RepositoryInterface<Order> {}

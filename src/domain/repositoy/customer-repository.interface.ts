import Customer from "../entity/customer";
import RepositoryInterface from "./repository.interface";


export default interface CustomerRepositoryInterface extends RepositoryInterface<Customer> {
  addRewardPoints(customer_id: string, points: number): Promise<void>;
  removeRewardPoints(customer_id: string, points: number): Promise<void>;
}
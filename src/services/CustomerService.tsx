import { BaseService } from "./BaseService";
import { customerDataSchema } from "@/types/Customer";

export class CustomerService extends BaseService {
  constructor() {
    super("/customers")
  }
  
  async getSelectOptions() {
    const customers = await this.getAll(customerDataSchema.array());
    return customers.map(customer => ({
      value: customer.id.toString(),
      label: customer.name
    }));
  }
}
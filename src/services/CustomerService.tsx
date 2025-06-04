import { BaseService } from "./BaseService";
import { customerDataSchema } from "@/types/Customer";
import { z } from 'zod';


export class CustomerService extends BaseService {
  constructor() {
    super("/customers")
  }
  
  async getSelectOptions() {
    const response = await this.getAll();
    const customers = z.array(customerDataSchema).parse(response.data);

    return customers.map(customer => ({
      value: customer.id.toString(),
      label: customer.name
    }));
  }
}
import { BaseService } from "./BaseService";
import { customerSchema } from "@/types/Customer";
import { z } from 'zod';


export class CustomerService extends BaseService {
  constructor() {
    super("/customers")
  }
  
  async getSelectOptions() {
    const response = await this.getAll();
    const customers = z.array(customerSchema).parse(response.data);

    return customers.map(customer => ({
      value: customer.company_id.toString(),
      label: customer.name
    }));
  }
}
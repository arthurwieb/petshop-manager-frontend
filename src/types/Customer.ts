import { z } from "zod";

export const customerDataSchema = z.object({
  id: z.coerce.number().int(),
  company_id: z.number(),
  name: z.string(),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  address: z.string().nullable().optional()
});

export const customerSchema = customerDataSchema.omit({ id: true});

export type customerData = z.infer<typeof customerDataSchema>;
export type customerForm = z.infer<typeof customerSchema>;
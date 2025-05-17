import { z } from "zod";

export const customerSchema = z.object({
  id: z.number(),
  company_id: z.number(),
  name: z.string(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export type customerData = z.infer<typeof customerSchema>;
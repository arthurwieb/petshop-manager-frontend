import { z } from "zod";

export const userDataSchema = z.object({
  id: z.coerce.number().int(),
  company_id: z.number(),
  name: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string().email().nullable().optional(),
});

export type userData = z.infer<typeof userDataSchema>;
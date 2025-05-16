import { z } from "zod";

export const petSchema = z.object({
  name: z.string().min(1, "Name is required").regex(/^[^0-9]*$/, "Name cannot contain numbers"),
  species: z.string().min(1, "Species is required").regex(/^[^0-9]*$/, "Specie cannot contain numbers"),
  breed: z.string().optional(),
  age: z.coerce.number().int().nonnegative().optional(),
  company_id: z.number().int(),
  customer_id: z.number().int(),
});

export type PetFormData = z.infer<typeof petSchema>;
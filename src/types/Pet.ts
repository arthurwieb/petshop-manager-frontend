import { z } from "zod";

export const petSchemaData = z.object({
  id: z.coerce.number().int(),
  company_id: z.number().int(),
  customer_id: z.coerce.number().int(),
  name: z.string().min(1, "Name is required").regex(/^[^0-9]*$/, "Name cannot contain numbers"),
  species: z.string().min(1, "Species is required").regex(/^[^0-9]*$/, "Specie cannot contain numbers"),
  breed: z.string().nullable().optional(),
  age: z.coerce.number().int().nonnegative().optional(),
  notes: z.string().nullable().optional()
});

export const petSchema = petSchemaData.omit({ id: true });

export type PetData = z.infer<typeof petSchemaData>;
export type PetFormData = z.infer<typeof petSchema>;
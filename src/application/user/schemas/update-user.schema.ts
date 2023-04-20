import { z } from "zod";

export const UpdateUserCommandSchema = z.object({
  userId: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
});

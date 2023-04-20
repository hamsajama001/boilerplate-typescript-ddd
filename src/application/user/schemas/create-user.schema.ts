import { z } from "zod";

export const CreateUserCommandSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

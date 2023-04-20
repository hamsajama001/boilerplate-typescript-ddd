import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

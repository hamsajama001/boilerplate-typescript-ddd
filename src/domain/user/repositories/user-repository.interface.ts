import { User } from "../models/user";

export interface UserRepository {
  create(user: User): Promise<User>;
  update(userId: string, user: Partial<User>): Promise<User>;
}

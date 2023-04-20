import { handler as createUserHandler } from "./user/create-user";
import { handler as updateUserHandler } from "./user/update-user";

export const createUser = createUserHandler;
export const updateUser = updateUserHandler;

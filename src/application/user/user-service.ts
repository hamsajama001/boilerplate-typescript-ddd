import { User } from "../../domain/user/models/user";
import { UserRepository } from "../../domain/user/repositories/user-repository.interface";
import { CreateUserCommand } from "./commands/create-user.command";
import { UpdateUserCommand } from "./commands/update-user.command";
import { UserCreatedEvent } from "./events/user-created.event";
import { UserUpdatedEvent } from "./events/user-updated.event";
import { EventBridgeBus } from "../../infrastructure/events/eventbridge";
import { UserAggregate } from "../../domain/user/models/user.aggregate";

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private eventBus: EventBridgeBus
  ) {}

  async createUser(command: CreateUserCommand): Promise<User> {
    // Add validation or any business logic here

    const user: User = {
      name: command.name,
      email: command.email,
      password: command.password,
    };

    const createdUser = await this.userRepository.create(user);
    const userAggregate = new UserAggregate(createdUser);

    // Emit UserCreatedEvent
    const userCreatedEvent = new UserCreatedEvent(userAggregate.user.id ?? "");
    this.eventBus.emit(userCreatedEvent);

    return userAggregate.user;
  }

  async updateUser(command: UpdateUserCommand): Promise<User> {
    // Add validation or any business logic here
    const updates: Partial<User> = {
      name: command.name,
      email: command.email ? command.email : undefined,
      password: command.password,
    };

    const updatedUser = await this.userRepository.update(
      command.userId,
      updates
    );
    const userAggregate = new UserAggregate(updatedUser);

    // Emit UserUpdatedEvent
    const userUpdatedEvent = new UserUpdatedEvent(userAggregate.user.id ?? "");
    this.eventBus.emit(userUpdatedEvent);

    return userAggregate.user;
  }
}

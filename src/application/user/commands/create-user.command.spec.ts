import { UserService } from "../user-service";
import { EventBridgeBus } from "../../../infrastructure/events/eventbridge";
import { UserRepository } from "../../../domain/user/repositories/user-repository.interface";
import { UserRepositoryImpl } from "../../../infrastructure/repository/user-repository.impl";
import { User } from "../../../domain/user/models/user";
import { UpdateUserCommand } from "./update-user.command";
import { CreateUserCommand } from "./create-user.command";

// Mock the UserRepository and EventBridgeBus
jest.mock("../../../domain/user/repositories/user-repository.interface");
jest.mock("../../../infrastructure/events/eventbridge");
jest.mock("../../../infrastructure/repository/user-repository.impl");

describe("UserService", () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let eventBus: jest.Mocked<EventBridgeBus>;

  beforeEach(() => {
    userRepository =
      new UserRepositoryImpl() as jest.Mocked<UserRepositoryImpl>;
    eventBus = new EventBridgeBus("test-bus") as jest.Mocked<EventBridgeBus>;
    userService = new UserService(userRepository, eventBus);
  });

  // Add test cases here
  describe("createUser", () => {
    it("should create a user and emit a UserCreatedEvent", async () => {
      // Given
      const user: User = {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      userRepository.create.mockResolvedValue(user);

      const createUserCommand: CreateUserCommand = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      // When
      const result = await userService.createUser(createUserCommand);

      // Then
      expect(userRepository.create).toHaveBeenCalledWith(createUserCommand);
      expect(eventBus.emit).toHaveBeenCalledWith(expect.anything());
      expect(result).toEqual(user);
    });
  });

  describe("updateUser", () => {
    it("should update a user and emit a UserUpdatedEvent", async () => {
      // Given
      const updatedUser: User = {
        id: "1",
        name: "John Doe Updated",
        email: "john.doe@example.com",
        password: "password123",
      };

      userRepository.update.mockResolvedValue(updatedUser);

      const updateUserCommand: UpdateUserCommand = {
        userId: "1",
        name: "John Doe Updated",
        email: "john.doe@example.com",
        password: "password123",
      };

      // When
      const result = await userService.updateUser(updateUserCommand);

      // Then
      expect(userRepository.update).toHaveBeenCalledWith("1", {
        name: "John Doe Updated",
        email: "john.doe@example.com",
        password: "password123",
      });
      expect(eventBus.emit).toHaveBeenCalledWith(expect.anything());
      expect(result).toEqual(updatedUser);
    });
  });
});

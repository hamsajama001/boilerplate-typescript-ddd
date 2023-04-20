import { APIGatewayProxyEvent } from "aws-lambda";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { UserRepositoryImpl } from "../../infrastructure/repository/user-repository.impl";
import { UserService } from "../../application/user/user-service";
import { EventBridgeBus } from "../../infrastructure/events/eventbridge";
import { CreateUserCommandSchema } from "../../application/user/schemas/create-user.schema";
import { z } from "zod";

export interface CreateUserEvent extends APIGatewayProxyEvent {
  body: string;
}

export const handler: APIGatewayProxyHandlerV2<CreateUserEvent> = async (
  event
) => {
  const userService = new UserService(
    new UserRepositoryImpl(),
    new EventBridgeBus("your-event-bus-name")
  );

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Request body is missing" }),
    };
  }

  try {
    const createUserCommand = CreateUserCommandSchema.parse(
      JSON.parse(event.body)
    );
    const createdUser = await userService.createUser(createUserCommand);

    return {
      statusCode: 201,
      body: JSON.stringify(createdUser),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid user data",
          details: error.errors, // This will contain details about the validation errors
        }),
      };
    } else {
      // Handle other errors (e.g., from the userService.createUser method)
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Internal server error",
        }),
      };
    }
  }
};

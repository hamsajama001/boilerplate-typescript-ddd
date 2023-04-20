import { APIGatewayProxyEvent, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { UserRepositoryImpl } from "../../infrastructure/repository/user-repository.impl";
import { EventBridgeBus } from "../../infrastructure/events/eventbridge";
import { UserService } from "../../application/user/user-service";
import { UpdateUserCommandSchema } from "../../application/user/schemas/update-user.schema";
import { z } from "zod";

interface UpdateUserEvent extends APIGatewayProxyEvent {
  body: string;
}

export const handler: APIGatewayProxyHandlerV2<UpdateUserEvent> = async (
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
    const updateUserCommand = UpdateUserCommandSchema.parse(
      JSON.parse(event.body)
    );
    const updatedUser = await userService.updateUser(updateUserCommand);

    return {
      statusCode: 200,
      body: JSON.stringify(updatedUser),
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
      // Handle other errors (e.g., from the userService.updateUser method)
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Internal server error",
        }),
      };
    }
  }
};

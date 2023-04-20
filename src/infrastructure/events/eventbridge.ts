import { EventBridge } from "aws-sdk";

export class EventBridgeBus {
  private eventBridge: EventBridge;
  private eventBusName: string;

  constructor(eventBusName: string) {
    this.eventBridge = new EventBridge();
    this.eventBusName = eventBusName;
  }

  async emit(event: any): Promise<void> {
    const eventName = event.constructor.name;
    const params = {
      Entries: [
        {
          EventBusName: this.eventBusName,
          Source: "your.application.source", // Customize this value
          DetailType: eventName,
          Detail: JSON.stringify(event),
          Time: new Date(),
        },
      ],
    };

    try {
      await this.eventBridge.putEvents(params).promise();
    } catch (error) {
      console.error("Error sending event to EventBridge:", error);
      throw error;
    }
  }
}

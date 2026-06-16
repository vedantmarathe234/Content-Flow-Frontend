import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let client = null;

export const connectNotifications = (
  userId,
  onMessage
) => {

  client = new Client({

    webSocketFactory: () =>
      new SockJS(
        "http://localhost:8080/ws"
      ),

    reconnectDelay: 5000,

    onConnect: () => {

      console.log(
        "WebSocket Connected"
      );

      client.subscribe(
        `/topic/notifications/${userId}`,
        (message) => {

          const notification =
            JSON.parse(message.body);

          onMessage(notification);

        }
      );
    }
  });

  client.activate();
};

export const disconnectNotifications = () => {

  if (client) {
    client.deactivate();
  }
};
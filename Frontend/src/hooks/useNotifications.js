import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to the backend
    const socket = io("http://localhost:5000", {
      transports: ["websocket", "polling"] // Force clean connection attempt
    });

    socket.on("connect", () => {
      console.log("Connected to Notification Server");
    });

    socket.on("newOrder", (data) => {
      setNotifications((prev) => [
        { id: Date.now(), type: "order", ...data, message: "New Order Received!" },
        ...prev,
      ]);
    });

    socket.on("newRental", (data) => {
      setNotifications((prev) => [
        { id: Date.now(), type: "rental", ...data, message: "New Rental Booked!" },
        ...prev,
      ]);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket Connection Error:", err.message);
    });

    return () => {
      socket.off("newOrder");
      socket.off("newRental");
      socket.disconnect();
    };
  }, []);

  return notifications;
}
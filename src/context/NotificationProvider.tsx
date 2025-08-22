"use client";

import { App } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { NotificationInstance } from "antd/es/notification/interface";
import { createContext, ReactNode, useContext } from "react";

// Define the context type
interface NotificationContextType {
  notifySuccess: (content: string, duration?: number) => void;
  notifyError: (content: string, duration?: number) => void;
  notifyInfo: (content: string, duration?: number) => void;
  notifyWarning: (content: string, duration?: number) => void;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Create a provider component
export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const staticFunction = App.useApp();
  const messageApi = staticFunction.message;
  const notificationApi = staticFunction.notification;

  /**
   * Displays a success notification message.
   *
   * @param content - The message content to display.
   * @param duration - The duration (in seconds) for which the message is visible. Defaults to 3 seconds.
   */
  const notifySuccess = (content: string, duration: number = 3) => {
    messageApi.success(content, duration);
  };

  /**
   * Displays an error notification message.
   *
   * @param title - The title of the error message.
   * @param description - The description of the error message.
   * @param duration - The duration (in seconds) for which the message is visible. Defaults to 3 seconds.
   */
  const notifyError = (content: string, duration: number = 3) => {
    messageApi.error(content, duration);
  };

  /**
   * Displays an info notification message.
   *
   * @param content - The message content to display.
   * @param duration - The duration (in seconds) for which the message is visible. Defaults to 3 seconds.
   */
  const notifyInfo = (content: string, duration: number = 3) => {
    messageApi.info(content, duration);
  };

  /**
   * Displays a warning notification message.
   *
   * @param content - The message content to display.
   * @param duration - The duration (in seconds) for which the message is visible. Defaults to 3 seconds.
   */
  const notifyWarning = (content: string, duration: number = 3) => {
    messageApi.warning(content, duration);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifySuccess,
        notifyError,
        notifyInfo,
        notifyWarning,
        messageApi,
        notificationApi,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// Create a custom hook to use the notification context
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}

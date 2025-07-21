"use client";
import React, {
     createContext,
     useContext,
     ReactNode,
     FC,
     useState,
     Dispatch,
     SetStateAction,
} from "react";

interface NotificationContextType {
     notifications: any;
     setNotifications: Dispatch<SetStateAction<any>>;
}

interface NotificationsProviderProps {
     children: ReactNode;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
     undefined
);

export const useNotifications = () => {
     const context = useContext(NotificationContext);

     if (!context)
          throw new Error(
               "useNotifications must be used within a NotificationsProvider"
          );

     return context;
};

export const NotificationsProvider: FC<NotificationsProviderProps> = ({
     children,
}) => {
     const [notifications, setNotifications] = useState<any>();

     return (
          <NotificationContext.Provider
               value={{
                    notifications,
                    setNotifications,
               }}
          >
               {children}
          </NotificationContext.Provider>
     );
};